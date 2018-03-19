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

import javax.faces.model.SelectItem;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.CompanyDao;
import it.lms.cb.dao.DaoException;
import it.lms.cb.dao.RoleDao;
import it.lms.cb.dao.RoleTypeDao;
import it.lms.cb.gui.mb.AbstractDetailViewMB;
import it.lms.cb.gui.mb.CommonUtil;
import it.lms.cb.gui.um.resources.CommonMessages;
import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.po.Company;
import it.lms.cb.po.RoleType;

/**
 * @author Luciano Martino
 */
public abstract class AbstractRoleDV<RVO extends RoleVO> extends AbstractDetailViewMB<RVO> {

    private static final long   serialVersionUID = 1L;

    private static final Logger logger           = LogManager.getLogger(AbstractRoleDV.class);

    protected boolean           newRole;

    protected RoleDao           dao;

    private List<SelectItem>    roleTypeList;
    private List<SelectItem>    companyList;

    private List<RoleType>      roleTypePoList;
    private List<Company>       companyPoList;

    protected RoleType          selectedRoleType;
    protected Company           selectedCompany;

    protected AbstractRoleDV(String bn) throws Exception {

        super(bn);
        logger.debug("Entering AbstractRoleDV()");

        newRole = false;

        dao = new RoleDao();
        roleTypeList = new ArrayList<>();
        companyList = new ArrayList<>();
        roleTypePoList = new ArrayList<>();
        companyPoList = new ArrayList<>();
    }

    public List<SelectItem> getRoleTypeList() {

        return roleTypeList;
    }

    public void setRoleTypeList(List<SelectItem> roleTypeList) {

        this.roleTypeList = roleTypeList;
    }

    public List<SelectItem> getCompanyList() {

        return companyList;
    }

    public void setCompanyList(List<SelectItem> companyList) {

        this.companyList = companyList;
    }

    public boolean isNewRole() {

        return newRole;
    }

    public void setNewRole(boolean newRole) {

        this.newRole = newRole;
    }

    @Override
    protected RVO prepareNewVo() throws Exception {

        logger.debug("Entering prepareNewVo()");

        RVO vo = newRoleVO();

        vo.setRoleId(0);
        vo.setCompanyId(0);

        newRole = true;

        vo.setCompany(UserPermissionMB.getCompany());

        prepareRoleTypeComboBox(vo);

        prepareCompanyComboBox(vo);

        return vo;
    }

    abstract protected RVO newRoleVO();

    @Override
    protected RVO loadSelectedRow(RVO vo) throws Exception {

        logger.debug("Entering loadSelectedRow()");

        newRole = false;

        prepareRoleTypeComboBox(vo);

        prepareCompanyComboBox(vo);

        return vo;
    }

    protected void prepareRoleTypeComboBox(RVO vo) throws DaoException {

        RoleTypeDao rtdao = new RoleTypeDao();
        roleTypePoList = rtdao.findAllRoleTypes();

        roleTypeList.clear();

        for (RoleType rt : roleTypePoList) {
            String roleTypeName = rt.getName();
            SelectItem si = new SelectItem(rt.getId(), roleTypeName);
            roleTypeList.add(si);
        }
        vo.setRoleId(vo.getRoleId());
    }

    protected void prepareCompanyComboBox(RVO vo) throws DaoException {

        CompanyDao cdao = new CompanyDao();
        companyPoList = cdao.findAllCompany();

        companyList.clear();
        for (Company c : companyPoList) {
            String companyName = c.getName();
            SelectItem si = new SelectItem(c.getId(), companyName);
            companyList.add(si);
        }
        vo.setCompanyId(vo.getCompanyId());
    }

    protected void showView() throws Exception {

        UserPermissionMB.showView(getViewPath());
    }

    @Override
    protected List<RVO> loadAll() throws Exception {

        return null;
    }

    @Override
    protected void navigateTo() throws Exception {

        FullRoleLV.showReloadAll();
    }

    @Override
    protected void validate(RVO vo) throws Exception {

        logger.debug("Entering validate()");

        roleTypePoList.stream().filter(po -> po.getId().equals(vo.getRoleId())).forEach(po -> {
            selectedRoleType = po;
        });

        companyPoList.stream().filter(po -> po.getId().equals(vo.getCompanyId())).forEach(po -> {
            selectedCompany = po;
        });

        if (dao.findBy(selectedRoleType, selectedCompany)) {
            CommonUtil.replaceAndShowError(CommonMessages.I18N_ROLE_COMPANY_ALREADY_EXISTS, selectedCompany.getName(),
                    selectedRoleType.getName());

            throw new Exception("Selected Role already exists");
        }
    }
}
