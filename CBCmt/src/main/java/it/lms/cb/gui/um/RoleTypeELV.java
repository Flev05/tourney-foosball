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
import javax.inject.Inject;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.DaoException;
import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.dao.RoleTypeDao;
import it.lms.cb.gui.mb.AbstractEditableListViewMB;
import it.lms.cb.gui.mb.CommonUtil;
import it.lms.cb.gui.um.resources.CommonMessages;
import it.lms.cb.gui.vo.RoleTypeVO;
import it.lms.cb.po.RoleType;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = RoleTypeELV.beanName)
@ViewScoped
public class RoleTypeELV extends AbstractEditableListViewMB<RoleTypeVO> {

    private static final long   serialVersionUID = 1L;
    public static final String  beanName         = "RoleTypeELV";
    private static final String MAIN_VIEW_LV     = "/user/" + beanName + ".xhtml";

    private static final Logger logger           = LogManager.getLogger(RoleTypeELV.class);

    @Inject
    private RoleTypeDao         dao;

    public RoleTypeELV() throws Exception {

        super(beanName);
        logger.debug("Entering RoleTypeELV()");
    }

    public static void openView() throws Exception {

        RoleTypeELV mb = (RoleTypeELV) DataAccessUtils.getManagedBean(beanName);

        List<RoleTypeVO> voList = new ArrayList<RoleTypeVO>();

        mb.setVoList(voList);

        mb.resetSelectedRow();

        // mb.showView();
    }

    public boolean isButtonEnabled() {

        if (getVoList().size() >= 1) {
            return true;
        }
        return false;
    }

    @Override
    protected RoleTypeVO prepareNewVo() throws Exception {

        RoleTypeVO cvo = new RoleTypeVO();

        // showView();

        return cvo;
    }

    @Override
    protected void delete(RoleTypeVO vo) throws DaoException {

        vo.setSelected(false);
        RoleType po = getVo().getPo();
        try {
            dao.deletePo(po);
        } catch (Exception e) {
            String err = "Delete STOP " + po.getName() + " failed.";
            logger.error(err, e);
            showDeleteErrorMessageId();
        }
    }

    @Override
    protected void showDeleteErrorMessageId() {

        String clientId = "saveFormId:createButtonId";
        String i18nMessageProperty = CommonMessages.I18N_DELETE_MESSAGE;
        CommonUtil.showValidationError(clientId, i18nMessageProperty);
    }

    @Override
    protected void validate(RoleTypeVO svo) throws Exception {

        logger.debug("Entering validate()");

        String type = getVo().getName();
        if (type == null || type.equals("")) {
            String err = "Validation failed.";
            logger.error(err);
            CommonUtil.showValidationError(CommonMessages.I18N_ROLE_TYPE_NAME_MESSAGE);
            throw new Exception(err);
        }
    }

    @Override
    protected void save(RoleTypeVO svo) throws Exception {

        logger.debug("Entering save()");

        dao.save(svo.getPo());
    }

    @Override
    protected String showSaveErrorMessageId() {

        String clientId = "saveFormId:createButtonId";
        String i18nMessageProperty = CommonMessages.I18N_SAVE_MESSAGE;
        return CommonUtil.showValidationError(clientId, i18nMessageProperty);
    }

    @Override
    protected String loadAll(List<RoleTypeVO> voList) throws Exception {

        voList = loadRoleType();

        // showView();

        return getViewPath();
    }

    private List<RoleTypeVO> loadRoleType() throws Exception {

        List<RoleTypeVO> voList = loadrts();

        return voList;
    }

    private List<RoleTypeVO> loadrts() throws Exception, DaoException {

        List<RoleTypeVO> voList = new ArrayList<>();

        List<RoleType> boList = dao.findAllRoleTypes();

        for (RoleType po : boList) {
            RoleTypeVO vo = new RoleTypeVO(po);

            voList.add(vo);
        }
        return voList;
    }

    // private void showView() throws Exception {
    //
    // UserPermissionMB.showView(getViewPath());
    // }

    @Override
    protected void navigateTo() throws Exception {

        // showView();
    }

    @Override
    protected String getViewPath() {

        return MAIN_VIEW_LV;
    }

    @Override
    protected RoleTypeVO getViewObject(org.primefaces.event.SelectEvent event) {

        return (RoleTypeVO) event.getObject();
    }

    @Override
    protected RoleTypeVO loadSelectedRow(RoleTypeVO vo) throws Exception {

        // TODO Auto-generated method stub
        return null;
    }
}
