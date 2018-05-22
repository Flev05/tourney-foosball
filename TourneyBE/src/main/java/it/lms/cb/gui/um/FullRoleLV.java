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

import java.util.ArrayList;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.primefaces.event.SelectEvent;

import it.lms.cb.dao.RoleDao;
import it.lms.cb.gui.mb.BaseBean;
import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.po.Role;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = FullRoleLV.beanName)
@ViewScoped
public class FullRoleLV extends AbstractRoleLV<RoleVO> {

    private static final long     serialVersionUID = 1L;
    public static final String    beanName         = "FullRoleLV";
    protected static final String ROLE_LV          = "/common/user/" + beanName + ".xhtml";

    private static final Logger   logger           = LogManager.getLogger(FullRoleLV.class);

    public FullRoleLV() throws Exception {

        super(beanName);
    }

    // public static void showReloadAll() throws Exception {
    //
    // FullRoleLV mb = (FullRoleLV) DataAccessUtils.getManagedBean(beanName);
    // List<RoleVO> voList = mb.loadAll();
    // mb.setVoList(voList);
    // }

    public void selectListener(SelectEvent event) {

        RoleVO row = getViewObject(event);
        logger.debug(BaseBean.printSessionId() + "Selected row is: " + row);
        try {
            loadSelectedRow(row);
        } catch (Exception e) {
            logger.error(BaseBean.printSessionId() + "Load selected row failed", e);
        }
    }

    @Override
    protected String getViewPath() {

        return ROLE_LV;
    }

    // protected void showView() throws Exception {
    //
    // UserPermissionMB.showView(getViewPath());
    // }

    @Override
    protected RoleVO getViewObject(SelectEvent event) {

        RoleVO vo = (RoleVO) event.getObject();

        return vo;
    }

    @Override
    protected RoleVO prepareNewVo() throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering prepareNewVo()");

        RoleVO vo = FullRoleDV.showLoadForNewVo();
        return vo;
    }

    @Override
    protected RoleVO loadSelectedRow(RoleVO vo) throws Exception {

        return FullRoleDV.showLoadSelectedRow(vo);
    }

    @Override
    protected String loadAll(List<RoleVO> voList) throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering loadAll()");
        RoleDao dao = new RoleDao();

        List<Role> roleList;
        roleList = dao.findAllRoles();

        voList = new ArrayList<>();

        for (Role r : roleList) {
            RoleVO vo = new RoleVO(r);
            voList.add(vo);

            vo.setRoleId(r.getRoleType().getId());
            vo.setCompanyId(r.getCompany().getId());
        }

        // showView();

        return getViewPath();
    }
}
