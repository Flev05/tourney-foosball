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

import java.io.IOException;
import java.io.Serializable;
import java.util.Map;

import javax.faces.context.FacesContext;
import javax.faces.event.ActionEvent;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.DataAccessUtils;

/**
 * @author Luciano Martino
 */
public abstract class NavigationMB extends AbstractMB implements Serializable {

    private static final long   serialVersionUID    = 1L;
    public static final String  NAVIGATION_MB_NAME  = "navigationMB";

    private static final Logger logger              = LogManager.getLogger(NavigationMB.class);
    private static final String INCLUDE_PATH        = "includePath";

    public static final String  DEFAULT_INITAL_PAGE = "/common/login/login-page.xhtml";
    public static String        LOGOUT              = "logout";

    private int                 activeIndex         = 1;

    protected NavigationMB(String bn) {

        super(bn);

        logger.debug("Entering NavigationMB()");
    }

    public static String getIncludePath() throws Exception {

        logger.debug("Entering navigateByIncludePath()");

        FacesContext context = FacesContext.getCurrentInstance();
        Map<String, String> map = context.getExternalContext().getRequestParameterMap();

        String includePath = (String) map.get(INCLUDE_PATH);

        return includePath;
    }

    public String getBeanName() {

        return beanName;
    }

    /**
     * Action Listener for the changes the selected content path in the facelets version of component showcase.
     *
     * @param event JSF Action Event.
     */
    public void navigationPathChange(ActionEvent event) {

        logger.debug("Entering navigationPathChange()");

        FacesContext context = FacesContext.getCurrentInstance();
        Map<String, String> map = context.getExternalContext().getRequestParameterMap();
        String selectedIncludePath = (String) map.get(INCLUDE_PATH);
        logger.debug("selectedIncludePath=" + selectedIncludePath);
    }

    public static void redirect(FacesContext context, String redirectPath) throws IOException {

        logger.debug("Entering redirect(" + redirectPath + ")");

        String contextPath = context.getExternalContext().getRequestContextPath();

        context.getExternalContext().redirect(contextPath + redirectPath);
    }

    public static void redirectTo(ActionEvent event) {

        logger.debug("Entering redirectTo()");

        FacesContext context = FacesContext.getCurrentInstance();
        Map<String, String> map = context.getExternalContext().getRequestParameterMap();

        String redirectPath = (String) map.get("redirectPath");
        if ((null != redirectPath) && (redirectPath.length() > 0)) {
            try {
                redirect(context, redirectPath);
            } catch (IOException e) {
                logger.error("RedirectTo() failed", e);
            }
        }
    }

    public static NavigationMB navigateTo(String path, String beanName) throws Exception {

        NavigationMB mb = getNavigationMB(beanName);

        return mb;
    }

    public static void redirectTo(String path) throws Exception {

        FacesContext context = FacesContext.getCurrentInstance();
        NavigationMB.redirect(context, path);
    }

    public int getActiveIndex() {

        return activeIndex;
    }

    public void setActiveIndex(int activeIndex) {

        this.activeIndex = activeIndex;
    }

    public String getUsername() {

        return getUserPrincipal();
    }

    protected static NavigationMB getNavigationMB(String beanName) {

        Object sessionBean = DataAccessUtils.getManagedBean(beanName);

        if (null == sessionBean || !(sessionBean instanceof NavigationMB)) {
            String err = "sessionBean.class [" + sessionBean + "] is not an instance of NavigationMB class.";
            logger.warn(err);
        }

        NavigationMB mb = (NavigationMB) sessionBean;

        return mb;
    }

    protected String getInitialPage() {

        return DEFAULT_INITAL_PAGE;
    }
}
