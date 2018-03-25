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

package it.lms.cb.gui.um;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Principal;
import java.util.Set;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.event.ActionEvent;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Hex;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.DaoException;
import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.dao.PermissionDao;
import it.lms.cb.dao.UserDao;
import it.lms.cb.gui.mb.CommonUtil;
import it.lms.cb.gui.mb.NavigationMB;
import it.lms.cb.gui.um.resources.CommonMessages;
import it.lms.cb.po.Company;
import it.lms.cb.po.Permission;
import it.lms.cb.po.Role;
import it.lms.cb.po.User;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = UserPermissionMB.beanName)
@SessionScoped
public class UserPermissionMB extends NavigationMB implements Serializable {

    private static final long   serialVersionUID       = 1L;
    private static final Logger logger                 = LogManager.getLogger(UserPermissionMB.class);
    public static final String  beanName               = "UserPermissionMB";

    public static String        ALREADY_LOGGED         = "already been authenticated";

    protected static String     LOGIN_OK               = "main/main.xhtml";
    protected static String     LOGOUT                 = "logout";

    private boolean             userManagementExpanded = false;
    private boolean             changePasswordExpanded = false;
    private boolean             loginBoxExpanded       = true;

    private boolean             developerRendered;

    private User                user;
    private Company             company;

    @Inject
    private UserDao             userDao;

    private boolean             navigatorRendered      = true;

    protected String            username;
    protected String            password;

    private Permission          permission;

    // private List<LoginInterface> loginCallBackList;
    // private String queryParams;

    // private String selectedIncludePath;
    // private String layoutPage;

    public UserPermissionMB() throws Exception {

        super(beanName);
        logger.debug("Entering UserNavigationMB()");
        // loginCallBackList = new ArrayList<>();

    }

    // public static void registerLoginInterface(LoginInterface li, String layoutPage, String initialIncludePath)
    // throws DaoException {
    //
    // logger.debug(printSessionId() + "Entering registerLoginInterface(). layoutPage=" + layoutPage
    // + ", initialIncludePath=" + initialIncludePath);

    // UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);

    // doSetLayout(mb, layoutPage);

    // if (!mb.loginCallBackList.contains(li)) {
    // mb.loginCallBackList.add(li);
    // }

    // mb.selectedIncludePath = initialIncludePath;
    // }

    // public static void setLayout(String layoutPage) throws DaoException {
    //
    // logger.debug(printSessionId() + "Entering setLayout(), layoutPage=" + layoutPage);
    //
    // UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);
    //
    // doSetLayout(mb, layoutPage);
    // }

    public static void doLogin(ActionEvent av, String username, String password) throws Exception {

        logger.debug(printSessionId() + "Entering doLogin()");

        UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);

