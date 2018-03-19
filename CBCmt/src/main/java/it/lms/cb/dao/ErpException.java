
package it.lms.cb.dao;

public class ErpException extends Exception {

    private static final long serialVersionUID = 1L;
    private String            defaultExceptionMsg;
    private Exception         rootException;

    public ErpException() {

    }

    public ErpException(String message) {

        super(message);
    }

    public ErpException(String message, Exception ex) {

        super(message, ex);
    }

    public ErpException(Exception rootException) {

        this.rootException = rootException;
    }

    public String getDefaultExceptionMsg() {

        return defaultExceptionMsg;
    }

    public void setDefaultExceptionMsg(String defaultExceptionMsg) {

        this.defaultExceptionMsg = defaultExceptionMsg;
    }

    public Exception getRootException() {

        return rootException;
    }

    public void setRootException(Exception rootException) {

        this.rootException = rootException;
    }

}
