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

import java.security.Principal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.faces.context.FacesContext;
import javax.faces.event.ActionEvent;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.primefaces.event.SelectEvent;

import it.lms.cb.gui.um.resources.CommonMessages;
import it.lms.cb.gui.vo.AbstractVO;

/**
 * @author Luciano Martino
 */
public abstract class AbstractEditableMB<VO extends AbstractVO> extends AbstractMB {

    private static final long   serialVersionUID = 1L;

    private static final Logger logger           = LogManager.getLogger(AbstractEditableMB.class);
    private static final String LOGIN_PATH       = "login.xhtml";

    private VO                  vo;
    private List<VO>            voList;
    private List<VO>            voRevList;
    private List<VO>            voInsList;
    protected SelectEvent       selectEvent;

    private boolean             scrolling        = true;
    private int                 scrollHeight     = 300;
    private boolean             paginator        = true;
    private int                 rows             = 50;
    private int                 startPage        = 1;

    private String              position         = "both";

    protected AbstractEditableMB(String beanName) {

        super(beanName);
        logger.debug("Entering EditableListViewMB()");

        voList = new ArrayList<>();
        voRevList = new ArrayList<>();
    }

    // protected void beginTransaction() throws Exception {
    //
    // DaoSessionFactory.getInstance().beginTransaction();
    // }

    // protected void beginTransaction(DaoSessionFactory dsf) throws Exception {
    //
    // dsf.beginTransaction();
    // }

    // protected void commit() throws Exception {
    //
    // logger.debug("Entering commit(), waiting ... ");
    //
    // DaoSessionFactory.getInstance().commit();
    // }

    // protected void commit(DaoSessionFactory dsf) throws Exception {
    //
    // logger.debug("Entering commit(), waiting ... ");
    //
    // dsf.commit();
    // }

    // protected void rollback() {
    //
    // DaoSessionFactory.getInstance().rollback();
    // }

    // protected void rollback(DaoSessionFactory dsf) {
    //
    // dsf.rollback();
    // }

    /**
     * Verifies: - the session was expired - another WAR has logged out from the application if so, return the action to
     * show the login form otherwise, continue the session
     */
    public void checkIfAlreadyLogged() {

        HttpServletRequest request = getRequest();
        printAuthentication(request);

        if (!isAlreadyLogged(request)) {
            logger.debug("No user is already logged, re-logging");
            try {
                String loginPath = getLogout();

                FacesContext context = FacesContext.getCurrentInstance();
                context.getExternalContext().redirect(loginPath);

            } catch (Exception e) {
                String err = "Redirect failed during the check if another WAR disconnected the application.";
                logger.error(err, e);
            }
            return;
        }
    }

    private boolean isAlreadyLogged(HttpServletRequest request) {

        Principal principal = getPrincipal(request);
        logger.debug("Principal=" + principal);
        if (principal != null) {
            logger.debug("Principal.getName()=" + principal.getName());
            return true;
        }
        return false;
    }

    protected String getLogout() {

        return LOGIN_PATH;
    }

    public VO getVo() {

        return vo;
    }

    public void setVo(VO vo) {

        this.vo = vo;
    }

    public List<VO> getVoList() {

        return voList;
    }

    public void setVoList(List<VO> voList) {

        this.voList = voList;
    }

    public List<VO> getVoRevList() {

        return voRevList;
    }

    public void setVoRevList(List<VO> voList) {

        this.voRevList = voList;
    }

    public List<VO> getVoInsList() {

        return voInsList;
    }

    public void setVoInsList(List<VO> voList) {

        this.voInsList = voList;
    }

    public boolean getScrolling() {

        return scrolling;
    }

    public void setScrolling(boolean scrolling) {

        this.scrolling = scrolling;
    }

    public int getScrollHeight() {

        return scrollHeight;
    }

    public boolean isPaginator() {

        return paginator;
    }

    public void setPaginator(boolean paginator) {

        this.paginator = paginator;
    }

    public String getPosition() {

        return position;
    }

    public void setPosition(String position) {

        this.position = position;
    }

    public int getRows() {

        return rows;
    }

    public void setRows(int rows) {

        this.rows = rows;
    }

    public int getStartPage() {

        return startPage;
    }

    public void setStartPage(int startPage) {

        this.startPage = startPage;
    }

