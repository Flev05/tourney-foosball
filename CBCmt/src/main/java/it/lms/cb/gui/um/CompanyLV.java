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
import javax.faces.event.ActionEvent;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.primefaces.event.SelectEvent;

import it.lms.cb.dao.CompanyDao;
import it.lms.cb.gui.mb.AbstractListViewMB;
import it.lms.cb.gui.vo.CompanyVO;
import it.lms.cb.po.Company;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = CompanyLV.beanName)
@ViewScoped
public class CompanyLV extends AbstractListViewMB<CompanyVO> {

    private static final long   serialVersionUID = 1L;
    public static final String  beanName         = "CompanyLV";
    private static final String MAIN_VIEW_LV     = "/common/user/" + beanName + ".xhtml";

    private static final Logger logger           = LogManager.getLogger(CompanyLV.class);

    public CompanyLV() throws Exception {

        super(beanName);
    }

    @Override
    public void backPage(ActionEvent event) throws Exception {

        List<CompanyVO> voList = loadAll();
        setVoList(voList);
    }

    public void selectListener(CompanyVO row) {

        super.setVo(row);
        row.setSelected(true);
        try {
            loadSelectedRow(row);
        } catch (Exception e) {
            logger.error("Navigation to CompanyLV failed", e);
        }
    }

    /**
     * Performs the load operation of the badge identified by its id
     */
    @Override
    protected CompanyVO prepareNewVo() throws Exception {

        logger.debug("Entering prepareNewVo()");

        try {
            CompanyVO vo = CompanyDV.openForNewVo(this);
            return vo;
        } catch (Exception e) {
            logger.error("Navigation to CompanyLV failed", e);
            throw e;
        }
    }

    @Override
    protected CompanyVO loadSelectedRow(CompanyVO vo) throws Exception {

        logger.debug("Entering loadSelectedRow()");

        try {
            vo.setSelected(false);
            CompanyDV.openSelectedRow(this, vo);
        } catch (Exception e) {
            logger.error("Navigation to CompanyLV failed", e);
        }
        return vo;
    }

    @Override
    protected void navigateTo() throws Exception {

        UserPermissionMB.showView(getViewPath());
    }

    @Override
    protected CompanyVO getViewObject(SelectEvent event) {

        return (CompanyVO) event.getObject();
    }

    @Override
    protected String getViewPath() {

        return MAIN_VIEW_LV;
    }

    @Override
    protected List<CompanyVO> loadAll() throws Exception {

        logger.debug("Entering loadAll()");

        List<CompanyVO> voList = loadAllCompany();

        navigateTo();

        return voList;
    }

    private List<CompanyVO> loadAllCompany() throws Exception {

        List<CompanyVO> voList = new ArrayList<>();

        CompanyDao dao = new CompanyDao();
        List<Company> boList;
        if (UserPermissionMB.isDeveloperUser()) {
            boList = dao.findAllCompany();
        } else {
            boList = dao.getAllCompanyBy(UserPermissionMB.getLoggedUsername());
        }

        for (Company po : boList) {
            CompanyVO vo = new CompanyVO(po);

            voList.add(vo);
        }

        return voList;
    }
}
