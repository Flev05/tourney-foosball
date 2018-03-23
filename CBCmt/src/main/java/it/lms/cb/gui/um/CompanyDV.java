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

import it.lms.cb.dao.CompanyDao;
import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.dao.RoleDao;
import it.lms.cb.gui.mb.AbstractDetailViewMB;
import it.lms.cb.gui.mb.BackPageInterface;
import it.lms.cb.gui.mb.CommonUtil;
import it.lms.cb.gui.um.resources.CommonMessages;
import it.lms.cb.gui.vo.CompanyVO;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = CompanyDV.beanName)
@ViewScoped
public class CompanyDV extends AbstractDetailViewMB<CompanyVO> {

    private static final long   serialVersionUID = 1L;

    public static final String  beanName         = "CompanyDV";
    public static final String  DETAIL_VIEW_PATH = "/common/user/" + beanName + ".xhtml";

    private static final Logger logger           = LogManager.getLogger(CompanyDV.class);

    protected boolean           newCompany       = true;

    public CompanyDV() throws Exception {

        super(beanName);
        logger.debug("Entering CompanyDV()");
    }

    public static CompanyVO openForNewVo(BackPageInterface bpi) throws Exception {

        CompanyDV mb = (CompanyDV) DataAccessUtils.getManagedBean(beanName);

        mb.bpi = bpi;

        CompanyVO vo = openForNewVo();

        // mb.showView();

        return vo;
    }

    private static CompanyVO openForNewVo() throws Exception {

        CompanyDV mb = (CompanyDV) DataAccessUtils.getManagedBean(beanName);

        CompanyVO vo = mb.prepareNewVo();

        mb.setVo(vo);

        return vo;
    }

    public static void openSelectedRow(BackPageInterface bpi, CompanyVO vo) throws Exception {

        Object managedBean = DataAccessUtils.getManagedBean(beanName);

        CompanyDV mb = (CompanyDV) managedBean;

        mb.bpi = bpi;

        mb.loadSelectedRow(vo);

        // mb.showView();
    }

    // protected void showView() throws Exception {
    //
    // UserPermissionMB.showView(getViewPath());
    // }

    public boolean isNewCompany() {

        return newCompany;
    }

    public void setNewCompany(boolean newCompany) {

        this.newCompany = newCompany;
    }

    @Override
    protected CompanyVO loadSelectedRow(CompanyVO vo) throws Exception {

        logger.debug("Entering loadSelectedRow()");

        newCompany = false;

        setVo(vo);

        return vo;
    }

    @Override
    protected String loadAll(List<CompanyVO> voList) throws Exception {

        return null;
    }

    @Override
    protected void delete(CompanyVO svo) throws Exception {

        CompanyDao dao = new CompanyDao();

        dao.deletePo(svo.getPo());
    }

    @Override
    protected void validate(CompanyVO vo) throws Exception {

        if (getVo().getName().equals("")) {
            String err = "Validation failed.";
            logger.error(err);
            CommonUtil.showValidationError(CommonMessages.I18N_SAVE_MESSAGE);
            throw new Exception(err);
        }
    }

    @Override
    protected void save(CompanyVO svo) throws Exception {

        logger.debug("Entering save()");

        RoleDao.addInitialRoles(svo.getPo());

        CompanyDao dao = new CompanyDao();
        dao.save(svo.getPo());
    }

    /**
     * Performs the load operation of the badge identified by its id
     */
    @Override
    protected CompanyVO prepareNewVo() throws Exception {

        logger.debug("Entering prepareNewVo()");

        try {

            newCompany = true;

            CompanyVO vo = new CompanyVO();

            vo.setSelected(false);
            return vo;
        } catch (Exception e) {
            logger.error("Navigation to VehicleTypeDV failed", e);
            throw e;
        }
    }

    @Override
    protected void navigateTo() throws Exception {

    }

    @Override
    protected String getViewPath() {

        return DETAIL_VIEW_PATH;
    }

}
