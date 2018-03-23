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

import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.UserDao;
import it.lms.cb.gui.vo.UserVO;
import it.lms.cb.po.Company;
import it.lms.cb.po.User;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = ResetPasswordLV.beanName)
@ViewScoped
public class ResetPasswordLV extends UserLV {

    private static final long   serialVersionUID  = 1L;
    public static final String  beanName          = "ResetPasswordLV";
    private static final String RESET_PASSWORD_LV = "/common/login/" + beanName + ".xhtml";

    private static final Logger logger            = LogManager.getLogger(ResetPasswordLV.class);

    public ResetPasswordLV() throws Exception {

        this(beanName);
    }

    protected ResetPasswordLV(String bn) throws Exception {

        super(bn);

        logger.debug("Entering ResetPasswordLV()");
    }

    @Override
    protected UserVO loadSelectedRow(UserVO vo) throws Exception {

        logger.debug("Entering loadSelectedRow()");

        try {
            vo.setSelected(false);

            ResetPasswordDV.showLoadSelectedRow(this, vo);
        } catch (Exception e) {
            logger.error("Navigation to UserDV failed", e);
        }
        return vo;
    }

    // public static void showReloadAll() throws Exception {
    //
    // ResetPasswordLV mb = (ResetPasswordLV) DataAccessUtils.getManagedBean(beanName);
    //
    // List<UserVO> voList = mb.loadAll();
    // mb.setVoList(voList);
    // }

    @Override
    protected String loadAll(List<UserVO> voList) throws Exception {

        logger.debug("Entering loadAll()");

        UserDao dao = new UserDao();

        List<User> urboList;
        if (UserPermissionMB.isDeveloperUser()) {
            urboList = dao.findAllUsers();
        } else {
            String username = UserPermissionMB.getLoggedUsername();
            Company company = dao.getCompanyBy(username);
            urboList = dao.findUsersBy(company);
        }

        voList = prepareUserVoList(urboList);

        // showView();

        return getViewPath();
    }

    // @Override
    // protected void showView() throws Exception {
    //
    // // UserPermissionMB.showView(getViewPath());
    // }

    @Override
    protected String getViewPath() {

        return RESET_PASSWORD_LV;
    }

}
