
package it.lms.cb.gui.mb;

import java.io.Serializable;
import java.security.Principal;
import java.util.TimeZone;

import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.gui.um.resources.CommonMessages;

public abstract class AbstractMB extends BaseBean implements Serializable {

    private static final long   serialVersionUID   = 1L;
    private static final Logger logger             = LogManager.getLogger(AbstractMB.class);

    private String              rowsCount          = "0";
    private String              displayedRowsCount = "0";
    private String              firstRowIndex      = "0";
    private String              lastRowIndex       = "0";
    private String              pageCount          = "0";
    private String              pageIndex          = "0";

    private boolean             toggleOnInput      = false;

    protected String            beanName;

    protected AbstractMB(String beanName) {

        super();
        logger.debug("Entering AbstractMB()");

        this.beanName = beanName;
        DataAccessUtils.setManagedBeanInSession(beanName, this);
    }

    public static void printAuthentication(HttpServletRequest request) {

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

        Principal principal = getPrincipal(request);
        logger.debug("Principal=" + principal);
        if (principal != null) {
            logger.debug("Principal.getName()=" + principal.getName());
        }
    }

    protected static Principal getPrincipal(HttpServletRequest request) {

        Principal principal = request.getUserPrincipal();
        return principal;
    }

    /**
     * Gets the default timezone of the host server. The timezone is needed by the convertDateTime for formatting the
     * time dat values.
     *
     * @return timezone for the current JVM
     */
    public TimeZone getTimeZone() {

        return java.util.TimeZone.getDefault();
    }

    public static void showLoginValidationError(String boundle, String i18nMessageProperty) {

        String clientId = "loginFormId:loginButtonId";
        showValidationError(boundle, clientId, i18nMessageProperty);
    }

    public static String showValidationError(String boundle, String i18nMessageProperty) {

        String clientId = "saveFormId:saveButtonId";
        return showValidationError(boundle, clientId, i18nMessageProperty);
    }

    public static void showInfoMessage(String boundle, String i18nMessageProperty) {

        String i18n = i18n(boundle, i18nMessageProperty);
        DataAccessUtils.addInfoMessage(i18n);
    }

    public static void showCreateValidationError(String boundle, String i18nMessageProperty) {

        String clientId = "createFormId:createButtonId";
        showValidationError(boundle, clientId, i18nMessageProperty);
    }

    public static void showDeleteValidationError(String boundle, String i18nMessageProperty) {

        String clientId = "saveFormId:deleteButtonId";
        showValidationError(boundle, clientId, i18nMessageProperty);
    }

    public static void replaceAndShowError(String boundle, String i18nMessageProperty, String un) {

        String clientId = "saveFormId:saveButtonId";

        String i18n = i18n(boundle, i18nMessageProperty);
        i18n = i18n.replaceAll("%1", un);

        DataAccessUtils.addErrorMessage(clientId, i18n);
    }

    public static void replaceAndShowError(String boundle, String i18nMessageProperty, String t1, String t2) {

        String clientId = "saveFormId:saveButtonId";

        String i18n = i18n(boundle, i18nMessageProperty);
        i18n = i18n.replaceAll("%1", t1);
        i18n = i18n.replaceAll("%2", t2);

        DataAccessUtils.addErrorMessage(clientId, i18n);
    }

    public static String showValidationError(String boundle, String clientId, String i18nMessageProperty) {

        String i18n = i18n(boundle, i18nMessageProperty);
        DataAccessUtils.addErrorMessage(clientId, i18n);

        return i18n;
    }

    public static String replaceAndShowErrorMessage(String boundle, String clientId, String i18nProperty,
            String token) {

        String i18n = i18n(boundle, i18nProperty);
        i18n = i18n.replaceAll("%1", token);
        DataAccessUtils.addErrorMessage(clientId, i18n);

        return i18n;
    }

    public static String replaceAndShowErrorMessage(String boundle, String i18nProperty, String token) {

        return replaceAndShowErrorMessage(boundle, null, i18nProperty, token);
    }

    public static void setValidationMessage(String boundle, String componentId, String message, String un) {

        String summary = i18n(boundle, CommonMessages.I18N_MESSAGE_SUMMARY);

        FacesMessage fm = new FacesMessage();
        fm.setSeverity(FacesMessage.SEVERITY_ERROR);

        fm.setSummary(summary);

        String i18n = i18n(boundle, message).replaceAll("%s", un);
        fm.setDetail(i18n);

        FacesContext context = FacesContext.getCurrentInstance();
        context.addMessage("iceform:" + componentId, fm);
    }

    public String getRowsCount() {

        return rowsCount;
    }

    public void setRowsCount(String rowsCount) {

        this.rowsCount = rowsCount;
    }

    public String getDisplayedRowsCount() {

        return displayedRowsCount;
    }

    public void setDisplayedRowsCount(String displayedRowsCount) {

        this.displayedRowsCount = displayedRowsCount;
    }

    public String getFirstRowIndex() {

        return firstRowIndex;
    }

    public void setFirstRowIndex(String firstRowIndex) {

        this.firstRowIndex = firstRowIndex;
    }

    public String getLastRowIndex() {

        return lastRowIndex;
    }

    public void setLastRowIndex(String lastRowIndex) {

        this.lastRowIndex = lastRowIndex;
    }

    public String getPageCount() {

        return pageCount;
    }

    public void setPageCount(String pageCount) {

        this.pageCount = pageCount;
    }

    public String getPageIndex() {

        return pageIndex;
    }

    public void setPageIndex(String pageIndex) {

        this.pageIndex = pageIndex;
    }

    public boolean isToggleOnInput() {

        return toggleOnInput;
    }

    public void setToggleOnInput(boolean toggleOnInput) {

        this.toggleOnInput = toggleOnInput;
    }
}
