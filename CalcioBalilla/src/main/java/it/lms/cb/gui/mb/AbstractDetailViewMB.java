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
import org.primefaces.event.SelectEvent;

import it.lms.cb.gui.vo.AbstractVO;

/**
 * @author Luciano Martino
 */
public abstract class AbstractDetailViewMB<VO extends AbstractVO> extends AbstractEditableMB<VO> {

    private static final long   serialVersionUID = 1L;

    private static final Logger logger           = LogManager.getLogger(AbstractDetailViewMB.class);
    protected BackPageInterface bpi;

    public AbstractDetailViewMB(String beanName) {

        this(beanName, null);
        logger.debug("Entering EditableListViewMB()");
    }

    protected AbstractDetailViewMB(String beanName, BackPageInterface bpi) {

        super(beanName);
        logger.debug("Entering EditableListViewMB()");
        this.bpi = bpi;
    }

    public void backPage(ActionEvent event) throws Exception {

        logger.debug("Entering backPage()");

        if (bpi != null) {
            bpi.backPage(event);
        }
    }

    public void cancel(ActionEvent event) throws Exception {

        logger.debug("Entering cancel()");

        navigateTo();
    }

    @Override
    protected VO getViewObject(SelectEvent event) {

        return null;
    }
}
