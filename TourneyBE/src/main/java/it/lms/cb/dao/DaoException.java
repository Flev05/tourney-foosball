
package it.lms.cb.dao;

public class DaoException extends Exception {

    private static final long serialVersionUID = 1L;
    private String            defaultExceptionMsg;
    private Exception         rootException;

    public DaoException() {

    }

    public DaoException(String message) {

        super(message);
    }

    public DaoException(String message, Exception ex) {

        super(message, ex);
    }

    public DaoException(Exception rootException) {

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
