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
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.event.ActionEvent;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.primefaces.event.SelectEvent;

import it.lms.cb.dao.UserDao;
import it.lms.cb.gui.mb.AbstractListViewMB;
import it.lms.cb.gui.vo.UserVO;
import it.lms.cb.po.Person;
import it.lms.cb.po.User;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = UserLV.beanName)
@ViewScoped
public class UserLV extends AbstractListViewMB<UserVO> {

    private static final long     serialVersionUID = 1L;
    public static final String    beanName         = "UserLV";
    protected static final String USER_LV          = "/common/user/" + beanName + ".xhtml";

    private static final Logger   logger           = LogManager.getLogger(UserLV.class);

    public UserLV() throws Exception {

        this(beanName);

        logger.debug("Entering UserLV()");
    }

    protected UserLV(String bn) throws Exception {

        super(bn);

        logger.debug("Entering UserLV()");
    }

    @Override
    public void backPage(ActionEvent event) throws Exception {

        // UserLV mb = (UserLV) DataAccessUtils.getManagedBean(beanName);
        // List<UserVO> voList = mb.loadAll();
        // mb.setVoList(voList);
    }

    // protected void showView() throws Exception {
    //
    // UserPermissionMB.showView(getViewPath());
    // }

    @Override
    protected String loadAll(List<UserVO> voList) throws Exception {

        logger.debug("Entering loadAll()");

        if (UserPermissionMB.isDeveloperUser()) {
            voList = loadUsers();
        } else {
            UserDao dao = new UserDao();
            List<User> urboList = dao.findUsersBy(UserPermissionMB.getCompany());
            voList = prepareUserVoList(urboList);
        }

        setVoList(voList);

        // showView();

        return getViewPath();
    }

    @Override
    protected String getViewPath() {

        return USER_LV;
    }

    /**
     * Performs the load operation of the badge identified by its id
     */
    public void loadForNew(ActionEvent event) {

        logger.debug("Entering loadForNew()");

        resetSelectedRow();

        try {
            setVo(prepareNewVo());
        } catch (Exception e) {
            logger.error("Prepare for new failed.", e);
            return;
        }

        getVo().setSelected(true);
    }

    public void selectListener(SelectEvent event) {

        UserVO row = getViewObject(event);
        logger.debug("Selected row is: " + row.getUsername());
        try {
            loadSelectedRow(row);
        } catch (Exception e) {
            logger.error("Load selected row failed", e);
        }
    }

    private List<UserVO> loadUsers() throws Exception {

        UserDao dao = new UserDao();

        List<User> urboList = dao.findAllUsers();

        List<UserVO> voList = prepareUserVoList(urboList);

        return voList;
    }

    @Override
    protected UserVO prepareNewVo() throws Exception {

        logger.debug("Entering prepareNewVo()");

        try {
            UserVO vo = UserDV.showLoadForNewVo(this);
            return vo;
        } catch (Exception e) {
            logger.error("Navigation to MaintenanceDV failed", e);
            throw e;
        }
    }

    @Override
    protected UserVO loadSelectedRow(UserVO vo) throws Exception {

        logger.debug("Entering loadSelectedRow()");

        try {
            vo.setSelected(false);
            UserDV.showLoadSelectedRow(this, vo);
        } catch (Exception e) {
            logger.error("Navigation to UserDV failed", e);
        }
        return vo;
    }

    @Override
    protected void navigateTo() throws Exception {

        // showView();
    }

    @Override
    protected UserVO getViewObject(SelectEvent event) {

        return (UserVO) event.getObject();
    }

    protected List<UserVO> prepareUserVoList(List<User> urboList) {

        Map<Integer, UserVO> userMap = new HashMap<>();

        for (User urbo : urboList) {
            Integer key = urbo.getId();
            if (!userMap.containsKey(key)) {
                UserVO uvo = new UserVO(urbo);
                userMap.put(key, uvo);
            }
            UserVO uvo = userMap.get(key);

            Person ppo = urbo.getPerson();
            if (ppo != null) {
                uvo.setFirstname(ppo.getFirstName());
                uvo.setLastname(ppo.getLastName());
            }
        }

        List<UserVO> voList = new ArrayList<UserVO>();
        voList.addAll(userMap.values());

        Collections.sort(voList, new Comparator<UserVO>() {

            @Override
            public int compare(UserVO b1, UserVO b2) {

                return b1.getUsername().compareTo(b2.getUsername());
            }
        });

        return voList;
    }

}
