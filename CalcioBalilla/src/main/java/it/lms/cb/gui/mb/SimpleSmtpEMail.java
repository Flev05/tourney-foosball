/*
  Copyright (c) by SSB Spa Societa' per i Servizi Bancari

  Note:

 */

package it.lms.cb.gui.mb;

import java.util.Properties;
import java.util.StringTokenizer;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import com.sun.mail.smtp.SMTPSendFailedException;

/**
 * Questa classe fornisce le funzionalit� di un semplice messaggio SMTP.
 */
public class SimpleSmtpEMail {

    private static final Logger logger            = LogManager.getLogger(SimpleSmtpEMail.class);

    private String              _message          = null;
    private String              _to               = null;
    private String              _cc               = null;
    private String              _bcc              = null;
    private String              _from             = null;
    private String              _subject          = null;
    private String              _replayto         = null;
    private Session             _session          = null;
    private String              _charset          = "ISO-8859-1";
    private String              _mimeType         = "plain";
    private String              _nameFrom         = null;

    private static Properties   _configProps      = new Properties();
    private static Properties   _configPropsBackup;

    static private final String GMAIL_SERVER_PORT = "587";
    static private final String GMAIL_SERVER_HOST = "smtp.gmail.com";

    static private final String ARUBA_SERVER_PORT = "000";
    static private final String ARUBA_SERVER_HOST = "smtps.aruba.it";

    static {

        String host = GMAIL_SERVER_HOST;
        _configProps.put("mail.smtp.host", host);
        _configProps.put("mail.smtp.port", GMAIL_SERVER_PORT);

        // String src = null;
        // if (src != null) {
        // _configProps.put("mail.smtp.localaddress", localaddress);
        // }
        // String hostname = null;
        // if (hostname != null) {
        // _configProps.put("mail.smtp.localhost", localhost);
        // }

        _configProps.put("mail.smtp.connectiontimeout", "2000");

        _configProps.put("mail.smtp.timeout", "3000");

        _configProps.put("mail.smtp.sendpartial", "true");

        // Se esiste un mailhost di backup creo la configurazione
        String host2 = "smtps.aruba.it";
        if (host2 != null) {
            _configPropsBackup = (Properties) _configProps.clone();
            _configPropsBackup.put("mail.smtp.host", ARUBA_SERVER_HOST);
            _configPropsBackup.put("mail.smtp.port", ARUBA_SERVER_PORT);
        }
    }

    /**
     * Costruttore. Legge dal file di configurazione alcune proprieta' per impostare i parametri di connessine al server
     * SMTP:
     * <p>
     * mail.smtp.localaddress
     * <p>
     * mail.smtp.connectiontimeout - default 2 sec
     * <p>
     * mail.smtp.timeout - default 3 sec
     * <p>
     * mail.smtp.sendpartial - defailt true
     * <p>
     * 
     * 
     * @exception net.ssb.errors.AppCrash. Se si � verificato un errore di input/output.
     */
    public SimpleSmtpEMail() {

    }

    /**
     * Imposta l'host e la porta da utilizzare come gateway SMTP. Il formato del pafametro in ingresso e': host[:port]
     * <p>
     * la parte port e' facoltativa. Se non e' presente si utilizza il default: 25
     * 
     * 
     * @param host java.lang.String host.
     */
    public void setHost(String host) {

        String[] hostPort = host.split(":");

        _configProps.put("mail.smtp.host", hostPort[0]);

        if (hostPort.length > 1) {
            _configProps.put("mail.smtp.port", hostPort[1]);
        } else {
            _configProps.put("mail.smtp.port", "25");
        }
        _session = null;

        // Ricrea la session
        _session = getSession();
    }

    /**
     * Imposta il messaggio da spedire.
     * 
     * @param message java.lang.String messaggio da spedire.
     */
    public void setMessage(String message) {

        _message = message;
    }

    /**
     * Ritorna il messaggio da spedire.
     * 
     * @return java.lang.String Il messaggio da spedire.
     */
    private String getMessage() {

        return _message;
    }

    /**
     * Imposta il destinatario del messaggio.
     * 
     * @param to java.lang.String destinatario del messaggio.
     */
    public void setTo(String to) {

        _to = to;
    }

    /**
     * Questo metodo
     * 
     * @param cc DOCUMENT ME!
     */
    public void setCc(String cc) {

        _cc = cc;
    }

    /**
     * Questo metodo
     * 
     * @param bcc DOCUMENT ME!
     */
    public void setBcc(String bcc) {

        _bcc = bcc;
    }

    /**
     * Imposta il mittente del messaggio.
     * 
     * @param from java.lang.String mittente del messaggio.
     */
    public void setFrom(String from) {

        _from = from;
    }

    /**
     * Imposta l'indirizzo da usare come "Replay to:"
     * 
     * @param replayto java.lang.String indirizzo.
     */
    public void setReplayTo(String replayto) {

        _replayto = replayto;
    }

    /**
     * Ottiene l'indirizzo da usare come "Replay to:"
     * 
     * @return java.lang.String indirizzo usato come "Replay to:".
     */
    public String getReplayTo() {

        return _replayto;
    }

    /**
     * Imposta il subject.
     * 
     * @param subject java.lang.String soggetto dell'e-mail.
     */
    public void setSubject(String subject) {

        _subject = subject;
    }

