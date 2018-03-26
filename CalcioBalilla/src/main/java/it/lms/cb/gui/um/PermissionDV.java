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
import javax.faces.model.SelectItem;
import javax.inject.Inject;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.DaoException;
import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.dao.PermissionDao;
import it.lms.cb.dao.ResourceDao;
import it.lms.cb.dao.RoleTypeDao;
import it.lms.cb.gui.mb.AbstractDetailViewMB;
import it.lms.cb.gui.mb.BackPageInterface;
import it.lms.cb.gui.mb.BaseBean;
import it.lms.cb.gui.vo.PermissionVO;
import it.lms.cb.po.Permission;
import it.lms.cb.po.Resource;
import it.lms.cb.po.RoleType;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = PermissionDV.beanName)
@ViewScoped
public class PermissionDV extends AbstractDetailViewMB<PermissionVO> {

    private static final long   serialVersionUID = 1L;
    public static final String  beanName         = "PermissionDV";
    public static final String  PERMISSION_DV    = "/common/user/" + beanName + ".xhtml";

    private static final Logger logger           = LogManager.getLogger(PermissionDV.class);

    private List<SelectItem>    roleTypeList;
    private List<SelectItem>    resourceList;
    private List<SelectItem>    permissionList;

    private List<Resource>      resourcePoList;
    private List<RoleType>      roleTypePoList;

    private boolean             newPermission;

    private RoleType            selectedRoleType;
    private Resource            selectedResource;

    @Inject
    private PermissionDao       pdao;
    @Inject
    private ResourceDao         rdao;

    private RoleTypeDao         rtdao            = new RoleTypeDao();

    public PermissionDV() throws Exception {

        super(beanName);
        logger.debug(BaseBean.printSessionId() + "Entering PermissionDV()");
        newPermission = false;
        roleTypeList = new ArrayList<>();
        resourceList = new ArrayList<>();
        permissionList = new ArrayList<>();
    }

    public static PermissionVO showLoadForNewVo(BackPageInterface bpi) throws Exception {

        PermissionDV mb = (PermissionDV) DataAccessUtils.getManagedBean(beanName);

        mb.newPermission = true;

        mb.bpi = bpi;

        PermissionVO vo = mb.prepareNewVo();

        mb.setVo(vo);

        // mb.showView();

        return vo;
    }

    public static PermissionVO showLoadSelectedRow(BackPageInterface bpi, PermissionVO vo) throws Exception {

        PermissionDV mb = (PermissionDV) DataAccessUtils.getManagedBean(beanName);

        mb.bpi = bpi;

        mb.setVo(vo);

        mb.newPermission = false;

        mb.loadSelectedRow(vo);

        // mb.showView();

        return vo;
    }

    public List<SelectItem> getRoleTypeList() {

        return roleTypeList;
    }

    public void setRoleTypeList(List<SelectItem> roleList) {

        this.roleTypeList = roleList;
    }

    public List<SelectItem> getResourceList() {

        return resourceList;
    }

    public void setResourceList(List<SelectItem> resourceList) {

        this.resourceList = resourceList;
    }

    public List<SelectItem> getPermissionList() {

        return permissionList;
    }

    public void setPermissionList(List<SelectItem> permissionList) {

        this.permissionList = permissionList;
    }

    public boolean isNewPermission() {

        return newPermission;
    }

    public void setNewPermission(boolean newPermission) {

        this.newPermission = newPermission;
    }

    @Override
    protected PermissionVO prepareNewVo() throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering prepareNewVo()");

        PermissionVO vo = new PermissionVO();

        vo.setRoleTypeId(0);
        vo.setResourceId(0);

        prepareRoleComboBox(vo);

        prepareResourceComboBox(vo);

        prepareAccessTypeComboBox(vo);

        return vo;
    }

    @Override
    protected PermissionVO loadSelectedRow(PermissionVO vo) throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering loadSelectedRow()");
        prepareRoleComboBox(vo);

        prepareResourceComboBox(vo);

        prepareAccessTypeComboBox(vo);

        return vo;
    }

    private void prepareRoleComboBox(PermissionVO vo) throws DaoException {

        roleTypePoList = rtdao.findAllRoleTypes();

        roleTypeList.clear();
        for (RoleType rt : roleTypePoList) {
            String roleName = rt.getName();
            SelectItem si = new SelectItem(rt.getId(), roleName);
            roleTypeList.add(si);
        }
        vo.setRoleTypeId(vo.getRoleTypeId());

    }

    private void prepareResourceComboBox(PermissionVO vo) throws DaoException {

        resourcePoList = rdao.findAllRoles();

        resourceList.clear();
        for (Resource r : resourcePoList) {
            String resourceName = r.getName();
            SelectItem si = new SelectItem(r.getId(), resourceName);
            resourceList.add(si);
        }
        vo.setResourceId(vo.getResourceId());
    }

    private void prepareAccessTypeComboBox(PermissionVO vo) throws DaoException {

        permissionList.clear();
        for (Permission.ACCESS_TYPE ac : Permission.ACCESS_TYPE.values()) {
            String resourceName = ac.name();
            SelectItem si = new SelectItem(resourceName, resourceName);
            permissionList.add(si);
        }
        vo.setResourceId(vo.getResourceId());
    }

    // protected void showView() throws Exception {
    //
    // UserPermissionMB.showView(getViewPath());
    // }

    @Override
    protected String getViewPath() {

        return PERMISSION_DV;
    }

    @Override
    protected void delete(PermissionVO vo) throws Exception {

        pdao.deletePo(vo.getPo());
    }

    @Override
    protected void save(PermissionVO vo) throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering save()");
        Permission p = vo.getPo();

        roleTypePoList.stream().filter(po -> po.getId().equals(vo.getRoleTypeId())).forEach(po -> {
            selectedRoleType = po;
        });
        p.setRoleType(selectedRoleType);

        resourcePoList.stream().filter(po -> po.getId().equals(vo.getResourceId())).forEach(po -> {
            selectedResource = po;
        });
        p.setResource(selectedResource);

        p.setAccessType(vo.getPermissionId());

        pdao.save(p);
    }

    @Override
    protected String loadAll(List<PermissionVO> voList) throws Exception {

        return getViewPath();
    }

    @Override
    protected void navigateTo() throws Exception {

        // PermissionLV.showReloadAll();
    }

    @Override
    protected void validate(PermissionVO vo) throws Exception {

    }
}
