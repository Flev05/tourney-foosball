
package it.lms.cb.gui.vo;

import it.lms.cb.po.AbstractPO;

/**
 * The View Object to represent a row in the table on the GUI
 * 
 * @author Luciano Martino
 */
public class GenericVO<PO extends AbstractPO> extends AbstractVO {

    private static final long serialVersionUID = 1L;

    private PO                po;

    public GenericVO(PO po) {

        this.po = po;
    }

    public PO getPo() {

        return po;
    }

    public void setPo(PO po) {

        this.po = po;
    }

    public Integer getId() {

        return po.getId();
    }

    public void setId(Integer id) {

        this.po.setId(id);
    }

}
