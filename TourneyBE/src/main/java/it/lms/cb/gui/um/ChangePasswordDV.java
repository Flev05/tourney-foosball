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

import java.io.UnsupportedEncodingException;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.event.ActionEvent;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.DaoException;
import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.dao.UserDao;
import it.lms.cb.gui.mb.BaseBean;
import it.lms.cb.gui.mb.CommonUtil;
import it.lms.cb.gui.um.resources.CommonMessages;
import it.lms.cb.gui.vo.UserVO;
import it.lms.cb.po.User;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = ChangePasswordDV.beanName)
@ViewScoped
public class ChangePasswordDV extends UserDV {

    private static final long   serialVersionUID   = 1L;
    public static final String  beanName           = "ChangePasswordDV";

    private static final Logger logger             = LogManager.getLogger(ChangePasswordDV.class);

    protected String            CHANGE_PASSWORD_DV = "/common/login/" + beanName + ".xhtml";

    protected ChangePasswordDV(String bn) throws Exception {

        super(bn);
        logger.debug(BaseBean.printSessionId() + "Entering ChangePasswordDV()");
    }

    public ChangePasswordDV() throws Exception {

        this(beanName);
        logger.debug(BaseBean.printSessionId() + "Entering ChangePasswordDV()");
    }

    public static void showLoadSelectedRow(UserVO vo) throws Exception {

        ChangePasswordDV mb = (ChangePasswordDV) DataAccessUtils.getManagedBean(beanName);

        mb.loadSelectedRow(vo);
        // mb.showView();
    }

    /**
     * Performs the load for change password operation
     */
    public void loadForChangePassword(ActionEvent event) throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering loadForChangePassword()");

        prepareChangePassword();

        // showView();

        logger.debug(BaseBean.printSessionId() + "Exiting loadForChangePassword()");
    }

    // protected void showView() throws Exception {
    //
    // UserPermissionMB.showView(getViewPath());
    // }

    @Override
    protected String getViewPath() {

        return CHANGE_PASSWORD_DV;
    }

    private void prepareChangePassword() throws DaoException {

        String username = UserPermissionMB.getLoggedUsername();

        UserDao dao = new UserDao();

        User nvo = dao.getPoBy(username);

        setVo(new UserVO(nvo));

        getVo().setNewPassword("");
        getVo().setConfirmPassword("");
    }

    @Override
    protected void navigateTo() throws Exception {

    }

    @Override
    protected UserVO loadSelectedRow(UserVO uvo) throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering loadSelectedRow()");

        setVo(uvo);

        return uvo;
    }

    @Override
    protected void validate(UserVO vo) throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering validate()");

        String md5 = UserPermissionMB.doMD5(vo.getRetypePassword());

        if (!md5.equals(vo.getPassword())) {
            CommonUtil.showValidationError(CommonMessages.I18N_UNMATCHED_PWD_MESSAGE);

            String err = "oldPassword=" + vo.getPassword() + " typed password=" + vo.getRetypePassword();
            logger.error(BaseBean.printSessionId() + err);
            throw new Exception(err);
        }

        if (!isConfirmedPassword()) {
            String err = "Confirmation failed.";
            logger.error(BaseBean.printSessionId() + err);
            throw new Exception(err);
        }
    }

    /**
     * Performs the save operation
     */
    @Override
    protected void save(UserVO vo) throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering save()");

        String md5 = UserPermissionMB.doMD5(vo.getNewPassword());

        try {
            UserDao dao = new UserDao();

            User po = getVo().getPo();

            po.setPassword(md5);

            dao.updatePo(po);

            CommonUtil.showInfoMessage(CommonMessages.I18N_CHANGE_PASSWORD_OK);

        } catch (Exception e) {
            logger.error(e);
            CommonUtil.showValidationError(CommonMessages.I18N_SAVE_MESSAGE);
            throw new Exception(e);
        }
    }

    /**
     * Verifies if the process to change the password is valid
     * 
     * @param ActionEvent event
     * @throws UnsupportedEncodingException
     */
    private boolean isConfirmedPassword() throws UnsupportedEncodingException {

        logger.debug(BaseBean.printSessionId() + "Entering isConfirmedPassword()");

        if (!getVo().getNewPassword().equals(getVo().getConfirmPassword())) {
            CommonUtil.showValidationError(CommonMessages.I18N_CONFIRM_PWD_MESSAGE);

            return false;
        }

        return true;
    }
}
