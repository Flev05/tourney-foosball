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

import it.lms.cb.dao.DaoException;
import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.dao.ResourceDao;
import it.lms.cb.gui.mb.AbstractEditableListViewMB;
import it.lms.cb.gui.mb.CommonUtil;
import it.lms.cb.gui.um.resources.CommonMessages;
import it.lms.cb.gui.vo.ResourceVO;
import it.lms.cb.po.Resource;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = ResourceELV.beanName)
@ViewScoped
public class ResourceELV extends AbstractEditableListViewMB<ResourceVO> {

    private static final long   serialVersionUID = 1L;
    public static final String  beanName         = "ResourceELV";
    private static final String MAIN_VIEW_LV     = "/common/user/" + beanName + ".xhtml";

    private static final Logger logger           = LogManager.getLogger(ResourceELV.class);

    public ResourceELV() throws Exception {

        super(beanName);
        logger.debug("Entering ResourceELV()");
    }

    public static void openView() throws Exception {

        ResourceELV mb = (ResourceELV) DataAccessUtils.getManagedBean(beanName);

        List<ResourceVO> voList = new ArrayList<ResourceVO>();

        mb.setVoList(voList);

        mb.resetSelectedRow();

        mb.showView();
    }

    public boolean isButtonEnabled() {

        if (getVoList().size() >= 1) {
            return true;
        }
        return false;
    }

    @Override
    protected ResourceVO prepareNewVo() throws Exception {

        ResourceVO cvo = new ResourceVO();

        showView();

        return cvo;
    }

    @Override
    protected void delete(ResourceVO vo) throws DaoException {

        vo.setSelected(false);
        Resource po = getVo().getPo();
        try {
            ResourceDao dao = new ResourceDao();
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
    protected void validate(ResourceVO svo) throws Exception {

        logger.debug("Entering validate()");

        String type = getVo().getName();
        if (type == null || type.equals("")) {
            String err = "Validation failed.";
            logger.error(err);
            CommonUtil.showValidationError(CommonMessages.I18N_RESOURCE_NAME_MESSAGE);
            throw new Exception(err);
        }
    }

    @Override
    protected void save(ResourceVO svo) throws Exception {

        logger.debug("Entering save()");

        ResourceDao dao = new ResourceDao();
        dao.save(svo.getPo());
    }

    @Override
    protected String showSaveErrorMessageId() {

        String clientId = "saveFormId:createButtonId";
        String i18nMessageProperty = CommonMessages.I18N_SAVE_MESSAGE;
        return CommonUtil.showValidationError(clientId, i18nMessageProperty);
    }

    @Override
    protected List<ResourceVO> loadAll() throws Exception {

        List<ResourceVO> voList = loadAllResource();

        showView();

        return voList;
    }

    private List<ResourceVO> loadAllResource() throws Exception, DaoException {

        List<ResourceVO> voList = new ArrayList<ResourceVO>();

        ResourceDao dao = new ResourceDao();
        List<Resource> boList = dao.findAllRoles();

        for (Resource po : boList) {
            ResourceVO vo = new ResourceVO(po);

            voList.add(vo);
        }
        return voList;
    }

    private void showView() throws Exception {

        UserPermissionMB.showView(getViewPath());
    }

    @Override
    protected void navigateTo() throws Exception {

        showView();
    }

    @Override
    protected String getViewPath() {

        return MAIN_VIEW_LV;
    }

    @Override
    protected ResourceVO getViewObject(org.primefaces.event.SelectEvent event) {

        return (ResourceVO) event.getObject();
    }

    @Override
    protected ResourceVO loadSelectedRow(ResourceVO vo) throws Exception {

        // TODO Auto-generated method stub
        return null;
    }
}