    /**
     * Invia il messaggio specificato all'host sulla porta 25.
     * 
     * @param message java.lang.String messaggio da spedire.
     * 
     * @exception net.ssb.errors.AppCrash Se si � verificato un errore durante l'invio del messaggio.
     */
    public void send(String message) {

        Transport transport = null;
        if (message == null || message.length() == 0) message = _message;
        Address[] destin = null;

        try {
            _message = message;

            // crea il messaggio
            MimeMessage msg = new MimeMessage(getSession());

            // set the from and to address
            InternetAddress addressFrom = new InternetAddress(_from);
            if (_nameFrom != null) {
                addressFrom.setPersonal(_nameFrom);
            }
            msg.setFrom(addressFrom);

            setAddresses(_to, msg, Message.RecipientType.TO);

            if ((_cc != null) && !_cc.equals("")) {
                setAddresses(_cc, msg, Message.RecipientType.CC);
            }

            if ((_bcc != null) && !_bcc.equals("")) {
                setAddresses(_bcc, msg, Message.RecipientType.BCC);
            }

            // Setting the Subject and Content Type
            msg.setSubject(_subject);
            msg.setText(getMessage(), _charset, _mimeType);

            String replayto = getReplayTo();

            if (replayto != null) {
                InternetAddress addressReplayTo = new InternetAddress(replayto);
                msg.setFrom(addressReplayTo);
            }

            msg.saveChanges();

            destin = msg.getAllRecipients();
            if (destin == null) {
                logger.error("Mail error [" + _to + "|" + _cc + "|" + _bcc + "] RC: no valid addr");
                return;
            }

            transport = _session.getTransport("smtp");
            try {
                transport.connect();
            } catch (MessagingException e) {
                if (_configPropsBackup == null) throw e;

                _session = Session.getInstance(_configPropsBackup);
                _session.setDebug(false);
                logger.error("Using backup mailer");

                transport = _session.getTransport("smtp");
                transport.connect();
            }
            transport.sendMessage(msg, destin);

        } catch (SMTPSendFailedException e) {
            int rc = e.getReturnCode();
            Address[] invalid = e.getInvalidAddresses();
            String log = "";
            for (int k = 0; k < invalid.length; k++) {
                log = log + invalid[k].toString() + "|";
            }
            logger.error("Mail error [" + log + "] RC: " + rc);
        } catch (Exception e) {
            logger.error(toString());
        } finally {
            try {
                if (transport != null) transport.close();
            } catch (MessagingException e) {
                // da ignorare
            }
        }
    }

    /**
     * Questo metodo
     * 
     * @param dest DOCUMENT ME!
     * @param msg DOCUMENT ME!
     * @param rt DOCUMENT ME!
     * 
     * @throws AppCrash DOCUMENT ME!
     */
    private void setAddresses(String dest, MimeMessage msg, Message.RecipientType rt) throws Exception {

        StringTokenizer parser = new StringTokenizer(dest, ",");

        while (parser.hasMoreTokens()) {
            try {
                InternetAddress address = new InternetAddress(parser.nextToken().trim());
                msg.addRecipient(rt, address);
            } catch (AddressException err) {
                logger.error("Mail address error [" + dest + "] type: " + rt);
            } catch (MessagingException e) {
                logger.error("Mail address error [" + dest + "] type: ", e);
                throw e;
            }
        }
    }

    private Session getSession() {

        if (_session != null) {
            return _session;
        }

        // create some properties and get a new Session
        _session = Session.getInstance(_configProps, null);
        _session.setDebug(false);

        return _session;
    }

    /**
     * Questo metodo
     * 
     * @param charset
     * 
     * @see net.ssb.misc.SimpleEMail_itf#setCharset(java.lang.String)
     */
    public void setCharset(String charset) {

        _charset = charset;

    }

    /**
     * Questo metodo
     * 
     * @param mimeType
     * 
     * @see net.ssb.misc.SimpleEMail_itf#setMimeType(java.lang.String)
     */
    public void setMimeType(String mimeType) {

        _mimeType = mimeType;

    }

    /**
     * Questo metodo
     * 
     * @param name
     * 
     * @see net.ssb.misc.SimpleEMail_itf#setNameFrom(java.lang.String)
     */
    public void setNameFrom(String name) {

        _nameFrom = name;

    }

    /**
     * Questo metodo
     * 
     * @return
     * 
     * @see net.ssb.misc.SimpleEMail_itf#getNameFrom()
     */
    public String getNameFrom() {

        return _nameFrom;
    }

    /**
     * @autogenerated by CodeHaggis (http://sourceforge.net/projects/haggis)
     * @overwrite toString()
     * @return String returns this object in a String
     */
    public String toString() {

        StringBuilder sb = new StringBuilder();
        sb.append("SimpleSmtpEMail::[");
        sb.append(" " + super.toString() + "");
        sb.append(" _message:=");
        sb.append(_message);
        sb.append(" _to:=");
        sb.append(_to);
        sb.append(" _cc:=");
        sb.append(_cc);
        sb.append(" _bcc:=");
        sb.append(_bcc);
        sb.append(" _from:=");
        sb.append(_from);
        sb.append(" _subject:=");
        sb.append(_subject);
        sb.append(" _replayto:=");
        sb.append(_replayto);
        sb.append(" _session:=");
        sb.append(_session);
        sb.append(" _charset:=");
        sb.append(_charset);
        sb.append(" _mimeType:=");
        sb.append(_mimeType);
        sb.append(" _nameFrom:=");
        sb.append(_nameFrom);
        sb.append(" _configProps:=");
        sb.append(_configProps);
        sb.append(" _configPropsBackup:=");
        sb.append(_configPropsBackup);
        sb.append(']');
        return sb.toString();
    }

}
