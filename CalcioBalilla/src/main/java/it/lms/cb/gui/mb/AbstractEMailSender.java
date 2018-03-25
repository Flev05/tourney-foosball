
package it.lms.cb.gui.mb;

import java.security.GeneralSecurityException;
import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import com.sun.mail.util.MailSSLSocketFactory;

import it.lms.cb.gui.vo.EMailProtocolBO;

/**
 * Best effort mail sender
 * 
 * @param email source mail address
 * @param pdfAttachedFile the real PDF file to send
 * @param pdfFileName the name of the PDF attached file
 * @param sender the instance of email sender
 */
public abstract class AbstractEMailSender {

    private static final Logger   logger                      = LogManager.getLogger(AbstractEMailSender.class);

    static protected final String MAIL_SERVER_HOST            = "smtp.gmail.com";
    static protected final int    MAIL_SERVER_PORT            = 587;
    static protected final String MAIL_SERVER_USERNAME        = "luciano.martino@gmail.com";
    static protected final String MAIL_SERVER_PASSWORD        = "MELuemi1963";

    static public final String    SMTP_PROTOCOL               = "SMTP";
    static public final String    SMTP_PROTOCOL_CODE          = "0";

    static public final String    SMTP_SSL_PROTOCOL           = "SMTP + SSL";
    static public final String    SMTP_SSL_PROTOCOL_CODE      = "1";

    static public final String    SMTP_STARTTLS_PROTOCOL      = "SMTP + STARTTLS";
    static public final String    SMTP_STARTTLS_PROTOCOL_CODE = "2";

    protected boolean             DEBUG_SESSION               = false;

    private EMailProtocolBO       bo;

    protected AbstractEMailSender(EMailProtocolBO bo) {

        this.bo = bo;
    }

    public EMailProtocolBO getBo() {

        return bo;
    }

    protected Session createSmtpSession() throws MessagingException {

        logger.debug("Entering createSmtpSession()");

        Properties props = new Properties();

        props.setProperty("mail.smtp.host", bo.getMailServerHost());
        props.setProperty("mail.smtp.port", "" + bo.getMailServerPort());
        // props.setProperty("mail.smtp.localhost", "www.erebus-soft.com" );

        props.setProperty("mail.smtp.auth", "false");
        if (bo.getMailServerPassword() != null && !bo.getMailServerPassword().equals("")) {
            props.setProperty("mail.smtp.auth", "true");
        }

        props.setProperty("mail.transport.protocol", "smtp");

        props.setProperty("mail.smtp.ssl.checkserveridentity", "false");
        props.setProperty("mail.smtp.ssl.trust", "*");

        if (bo.getProtocolType().equals(SMTP_SSL_PROTOCOL)) {
            MailSSLSocketFactory socketFactory;
            try {
                socketFactory = new MailSSLSocketFactory();
            } catch (GeneralSecurityException e) {
                System.err.println("unable to create MailSSLSocketFactory()");
                throw new MessagingException(e.toString());
            }

            socketFactory.setTrustAllHosts(true);

            props.setProperty("mail.smtp.socketFactory.port", "" + bo.getMailServerPort());

            props.put("mail.smtp.socketFactory", socketFactory);
        }

        if (bo.getProtocolType().equals(SMTP_STARTTLS_PROTOCOL)) {
            props.setProperty("mail.smtp.starttls.enable", "true");

            props.setProperty("mail.smtp.ssl.checkserveridentity", "false");
            props.setProperty("mail.smtp.ssl.trust", "*");
        }

        if (bo.getProtocolType().equals(SMTP_PROTOCOL)) {
            if (bo.getMailServerPassword() != null && !bo.getMailServerPassword().equals("")) {
                props.setProperty("mail.smtp.auth", "true");
            }
        }

        javax.mail.Authenticator authenticator = new javax.mail.Authenticator() {

            protected PasswordAuthentication getPasswordAuthentication() {

                return new PasswordAuthentication(bo.getMailServerUsername(), bo.getMailServerPassword());
            }
        };

        Session session = Session.getInstance(props, authenticator);

        try {
            session.getProperties().list(System.out);
        } catch (Exception e) {
        }

        return session;
    }
}
