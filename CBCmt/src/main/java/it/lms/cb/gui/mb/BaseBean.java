/*
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations under
 * the License.
 *
 * The Original Code is ICEfaces 1.5 open source software code, released
 * November 5, 2006. The Initial Developer of the Original Code is ICEsoft
 * Technologies Canada, Corp. Portions created by ICEsoft are Copyright (C)
 * 2004-2011 ICEsoft Technologies Canada, Corp. All Rights Reserved.
 *
 * Contributor(s): _____________________.
 */

package it.lms.cb.gui.mb;

import java.io.Serializable;
import java.security.Principal;
import java.util.Locale;
import java.util.ResourceBundle;

import javax.faces.application.ViewExpiredException;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.event.ValueChangeEvent;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

/**
 * @author Luciano Martino
 */
public abstract class BaseBean implements Serializable {

    private static final long       serialVersionUID = 1L;
    private static final Logger     logger           = LogManager.getLogger(BaseBean.class);

    protected static ResourceBundle resourceBunble   = null;

    private static Locale           currentLocale;

    // the logger for this class
    private String                  language         = "it";
    protected String                jSessionId;

    public BaseBean() {

    }

    public static String i18n(String boundle, String key) {

        String path = boundle.replace('.', '/');
        FacesContext currentInstance = FacesContext.getCurrentInstance();
        currentLocale = currentInstance.getViewRoot().getLocale();
        resourceBunble = ResourceBundle.getBundle(path, currentLocale);

        return resourceBunble.getString(key);
    }

    public static String i18n(String boundle, String key, String token) {

        String ii = i18n(boundle, key);
        ii = ii.replaceAll("\\%1", token);
        return ii;
    }

    public static String i18n(String boundle, String key, String token, Locale currentLocale) {

        String ii = i18n(boundle, key, currentLocale);
        ii = ii.replaceAll("\\%1", token);
        return ii;
    }

    public static String i18n(String boundle, String key, Locale currentLocale) {

        String path = boundle.replace('.', '/');
        ResourceBundle rb = ResourceBundle.getBundle(path, currentLocale);

        return rb.getString(key);
    }

    /**
     * Resets the valueChange effect to fire when the current response is completed.
     *
     * @param event jsf action event
     */
    public void effectChangeListener(ValueChangeEvent event) {

        logger.debug("Entering effectChangeListener()");
    }

    /**
     * Used to initialize the managed bean.
     */
    protected void init() {

    }

    public static String printSessionId() {

        String sessionId = readSessionId();

        return "[" + sessionId + "]";
    }

    private static String readSessionId() {

        FacesContext context = FacesContext.getCurrentInstance();
        if (context == null) {
            return null;
        }
        ExternalContext ec = context.getExternalContext();
        if (ec == null) {
            return null;
        }
        HttpSession session = (HttpSession) ec.getSession(false);
        if (session == null) {
            return null;
        }

        String sessionId = session == null ? "" : session.getId();

        // logger.info("SESSION-ID" + "=" + sessionId);

        return sessionId;
    }

    protected static void checkExpiredSession() {

        String jSessionId = readJSessionId();
        String sessionId = readSessionId();

        if (!jSessionId.equals(sessionId)) {
            throw new ViewExpiredException("checkExpiredSession(): Session was expired...");
        }
    }

    private static String readJSessionId() {

        String jSessionId = "";

        HttpServletRequest request = BaseBean.getRequest();
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                logger.info(cookie.getName() + "=" + cookie.getValue());
                if (cookie.getName().equals("JSESSIONID")) {
                    jSessionId = cookie.getValue();
                }
            }
        }
        return jSessionId;
    }

    public String getLanguage() {

        return language;
    }

    public void setLanguage(String language) {

        this.language = language;
    }

    public static String getUserPrincipal() {

        FacesContext context = FacesContext.getCurrentInstance();
        HttpServletRequest request = (HttpServletRequest) context.getExternalContext().getRequest();

        return getUserPrincipal(request);
    }

    public static String getUserPrincipal(HttpServletRequest request) {

        Principal principal = request.getUserPrincipal();
        if (principal == null) {
            return "";
        }
        return principal.getName();
    }

    public static HttpServletRequest getRequest() {

        FacesContext context = FacesContext.getCurrentInstance();
        HttpServletRequest request = (HttpServletRequest) context.getExternalContext().getRequest();
        return request;
    }

    public static HttpServletResponse getResponse() {

        FacesContext context = FacesContext.getCurrentInstance();
        HttpServletResponse request = (HttpServletResponse) context.getExternalContext().getResponse();
        return request;
    }
}
