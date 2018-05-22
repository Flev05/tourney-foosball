
package it.lms.cb.dao;

/**
 * ConverterException Class. Root class to throw during model components conversion operations.
 */
public class ConverterException extends Exception {

    private static final long serialVersionUID = 530749896653684593L;

    public ConverterException() {

    }

    public ConverterException(String defaultExceptionMsg) {

        super(defaultExceptionMsg);
    }

    public ConverterException(String defaultExceptionMsg, Exception rootException) {

        super(defaultExceptionMsg, rootException);
    }
}
