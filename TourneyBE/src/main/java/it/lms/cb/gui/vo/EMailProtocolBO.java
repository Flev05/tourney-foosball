
package it.lms.cb.gui.vo;

public class EMailProtocolBO {

    private String  companyName;
    private String  protocolType;
    private String  mailServerHost;
    private Integer mailServerPort;
    private String  mailServerUsername;
    private String  mailServerPassword;
    private String  companyEMail;
    private String  toEMailAddress;
    private String  subject;
    private String  payConfirmText;
    private String  pdfAttachedFile;

    public EMailProtocolBO() {

    }

    public static EMailProtocolBO copy(EMailProtocolBO bo) {

        EMailProtocolBO newBo = new EMailProtocolBO();
        newBo.companyName = bo.companyName;
        newBo.protocolType = bo.protocolType;
        newBo.mailServerHost = bo.mailServerHost;
        newBo.mailServerPort = bo.mailServerPort;
        newBo.mailServerUsername = bo.mailServerUsername;
        newBo.mailServerPassword = bo.mailServerPassword;
        newBo.companyEMail = bo.companyEMail;
        newBo.toEMailAddress = bo.toEMailAddress;
        newBo.subject = bo.subject;
        newBo.payConfirmText = bo.payConfirmText;
        newBo.pdfAttachedFile = bo.pdfAttachedFile;
        return newBo;
    }

    @Override
    public String toString() {

        return "EMailProtocolBO [protocolType=" + protocolType + "\n, companyName=" + companyName
                + "\n, mailServerHost=" + mailServerHost + "\n, mailServerPort=" + mailServerPort
                + "\n, mailServerUsername=" + mailServerUsername + "\n, mailServerPassword=" + mailServerPassword
                + "\n, companyEMail=" + companyEMail + "\n, toEMailAddress=" + toEMailAddress + "\n, subject=" + subject
                + "\n, payConfirmText=" + payConfirmText + "\n, pdfAttachedFile=" + pdfAttachedFile + "]";
    }

    public String getCompanyName() {

        return companyName;
    }

    public void setCompanyName(String companyName) {

        this.companyName = companyName;
    }

    public String getProtocolType() {

        return protocolType;
    }

    public void setProtocolType(String mailProtocol) {

        this.protocolType = mailProtocol;
    }

    public String getMailServerHost() {

        return mailServerHost;
    }

    public void setMailServerHost(String mailServerHost) {

        this.mailServerHost = mailServerHost;
    }

    public Integer getMailServerPort() {

        return mailServerPort;
    }

    public void setMailServerPort(Integer mailServerPort) {

        this.mailServerPort = mailServerPort;
    }

    public String getMailServerUsername() {

        return mailServerUsername;
    }

    public void setMailServerUsername(String mailServerUsername) {

        this.mailServerUsername = mailServerUsername;
    }

    public String getMailServerPassword() {

        return mailServerPassword;
    }

    public void setMailServerPassword(String mailServerPassword) {

        this.mailServerPassword = mailServerPassword;
    }

    public String getCompanyEMail() {

        return companyEMail;
    }

    public void setCompanyEMail(String companyEMail) {

        this.companyEMail = companyEMail;
    }

    public String getToEMailAddress() {

        return toEMailAddress;
    }

    public void setToEMailAddress(String toEMailAddress) {

        this.toEMailAddress = toEMailAddress;
    }

    public String getSubject() {

        return subject;
    }

    public void setSubject(String subject) {

        this.subject = subject;
    }

    public String getPayConfirmText() {

        return payConfirmText;
    }

    public void setPayConfirmText(String payConfirmText) {

        this.payConfirmText = payConfirmText;
    }

    public String getPdfAttachedFile() {

        return pdfAttachedFile;
    }

    public void setPdfAttachedFile(String pdfAttachedFile) {

        this.pdfAttachedFile = pdfAttachedFile;
    }
}
