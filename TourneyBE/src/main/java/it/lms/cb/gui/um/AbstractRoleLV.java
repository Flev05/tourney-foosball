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

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.primefaces.event.SelectEvent;

import it.lms.cb.gui.mb.AbstractListViewMB;
import it.lms.cb.gui.mb.BaseBean;
import it.lms.cb.gui.vo.RoleVO;

/**
 * @author Luciano Martino
 */
public abstract class AbstractRoleLV<RVO extends RoleVO> extends AbstractListViewMB<RVO> {

    private static final long   serialVersionUID = 1L;

    private static final Logger logger           = LogManager.getLogger(AbstractRoleLV.class);

    protected AbstractRoleLV(String bn) throws Exception {

        super(bn);

        logger.debug(BaseBean.printSessionId() + "Entering FullRoleLV()");
    }

    public void selectListener(SelectEvent event) {

        RVO row = getViewObject(event);
        logger.debug(BaseBean.printSessionId() + "Selected row is: " + row);
        try {
            loadSelectedRow(row);
        } catch (Exception e) {
            logger.error(BaseBean.printSessionId() + "Load selected row failed", e);
        }
    }

    // protected void showView() throws Exception {
    //
    // UserPermissionMB.showView(getViewPath());
    // }

    @Override
    protected void navigateTo() throws Exception {

        // showView();
    }
}
