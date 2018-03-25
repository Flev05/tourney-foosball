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

package it.lms.cb.gui.mb;

import javax.faces.event.ActionEvent;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.DaoException;
import it.lms.cb.gui.vo.AbstractVO;

/**
 * @author Luciano Martino
 */
public abstract class AbstractListViewMB<VO extends AbstractVO> extends AbstractEditableMB<VO>
        implements BackPageInterface {

    private static final long   serialVersionUID = 1L;

    private static final Logger logger           = LogManager.getLogger(AbstractListViewMB.class);

    public AbstractListViewMB(String beanName) {

        super(beanName);
        logger.debug("Entering EditableListViewMB()");
    }

    public void loadForNew(String beanName, ActionEvent event) {

        logger.debug("Entering loadForNew()");
    }

    @Override
    public void backPage(ActionEvent event) throws Exception {

        // UserPermissionMB.showView(getViewPath());
    }

    @Override
    protected void save(VO vo) throws Exception {

    }

    @Override
    protected void delete(VO svo) throws DaoException {

    }

    @Override
    protected VO prepareNewVo() throws Exception {

        return null;
    }

    @Override
    protected void validate(VO vo) throws Exception {

    }
}
