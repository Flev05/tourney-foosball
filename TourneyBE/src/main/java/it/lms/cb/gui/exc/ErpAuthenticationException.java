package it.lms.cb.gui.exc;


public class ErpAuthenticationException extends Exception {

	private static final long serialVersionUID = 1L;

	public ErpAuthenticationException() { }
	
	public ErpAuthenticationException(String message) {
		
		super(message);
	}
	
	public ErpAuthenticationException(String message, Exception ex) {
		
		super(message, ex);
	}
}
