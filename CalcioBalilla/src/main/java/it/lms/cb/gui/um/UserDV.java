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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.inject.Inject;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.dao.NoDataFoundException;
import it.lms.cb.dao.PersonDao;
import it.lms.cb.dao.RoleDao;
import it.lms.cb.dao.UserDao;
import it.lms.cb.gui.mb.AbstractDetailViewMB;
import it.lms.cb.gui.mb.BackPageInterface;
import it.lms.cb.gui.mb.CommonUtil;
import it.lms.cb.gui.um.resources.CommonMessages;
import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.cb.po.Person;
import it.lms.cb.po.Role;
import it.lms.cb.po.User;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = UserDV.beanName)
@ViewScoped
public class UserDV extends AbstractDetailViewMB<UserVO> {

    private static final long   serialVersionUID = 1L;
    public static final String  beanName         = "UserDV";
    public static final String  USER_DV          = "/user/" + beanName + ".xhtml";

    private static final Logger logger           = LogManager.getLogger(UserDV.class);
    private boolean             newUser          = false;

    private List<RoleVO>        selectedRoles;
    private List<RoleVO>        roleVoList;
    private Set<Role>           roleSet;

    @Inject
    private UserDao             udao;
    @Inject
    private RoleDao             rdao;
    @Inject
    private PersonDao           pdao;

    public UserDV() throws Exception {

        this(beanName);
        logger.debug("Entering UserDV()");
    }

    public UserDV(String beanName) throws Exception {

        super(beanName);
        logger.debug("Entering UserDV()");
        roleSet = new HashSet<>();
    }

    public static void showLoadSelectedRow(BackPageInterface bpi, UserVO vo) throws Exception {

        UserDV mb = (UserDV) DataAccessUtils.getManagedBean(beanName);

        mb.bpi = bpi;

        mb.loadSelectedRow(vo);

        UserPermissionMB.redirectTo(mb.getViewPath());
    }

    public static UserVO showLoadForNewVo(BackPageInterface bpi) throws Exception {

        UserDV mb = (UserDV) DataAccessUtils.getManagedBean(beanName);

        mb.bpi = bpi;

        UserVO vo = mb.prepareNewVo();

        // mb.showView();

        return vo;
    }

    public static void addDescription(String description) {

        logger.debug("Entering addDescription()");

        UserDV mb = (UserDV) DataAccessUtils.getManagedBean(beanName);

        UserVO vo = mb.getVo();
        vo.setGecos(description);
    }

    public static void doValidate() throws Exception {

        UserDV mb = (UserDV) DataAccessUtils.getManagedBean(beanName);
        mb.doValidate(mb.getVo());
    }

    public static void doSave(List<Role> roleList) throws Exception {

        UserDV mb = (UserDV) DataAccessUtils.getManagedBean(beanName);

        mb.roleSet.clear();
        mb.roleSet.addAll(roleList);

        mb.save(mb.getVo());
    }

    @Override
    protected UserVO prepareNewVo() throws Exception {

        List<Role> roleList;
        if (UserPermissionMB.isDeveloperUser()) {
            roleList = rdao.findAllRoles();
        } else {
            roleList = rdao.findRoleNotDeveloper(UserPermissionMB.getCompany());
        }

        roleVoList = new ArrayList<>();

        roleList.forEach(po -> {
            RoleVO vo = new RoleVO(po);
            roleVoList.add(vo);
        });

        selectedRoles = new ArrayList<>();

        newUser = true;

        UserVO vo = new UserVO();
        vo.setSelected(false);

        setVo(vo);

        return vo;
    }

    @Override
    protected UserVO loadSelectedRow(UserVO uvo) throws Exception {

        logger.debug("Entering loadSelectedRow()");

        uvo = loadSelectedRowLocal(uvo);

        User po = uvo.getPo();

        String firstName = "";
        if (po.getPerson() != null) {
            firstName = po.getPerson().getFirstName();
        }
        uvo.setFirstname(firstName);

        String lastName = "";
        if (po.getPerson() != null) {
            lastName = po.getPerson().getLastName();
        }
        uvo.setLastname(lastName);

        return uvo;
    }

    @Override
    protected void showDeleteErrorMessageId() {

        CommonUtil.showValidationError(CommonMessages.I18N_DELETE_MESSAGE);
    }

    @Override
    protected void delete(UserVO svo) throws Exception {

        udao.deletePo(svo.getPo());
    }

