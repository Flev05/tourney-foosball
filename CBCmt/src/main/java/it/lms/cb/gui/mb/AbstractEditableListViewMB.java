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
public abstract class AbstractEditableListViewMB<VO extends AbstractVO> extends AbstractEditableMB<VO> {

    private static final long   serialVersionUID   = 1L;

    private static final Logger logger             = LogManager.getLogger(AbstractEditableListViewMB.class);

    protected boolean           loadForNewIsActive = false;
    private boolean             buttonColspan      = false;

    public AbstractEditableListViewMB(String beanName) {

        super(beanName);
        logger.debug("Entering EditableListViewMB()");
        buttonColspan = false;
    }

    public boolean isButtonColspan() {

        return buttonColspan;
    }

    public void setButtonColspan(boolean buttonColspan) {

        this.buttonColspan = buttonColspan;
    }

    public void load(ActionEvent event) {

        logger.debug("Entering load()");

        super.load(event);

        buttonColspan = false;
        loadForNewIsActive = false;

        logger.debug("Exiting load()");
    }

    /**
     * Performs the load operation of the badge identified by its id
     */
    public void loadForNew(ActionEvent event) throws Exception {

        logger.debug("Entering loadForNew()");

        if (loadForNewIsActive) {
            return;
        }

        super.loadForNew(event);

        loadForNewIsActive = true;
        buttonColspan = true;

        logger.debug("Exiting loadForNew()");
    }

    /**
     * Performs the load operation of the badge identified by its id
     */
    public void loadForAppend(ActionEvent event) {

        logger.debug("Entering loadForAppend()");

        if (loadForNewIsActive) {
            return;
        }

        resetSelectedRow();

        try {
            setVo(prepareNewVo());
        } catch (Exception e) {
            logger.error("Prepare for new failed.", e);
            return;
        }

        getVo().setSelected(true);

        getVoList().add(getVo());

        loadForNewIsActive = true;
        buttonColspan = true;

        logger.debug("Exiting loadForNew()");
    }

    public void rollback(ActionEvent event) {

        logger.debug("Entering rollback()");

        if (loadForNewIsActive) {
            getVoList().remove(getVoList().get(0));
        }
        resetSelectedRow();
        getVo().setSelected(false);
    }

    public void save(ActionEvent event) throws Exception {

        logger.debug("Entering save()");

        try {
            validate(getVo());
        } catch (Exception e) {
            logger.error(e);
            return;
        }

        saveInTransaction();

        resetSelectedRow();

        getVo().setSelected(false);

        reLoad();
    }

    public void delete(ActionEvent event) throws Exception {

        logger.debug("Entering delete()");

        if (loadForNewIsActive) {
            rollback(event);
            return;
        }

        super.delete(event);

        resetSelectedRow();

        getVo().setSelected(false);

        reLoad();

        logger.debug("Exiting delete()");
    }

    public void onRowSelect(SelectEvent event) {

        logger.debug("Entering onRowSelect()");

        VO row = getViewObject(event);

        setVo(row);

        String msg = "Selected row is: " + row;
        logger.debug(msg);

        resetSelectedRow();

        if (loadForNewIsActive) {
            getVoList().remove(getVoList().get(0));
            return;
        }

        row.setSelected(true);
        buttonColspan = true;
    }

    protected void resetSelectedRow() {

        super.resetSelectedRow();

        loadForNewIsActive = false;
        buttonColspan = false;
    }

}
