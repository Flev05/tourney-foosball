
package it.lms.cb.gui.mb;

import it.lms.cb.gui.vo.EMailProtocolBO;
import jakarta.mail.Address;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

public class TestMailer extends AbstractEMailSender {

	private TestMailer(EMailProtocolBO bo) {

		super(bo);
	}

	/**
	 * Send a single email.
	 * 
	 * @throws MessagingException
	 */
	public static void testSendEmail(EMailProtocolBO bo) throws Exception {

		TestMailer tm = new TestMailer(bo);

		Session mailSession = tm.createSmtpSession();
		mailSession.setDebug(true);

		Transport transport = mailSession.getTransport();

		MimeMessage message = new MimeMessage(mailSession);

		InternetAddress fromEMailAddress = new InternetAddress(bo.getCompanyEMail(), bo.getCompanyName());
		message.setFrom(fromEMailAddress);

		InternetAddress toEMailAddress = new InternetAddress(bo.getToEMailAddress());
		message.addRecipient(Message.RecipientType.TO, toEMailAddress);

		message.setSubject("HTML  mail with images");
		message.setContent("<h1>Hello world</h1>", "text/html");

		transport.connect();

		Address[] recipients = message.getRecipients(Message.RecipientType.TO);

		transport.sendMessage(message, recipients);
	}

	public static void main(String[] args) throws Exception {

		EMailProtocolBO bo = new EMailProtocolBO();

		bo.setCompanyName("Caputo Bus - Biglietteria Online");
		bo.setCompanyEMail("biglietteriaonline@caputobus.it");
		bo.setMailServerHost("outmail.impresasemplice.it");
		bo.setMailServerPort(25);
		bo.setProtocolType(SMTP_PROTOCOL);

		bo.setMailServerUsername("Admin270924@caputobus.191.it");
		bo.setMailServerPassword("Setra431DT");

		bo.setToEMailAddress("luciano.martino@gmail.com");

		testSendEmail(bo);
	}
}
