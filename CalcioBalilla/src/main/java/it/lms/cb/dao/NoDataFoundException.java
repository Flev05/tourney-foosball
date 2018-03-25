
package it.lms.cb.dao;

public class NoDataFoundException extends DaoException {

    private static final long serialVersionUID = 2377425821506892973L;

    public NoDataFoundException() {

    }

    public NoDataFoundException(String defaultExceptionMsg) {

        super(defaultExceptionMsg);
    }

    public NoDataFoundException(Exception rootException) {

        super(rootException);
    }

    public NoDataFoundException(String defaultExceptionMsg, Exception rootException) {

        super(defaultExceptionMsg, rootException);
    }

}
