
package it.lms.cb.gui.exc;

public class NotActiveUserException extends Exception {

    private static final long serialVersionUID = 1L;

    public NotActiveUserException() {

    }

    public NotActiveUserException(String message) {

        super(message);
    }

    public NotActiveUserException(String message, Exception ex) {

        super(message, ex);
    }
}
