package it.lms.cb.gui.exc;

public class ConversionException extends Exception {

	private static final long serialVersionUID = 1L;
	private String defaultExceptionMsg;
	private Exception rootException;
	

	public ConversionException() { }
	
	public ConversionException(String message) {
		
		super(message);
	}
	
	public ConversionException(String message, Exception ex) {
		
		super(message, ex);
	}

	public ConversionException(Exception rootException) {
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
