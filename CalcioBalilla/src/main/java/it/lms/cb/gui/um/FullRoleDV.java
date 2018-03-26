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

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.DataAccessUtils;
import it.lms.cb.gui.mb.BaseBean;
import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.po.Role;

/**
 * @author Luciano Martino
 */
@ManagedBean(name = FullRoleDV.beanName)
@ViewScoped
public class FullRoleDV extends AbstractRoleDV<RoleVO> {

    private static final long   serialVersionUID = 1L;
    public static final String  beanName         = "FullRoleDV";
    public static final String  ROLE_DV          = "/common/user/" + beanName + ".xhtml";

    private static final Logger logger           = LogManager.getLogger(FullRoleDV.class);

    public FullRoleDV() throws Exception {

        this(beanName);
    }

    protected FullRoleDV(String bn) throws Exception {

        super(bn);
        logger.debug(BaseBean.printSessionId() + "Entering FullRoleDV()");
    }

    public static RoleVO showLoadForNewVo() throws Exception {

        FullRoleDV mb = (FullRoleDV) DataAccessUtils.getManagedBean(beanName);

        RoleVO vo = mb.prepareNewVo();

        // mb.showView();

        mb.setVo(vo);

        return vo;
    }

    public static RoleVO showLoadSelectedRow(RoleVO vo) throws Exception {

        FullRoleDV mb = (FullRoleDV) DataAccessUtils.getManagedBean(beanName);

        mb.loadSelectedRow(vo);

        // mb.showView();

        mb.setVo(vo);

        return vo;
    }

    @Override
    protected RoleVO newRoleVO() {

        return new RoleVO();
    }

    @Override
    protected String getViewPath() {

        return ROLE_DV;
    }

    @Override
    protected void delete(RoleVO vo) throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering delete()");

        Role po = (Role) vo.getPo();

        dao.deletePo(po);
    }

    @Override
    protected void save(RoleVO vo) throws Exception {

        logger.debug(BaseBean.printSessionId() + "Entering save()");

        Role rpo = (Role) vo.getPo();

        rpo.setRoleType(selectedRoleType);
        rpo.setCompany(selectedCompany);

        dao.save(rpo);
    }
}
