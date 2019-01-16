
package it.lms.tourney.rest;

import java.security.Principal;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

import org.apache.log4j.Logger;

public abstract class AbstractRESTService {

    @Inject
    protected Logger           logger;

    @Context
    private HttpServletRequest request;

    protected String getSessionId() {

        return request.getSession().getId();
    }

    protected String getUserAgent() {

        String userAgent = request.getHeader("User-Agent");
        return userAgent;
    }

    protected void printAuthentication() {

        String host = request.getRemoteHost();
        logger.debug("RemoteHost=" + host);

        String addr = request.getRemoteAddr();
        logger.debug("RemoteAddr=" + addr);

        String path = request.getContextPath();
        logger.debug("ContextPath=" + path);

        String uri = request.getRequestURI();
        logger.debug("URI=" + uri);

        String url = request.getRequestURI();
        logger.debug("URL=" + url);

        String authType = request.getAuthType();
        logger.debug("AuthType=" + authType);

        String remoteUser = request.getRemoteUser();
        logger.debug("RemoteUser=" + remoteUser);

        Principal principal = getPrincipal();
        logger.debug("Principal=" + principal);
        if (principal != null) {
            logger.debug("Principal.getName()=" + principal.getName());
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
