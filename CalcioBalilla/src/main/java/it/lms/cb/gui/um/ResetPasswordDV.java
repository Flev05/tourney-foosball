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

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.gui.mb.BackPageInterface;
import it.lms.cb.gui.vo.UserVO;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = ResetPasswordDV.beanName)
@ViewScoped
public class ResetPasswordDV extends ChangePasswordDV {

    private static final long   serialVersionUID  = 1L;
    public static final String  beanName          = "ResetPasswordDV";

    private static final Logger logger            = LogManager.getLogger(ResetPasswordDV.class);

    protected String            RESET_PASSWORD_DV = "/common/login/" + beanName + ".xhtml";

    public ResetPasswordDV() throws Exception {

        super(beanName);
        logger.debug("Entering ChangePasswordDV()");
    }

    public static void showLoadSelectedRow(BackPageInterface bpi, UserVO vo) throws Exception {

        ResetPasswordDV mb = (ResetPasswordDV) DataAccessUtils.getManagedBean(beanName);

        mb.loadSelectedRow(vo);

        mb.bpi = bpi;

        // mb.showView();
    }

    // protected void showView() throws Exception {
    //
    // UserPermissionMB.showView(getViewPath());
    // }

    @Override
    protected String getViewPath() {

        return RESET_PASSWORD_DV;
    }

    @Override
    protected void navigateTo() throws Exception {

        // ResetPasswordLV.showReloadAll();
    }

    @Override
    protected UserVO loadSelectedRow(UserVO uvo) throws Exception {

        logger.debug("Entering loadSelectedRow()");

        setVo(uvo);

        return uvo;
    }

    @Override
    protected void validate(UserVO vo) throws Exception {

        logger.debug("Entering validate()");
    }

    /**
     * Performs the save operation
     */
    @Override
    protected void save(UserVO vo) throws Exception {

        logger.debug("Entering save()");

        vo.setNewPassword("");

        super.save(vo);
    }
}
