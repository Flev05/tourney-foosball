
package it.lms.tourney.rest;

import java.security.Principal;

import it.lms.tourney.cdi.AbstractLogger;

public abstract class AbstractRESTService extends AbstractLogger {

    protected String getUserAgent() {

        String userAgent = request.getHeader("User-Agent");
        return userAgent;
    }

    protected void printAuthentication() {

        String host = request.getRemoteHost();
        logger.debug(logId() + "RemoteHost=" + host);

        String addr = request.getRemoteAddr();
        logger.debug(logId() + "RemoteAddr=" + addr);

        String path = request.getContextPath();
        logger.debug(logId() + "PATH=" + path);

        String uri = request.getRequestURI();
        logger.debug(logId() + "URI=" + uri);

        String url = request.getRequestURI();
        logger.debug(logId() + "URL=" + url);

        String authType = request.getAuthType();
        logger.debug(logId() + "AuthType=" + authType);

        String remoteUser = request.getRemoteUser();
        logger.debug(logId() + "RemoteUser=" + remoteUser);

        Principal principal = getPrincipal();
        logger.debug(logId() + "Principal=" + principal);
        if (principal != null) {
            logger.debug(logId() + "Principal.getName()=" + principal.getName());
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
