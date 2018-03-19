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

import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.dao.PermissionDao;
import it.lms.cb.gui.mb.AbstractListViewMB;
import it.lms.cb.gui.vo.PermissionVO;
import it.lms.cb.po.Permission;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = PermissionLV.beanName)
@ViewScoped
public class PermissionLV extends AbstractListViewMB<PermissionVO> {

    private static final long     serialVersionUID = 1L;
    public static final String    beanName         = "PermissionLV";
    protected static final String PERMISSION_LV    = "/common/user/" + beanName + ".xhtml";

    private static final Logger   logger           = LogManager.getLogger(PermissionLV.class);

    public PermissionLV() throws Exception {

        super(beanName);

        logger.debug("Entering PermissionLV()");
    }

    public static void showReloadAll() throws Exception {

        PermissionLV mb = (PermissionLV) DataAccessUtils.getManagedBean(beanName);
        List<PermissionVO> voList = mb.loadAll();
        mb.setVoList(voList);
    }

    public void selectListener(SelectEvent event) {

        PermissionVO row = getViewObject(event);
        logger.debug("Selected row is: " + row);
        try {
            loadSelectedRow(row);
        } catch (Exception e) {
            logger.error("Load selected row failed", e);
        }
    }

    @Override
    protected String getViewPath() {

        return PERMISSION_LV;
    }

    protected void showView() throws Exception {

        UserPermissionMB.showView(getViewPath());
    }

    @Override
    protected PermissionVO getViewObject(SelectEvent event) {

        PermissionVO vo = (PermissionVO) event.getObject();

        return vo;
    }

    @Override
    protected PermissionVO prepareNewVo() throws Exception {

        logger.debug("Entering prepareNewVo()");

        try {
            PermissionVO vo = PermissionDV.showLoadForNewVo(this);
            return vo;
        } catch (Exception e) {
            logger.error("Navigation to MaintenanceDV failed", e);
            throw e;
        }
    }

    @Override
    protected PermissionVO loadSelectedRow(PermissionVO vo) throws Exception {

        return PermissionDV.showLoadSelectedRow(this, vo);
    }

    @Override
    protected List<PermissionVO> loadAll() throws Exception {

        PermissionDao dao = new PermissionDao();

        List<Permission> roleList = dao.findAllPermission();
        List<PermissionVO> voList = new ArrayList<>();

        for (Permission p : roleList) {
            PermissionVO vo = new PermissionVO(p);
            voList.add(vo);

            vo.setRoleTypeId(p.getRoleType().getId());
            vo.setResourceId(p.getResource().getId());
            vo.setPermissionId(p.getAccessType());
        }

        showView();

        return voList;
    }

    @Override
    protected void navigateTo() throws Exception {

        showView();
    }
}
