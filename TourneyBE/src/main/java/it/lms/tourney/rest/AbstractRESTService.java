
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
        log.debug(logId() + "RemoteHost=" + host);

        String addr = request.getRemoteAddr();
        log.debug(logId() + "RemoteAddr=" + addr);

        String path = request.getContextPath();
        log.debug(logId() + "PATH=" + path);

        String uri = request.getRequestURI();
        log.debug(logId() + "URI=" + uri);

        String url = request.getRequestURI();
        log.debug(logId() + "URL=" + url);

        String authType = request.getAuthType();
        log.debug(logId() + "AuthType=" + authType);

        String remoteUser = request.getRemoteUser();
        log.debug(logId() + "RemoteUser=" + remoteUser);

        Principal principal = getPrincipal();
        log.debug(logId() + "Principal=" + principal);
        if (principal != null) {
            log.debug(logId() + "Principal.getName()=" + principal.getName());
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
