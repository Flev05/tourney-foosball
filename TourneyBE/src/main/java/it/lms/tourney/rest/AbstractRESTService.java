
package it.lms.tourney.rest;

import java.security.Principal;

import it.lms.tourney.cdi.AbstractLogger;
import lombok.extern.slf4j.Slf4j;

/**
 * Abstract class for common data and operation for any REST service
 * 
 * @author luciano martino
 *
 */
@Slf4j
public abstract class AbstractRESTService extends AbstractLogger {

	protected String getUserAgent() {
		String userAgent = request.getHeader("User-Agent");
		return userAgent;
	}

	protected void printAuthentication() {
		String host = request.getRemoteHost();
		log.info(logId() + "RemoteHost=" + host);

		String addr = request.getRemoteAddr();
		log.info(logId() + "RemoteAddr=" + addr);

		String path = request.getContextPath();
		log.info(logId() + "PATH=" + path);

		String uri = request.getRequestURI();
		log.info(logId() + "URI=" + uri);

		String url = request.getRequestURI();
		log.info(logId() + "URL=" + url);

		String authType = request.getAuthType();
		log.info(logId() + "AuthType=" + authType);

		String remoteUser = request.getRemoteUser();
		log.info(logId() + "RemoteUser=" + remoteUser);

		Principal principal = getPrincipal();
		log.info(logId() + "Principal=" + principal);
		if (principal != null) {
			log.info(logId() + "Principal.getName()=" + principal.getName());
		}
	}

	private Principal getPrincipal() {
		Principal principal = request.getUserPrincipal();
		return principal;
	}

	protected void invalidateSession() {
		request.getSession().invalidate();
	}
}
