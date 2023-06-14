
package it.lms.cb.gui.mb;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.gui.vo.EMailProtocolBO;
import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.mail.BodyPart;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;

/**
 * Best effort mail sender
 * 
 * @param email
 *            source mail address
 * @param pdfAttachedFile
 *            the real PDF file to send
 * @param pdfFileName
 *            the name of the PDF attached file
 * @param sender
 *            the instance of email sender
 */
public class EMailSender extends AbstractEMailSender implements Runnable {

	private static final Logger logger = LogManager.getLogger(EMailSender.class);

	private String pdfFileName;

	protected EMailSender(EMailProtocolBO bo) {

		super(bo);
	}

	public static void sendMail(EMailProtocolBO bo) {

		logger.debug(bo);

		if (bo.getToEMailAddress() == null || bo.getToEMailAddress().equals("")) {
			logger.error("The to mail address is empty, no mail will be sent!");
			return;
		}

		EMailSender sender = new EMailSender(bo);

		File f = new File(sender.getBo().getPdfAttachedFile());
		sender.pdfFileName = f.getName();

		Thread th = new Thread(sender);
		th.start();
	}

	@Override
	public void run() {

		try {
			logger.info("Sending PDF ticket to client: " + getBo().getToEMailAddress());

			sendEmail(getBo().getSubject(), getBo().getPayConfirmText(), getBo().getPdfAttachedFile(), pdfFileName);

			logger.info("PDF ticket successfull sent");

		} catch (Exception e) {
			logger.error("Unable to send e-mail to " + getBo().getToEMailAddress(), e);
		}
	}

	private MimeMessage sendEmail(String subject, String text, String pdfAttachedFile, String pdfFileName)
			throws Exception {

		Session mailSession = createSmtpSession();
		mailSession.setDebug(DEBUG_SESSION);

		try {
			// Create a default MimeMessage object.
			MimeMessage message = new MimeMessage(mailSession);

			// Set From: header field of the header.
			String fromEMailAddress = getBo().getCompanyEMail();
			InternetAddress fromInternetAddress = new InternetAddress(fromEMailAddress, getBo().getCompanyName());
			message.setFrom(fromInternetAddress);

			// Set To: header field of the header.
			String toEMailAddress = getBo().getToEMailAddress();
			InternetAddress toInternetAddress = new InternetAddress(toEMailAddress);
			message.addRecipient(Message.RecipientType.TO, toInternetAddress);

			// Set Subject: header field
			message.setSubject(subject);

			message.setContent(text, "text/plain");

			if (pdfAttachedFile != null) {
				addAttachment(message, text, pdfAttachedFile, pdfFileName);
			}

			// Send message
			Transport.send(message);
			logger.info("Sent message successfully....");

			return message;
		} catch (MessagingException e) {
			logger.error("Send Mail failed", e);
			throw e;
		}
	}

	private void addAttachment(MimeMessage message, String text, String pdfAttachedFile, String pdfFileName)
			throws MessagingException {

		// Create the message part
		BodyPart messageBodyPart = new MimeBodyPart();

		// Fill the message
		messageBodyPart.setText(text);

		// Create a multi part message
		Multipart multipart = new MimeMultipart();

		// Set text message part
		multipart.addBodyPart(messageBodyPart);

		// Part two is attachment
		messageBodyPart = new MimeBodyPart();
		FileInputStream fis;
		ByteArrayDataSource bads;
		try {
			fis = new FileInputStream(pdfAttachedFile);
			bads = new ByteArrayDataSource(fis, "application/pdf");
		} catch (IOException e) {
			logger.error("Unable to read the PDF file", e);
			throw new MessagingException(e.getMessage());
		}
		DataSource source = bads;
		messageBodyPart.setDataHandler(new DataHandler(source));
		messageBodyPart.setFileName(pdfFileName);
		multipart.addBodyPart(messageBodyPart);

		// Send the complete message parts
		message.setContent(multipart);
	}
}