    public String load() throws Exception {

        return reLoad();
    }

    /**
     * Performs the load operation of the badge identified by its id
     */
    public void loadForNew(ActionEvent event) throws Exception {

        logger.debug("Entering loadForNew()");

        resetSelectedRow();

        try {
            vo = prepareNewVo();
        } catch (Exception e) {
            logger.error("Prepare for new failed.", e);
            return;
        }

        vo.setSelected(true);

        List<VO> extendedList = new ArrayList<>();
        extendedList.add(vo);
        extendedList.addAll(voList);

        voList = extendedList;

        logger.debug("Exiting loadForNew()");
    }

    public void save(ActionEvent event) throws Exception {

        logger.debug("Entering save()");

        try {
            validate(getVo());
        } catch (Exception e) {
            logger.error("Save failed", e);
            resetSelectedRow();

            return;
        }

        try {
            saveInTransaction();
        } catch (Exception e) {
            logger.error(e);
            showSaveErrorMessageId();
            return;
        }

        postSave(getVo());

        resetSelectedRow();

        navigateTo();
    }

    protected void postSave(VO svo) throws Exception {

    }

    public void delete(ActionEvent event) throws Exception {

        logger.debug("Entering delete()");

        try {
            // beginTransaction();
        } catch (Exception e) {
            logger.error("Begin Transaction operation failed", e);

            resetSelectedRow();

            showDeleteErrorMessageId();
            return;
        }

        try {
            delete(vo);
        } catch (Exception e) {
            logger.error("Delete operation failed", e);

            // rollback();

            resetSelectedRow();

            showDeleteErrorMessageId();
            return;
        }

        try {
            // commit();
        } catch (Exception e) {
            logger.error("Commit operation failed", e);

            // rollback();

            resetSelectedRow();

            showDeleteErrorMessageId();
            return;
        }

        removeFromVoList();

        resetSelectedRow();

        navigateTo();

        logger.debug("Exiting delete()");
    }

    protected void removeFromVoList() {

        Iterator<VO> voIter = voList.listIterator();
        while (voIter.hasNext()) {
            VO vo = voIter.next();
            if (vo.equals(this.vo)) {
                voIter.remove();
            }
        }
    }

    protected void saveInTransaction() throws Exception {

        try {
            // beginTransaction();

            save(vo);

            // commit();

        } catch (Exception e) {
            logger.error("Save failed", e);
            // rollback();
            resetSelectedRow();

            showSaveErrorMessageId();

            throw new Exception(e);
        }
    }

    public void onRowSelect(SelectEvent event) throws Exception {

        logger.debug("Entering onRowSelect()");

        VO row = getViewObject(event);

        setVo(row);

        String msg = "Selected row is: " + row;
        logger.debug(msg);

        row.setSelected(true);
        try {

            loadSelectedRow(row);

        } catch (Exception e) {
            logger.error("navigation to bookinglv failed", e);
        }
    }

    protected String showSaveErrorMessageId() {

        return CommonUtil.showValidationError(CommonMessages.I18N_SAVE_MESSAGE);
    }

    protected void showDeleteErrorMessageId() {

        CommonUtil.showDeleteValidationError(CommonMessages.I18N_DELETE_MESSAGE);
    }

    protected VO getSelectedRow() {

        logger.debug("Entering setVoOnRowSelected()");

        for (VO vo : voList) {
            if (vo.isSelected()) {
                this.vo = vo;
                logger.debug("[Setting edit=true for Id=" + vo + "]");
                break;
            }
        }

        return vo;
    }

    protected abstract VO getViewObject(SelectEvent event);

    protected abstract VO prepareNewVo() throws Exception;

    protected abstract VO loadSelectedRow(VO vo) throws Exception;

    protected abstract void delete(VO vo) throws Exception;

    protected abstract void save(VO vo) throws Exception;

    protected abstract String loadAll(List<VO> voList) throws Exception;

    protected abstract void navigateTo() throws Exception;

    protected abstract String getViewPath();

    protected abstract void validate(VO vo) throws Exception;

    protected String reLoad() throws Exception {

        return loadAll(voList);
    }

    protected void resetSelectedRow() {

        for (VO vo : voList) {
            vo.setSelected(false);
        }
    }

}