    @Override
    protected void validate(UserVO vo) throws Exception {

        logger.debug("Entering validate()");

        String err = doValidate(vo);

        roleSet = convertRoleVOtoRolePOList();
        if (roleSet.isEmpty()) {
            logger.error(err);
            CommonUtil.showValidationError(CommonMessages.I18N_USER_EMPTY_ROLE_MESSAGE);
            throw new Exception(err);
        }
    }

    private String doValidate(UserVO vo) throws Exception {

        String err = "Validation failed.";

        String un = vo.getPo().getUsername();

        if (StringUtils.isEmpty(un)) {
            CommonUtil.showValidationError(CommonMessages.I18N_USER_NAME_MESSAGE);
            throw new Exception(err);
        }

        if (usernameAlreadyExists(vo)) {
            CommonUtil.showValidationErrorWithToken(CommonMessages.I18N_USER_NAME_ALREADY_EXISTS_MESSAGE, un);
            throw new Exception(err);
        }

        if (noRoleSelected()) {
            CommonUtil.showValidationError(CommonMessages.I18N_USER_NAME_AT_LEAST_A_ROLE_MESSAGE);
            throw new Exception(err);
        }

        if (newUser && !vo.getPo().getPassword().equals(vo.getConfirmPassword())) {
            CommonUtil.showValidationError(CommonMessages.I18N_CONFIRM_PWD_MESSAGE);
            throw new Exception(err);
        }
        return err;
    }

    @Override
    protected void save(UserVO vo) throws Exception {

        logger.debug("Entering save()");

        User upo = vo.getPo();

        Person ppo = pdao.getBy(vo.getFirstname(), vo.getLastname());
        if (ppo != null) {
            ppo = upo.getPerson();
            upo.setPerson(ppo);
        }

        if (newUser) {
            String cryptedPwd = UserPermissionMB.doMD5(upo.getPassword());
            vo.getPo().setPassword(cryptedPwd);
        }

        udao.save(upo, roleSet);
    }

    @Override
    protected String getViewPath() {

        return USER_DV;
    }

    public List<RoleVO> getRoleVoList() {

        return roleVoList;
    }

    public void setRoleVoList(List<RoleVO> roleVoList) {

        this.roleVoList = roleVoList;
    }

    public boolean isNewUser() {

        return newUser;
    }

    public void setNewUser(boolean aNewUser) {

        this.newUser = aNewUser;
    }

    public List<RoleVO> getSelectedRoles() {

        return selectedRoles;
    }

    public void setSelectedRoles(List<RoleVO> selectedRoles) {

        this.selectedRoles = selectedRoles;
    }

    private UserVO loadSelectedRowLocal(UserVO uvo) throws Exception {

        logger.debug("Entering loadSelectedRowLocal()");

        selectedRoles = new ArrayList<>();

        // User upo = udao.getUserById(uvo.getId());

        User upo = uvo.getPo();
        upo.getRoles().forEach((po) -> {
            RoleVO rvo = new RoleVO(po);
            selectedRoles.add(rvo);
        });

        List<Role> roleList = new ArrayList<>();
        if (UserPermissionMB.isDeveloperUser()) {
            roleList = rdao.findAllRoles();
        } else {
            roleList = rdao.findRoleNotDeveloper(UserPermissionMB.getCompany());
        }
        roleVoList = new ArrayList<>();

        roleList.forEach((po) -> {
            RoleVO rvo = new RoleVO(po);
            roleVoList.add(rvo);
        });

        newUser = false;

        setVo(uvo);

        return uvo;
    }

    @Override
    protected String loadAll(List<UserVO> voList) throws Exception {

        return null;
    }

    @Override
    protected void navigateTo() throws Exception {

        bpi.backPage(null);
    }

    private Set<Role> convertRoleVOtoRolePOList() {

        Set<Role> selectedRolePoList = new HashSet<>();
        for (RoleVO rvo : selectedRoles) {
            selectedRolePoList.add((Role) rvo.getPo());
        }
        return selectedRolePoList;
    }

    private boolean noRoleSelected() {

        if (selectedRoles == null || selectedRoles.isEmpty()) {
            return true;
        }
        return false;
    }

    private boolean usernameAlreadyExists(UserVO vo) {

        if (!vo.getPo().isNull()) {
            return false;
        }
        String username = vo.getPo().getUsername();
        try {
            udao.findUserBy(username);
        } catch (NoDataFoundException e) {
            return false;
        } catch (Exception e) {
            logger.error(e);
            return false;
        }
        return true;
    }

}