        mb.setUsername(username);
        mb.setPassword(password);
        mb.doLogin();
    }

    // public static void doLogout() throws Exception {
    //
    // logger.debug(printSessionId() + "Entering doLogout()");
    //
    // UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);
    //
    // mb.logoutListener(null);
    // }

    // private static void doSetLayout(UserPermissionMB mb, String layoutPage) {
    //
    // mb.layoutPage = layoutPage;
    // }

    // public static void showView(String toPath) {

    // UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);
    //
    // showView(mb.layoutPage, toPath);
    // }

    // private static void showView(String layoutPage, String toPath) {
    //
    // HttpServletRequest request = getRequest();
    //
    // StringBuilder cp = new StringBuilder(request.getContextPath());
    //
    // UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);
    // mb.selectedIncludePath = toPath;
    // logger.debug("selectedIncludePath=" + mb.selectedIncludePath);
    //
    // cp.append(layoutPage);
    //
    // String path = cp.toString();
    //
    // logger.debug("Template=" + path);
    //
    // try {
    // redirectTo(path);
    // } catch (Exception e) {
    // logger.error("Unable to redirect to path: " + path, e);
    // }
    // }

    public static void mobileShowView(String toPath) {

        HttpServletRequest request = getRequest();

        StringBuilder cp = new StringBuilder(request.getContextPath());

        cp.append(toPath);

        String path = cp.toString();

        logger.debug(path);

        try {
            redirectTo(path);
        } catch (Exception e) {
            logger.error("Unable to redirect to path: " + path, e);
        }
    }

    public static void navigateTo(String path) throws Exception {

        NavigationMB.navigateTo(path, beanName);
    }

    public static User getLoggedUser() {

        Object managedBean = DataAccessUtils.getManagedBean(beanName);
        if (managedBean == null) {
            return null;
        }
        UserPermissionMB mb = (UserPermissionMB) managedBean;

        return mb.getUser();
    }

    public static Set<Role> getLoggedRoles() {

        return getLoggedUser().getRoles();
    }

    public static Company getCompany() {

        UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);
        return mb.company;
    }

    public static boolean isDeveloperUser() {

        UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);
        return mb.developerRendered;
    }

    public static boolean isRendered(String resource) throws Exception {

        UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);

        return mb.rendered(resource);
    }

    // public static String getSelectedIncludePath() {
    //
    // UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);
    // logger.debug(printSessionId() + "Entering getSelectedIncludePath()=" + mb.selectedIncludePath);
    // return mb.selectedIncludePath;
    // }

    // public static void setSelectedIncludePath(String path) {
    //
    // UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);
    // mb.selectedIncludePath = path;
    // }

    public String login() {

        logger.debug("Entering loginListener(ActionEvent)");
        try {
            if (doLogin() == null) {
                logger.error("Login failed");
                return "/main/login.xhtml";
            }
        } catch (NullPointerException e) {
            logger.error("Unable to Login", e);
            throw e;
        } catch (Exception e) {
            logger.error("Login failed", e);
            return "/main/login.xhtml";
        }

        return "/main/main.xhtml";
    }

    // public void logoutListener(ActionEvent av) {
    //
    // logger.debug("Entering logoutListener(ActionEvent)");
    // try {
    //
    // for (LoginInterface li : loginCallBackList) {
    // li.onUserLogout(getUser());
    // }
    //
    // logout();
    //
    // } catch (Exception e) {
    // logger.error("Logout failed", e);
    // }
    // }

    public String logout() {

        developerRendered = false;

        user = null;

        HttpServletRequest request = getRequest();
        printAuthentication(request);
        try {
            request.logout();
        } catch (Exception e) {
            logger.error("Logout failed. Ignore", e);
        }

        printAuthentication(request);

        return LOGOUT;
    }

    private String doLogin() throws Exception {

        logger.debug("Entering doLogin() [username=" + username + ", password=" + password + "]");

        HttpServletRequest request = getRequest();

        printAuthentication(request);

        if (username == null || username.equals("")) {
            logger.debug("Username is empty, re-logging");

            CommonUtil.showLoginValidationError(CommonMessages.I18N_LOGIN_ERROR_MESSAGE);
            return null;
        }

        try {

            String md5Pssword = abstractDoMD5(getPassword());

            logger.debug("Calling HttpServletRequest.login(" + username + ", " + md5Pssword + ")...");

            // request.login(username, md5Pssword);

            String message = "HttpServletRequest.login(" + username + ", " + password + ") successful";
            logger.debug(message);

            prepareUserBean();

            logger.debug("Exiting login() [username=" + username + ", password=" + password + "], return " + LOGIN_OK);
            return LOGIN_OK;
            // } catch (ServletException e) {
            // String err = e.getMessage();
            // if (err.contains(ALREADY_LOGGED)) {
            // return LOGIN_OK;
            // }
            // logger.error("Login failed", e);
            // CommonUtil.showLoginValidationError(CommonMessages.I18N_LOGIN_ERROR_MESSAGE);
            // return null;
            // } catch (NullPointerException e) {
            // logger.error("Unable to Login", e);
            // throw e;
        } catch (Exception e) {

            logger.error("Login failed", e);
            CommonUtil.showLoginValidationError(CommonMessages.I18N_LOGIN_ERROR_MESSAGE);
            return null;
        } finally {
            logger.debug("Exiting doLogin [username=" + username + ", password=" + getPassword() + "]");
        }
    }

    private void prepareUserBean() throws Exception {

        company = userDao.getCompanyBy(username);
        String md5Pssword = abstractDoMD5(getPassword());
        user = userDao.findUserBy(username, md5Pssword);
        developerRendered = userDao.isDeveloperUser(username);
    }

    public boolean rendered(String resourceId) throws Exception {

        if (!isUserLogged()) {
            return false;
        }

        if (developerRendered) {
            return true;
        }

        loadPermission(resourceId);

        if (permission == null) {
            return false;
        }

        if (permission.getAccessType().equals(Permission.ACCESS_TYPE.NO.name())) {
            return false;
        }
        return true;
    }

    public boolean disabled(String resourceId) throws Exception {

        if (permission == null) {
            loadPermission(resourceId);
        }

        if (permission == null) {
            return true;
        }

        if (permission.getAccessType().equals(Permission.ACCESS_TYPE.RO.name())) {
            return true;
        }
        if (permission.getAccessType().equals(Permission.ACCESS_TYPE.RW.name())) {
            return false;
        }
        return true;
    }

    public boolean isDeveloper() {

        return developerRendered;
    }

    private void loadPermission(String resourceId) throws DaoException {

        User u = getLoggedUser();
        if (u == null) {
            permission = null;
            return;
        }

        PermissionDao dao = new PermissionDao();

        permission = dao.findBy(resourceId, u);
    }

    /**
     * @return the user
     */
    public User getUser() {

        return user;
    }

    public boolean isButtonDisabled() {

        logger.debug("Entering isButtonDisabled()");

        boolean rendered = !isLogged();

        return rendered;
    }

    public boolean isUserManagementExpanded() {

        return userManagementExpanded;
    }

    public void setUserManagementExpanded(boolean userManagementExpanded) {

        this.userManagementExpanded = userManagementExpanded;
    }

    public boolean isChangePasswordExpanded() {

        return changePasswordExpanded;
    }

    public void setChangePasswordExpanded(boolean changePasswordExpanded) {

        this.changePasswordExpanded = changePasswordExpanded;
    }

    public boolean isLoginBoxExpanded() {

        return loginBoxExpanded;
    }

    public void setLoginBoxExpanded(boolean loginBoxExpanded) {

        this.loginBoxExpanded = loginBoxExpanded;
    }

    public static String getLoggedUsername() {

        UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);

        return mb.getUsername();
    }

    public static boolean isLogged() {

        UserPermissionMB mb = (UserPermissionMB) DataAccessUtils.getManagedBean(beanName);
        return mb.isUserLogged();
    }

    public static String doMD5(String password) throws UnsupportedEncodingException {

        byte[] md5Password = password.getBytes();

        MessageDigest md;
        try {
            md = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            logger.error("Unable to generate MD5 password", e);
            throw new UnsupportedEncodingException(e.getMessage());
        }

        byte[] thedigest = md.digest(md5Password);

        char[] md5Array = Hex.encodeHex(thedigest);
        String md5 = new String(md5Array).toUpperCase();

        logger.debug("MD5=" + md5);
        return md5;
    }

    public static String getUserPrincipal(HttpServletRequest request) {

        Principal principal = request.getUserPrincipal();
        if (principal == null) {
            return "";
        }
        return principal.getName();
    }

    public boolean isUserLogged() {

        return user != null;
        // HttpServletRequest request = getRequest(
        // return isAlreadyLogged(request);
    }

    public String getUsername() {

        return username;
    }

    public void setUsername(String username) {

        this.username = username.trim();
    }

    public String getPassword() {

        return password;
    }

    public void setPassword(String password) {

        this.password = password.trim();
    }

    public boolean isNavigatorRendered() {

        return navigatorRendered;
    }

    public void setNavigatorRendered(boolean navigatorRendered) {

        this.navigatorRendered = navigatorRendered;
    }

    protected String abstractDoMD5(String password2) throws UnsupportedEncodingException {

        return doMD5(password2);
    }

    // private boolean isAlreadyLogged(HttpServletRequest request) {
    //
    // Principal principal = getPrincipal(request);
    // if (principal != null) {
    // logger.debug("Principal.getName()=" + principal.getName());
    // return true;
    // }
    // return false;
    // }

}
