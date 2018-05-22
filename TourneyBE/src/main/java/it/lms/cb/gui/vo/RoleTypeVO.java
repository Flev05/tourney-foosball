
package it.lms.cb.gui.vo;

import it.lms.cb.po.RoleType;

/**
 * The View Object to represent a row in the table of the presences
 * 
 * @author Luciano Martino
 */
public class RoleTypeVO extends GenericVO<RoleType> {

    private static final long serialVersionUID = 1L;

    public RoleTypeVO(RoleType bo) {

        super(bo);
    }

    public RoleTypeVO() {

        this(new RoleType());
    }

    public Integer getId() {

        return super.getPo().getId();
    }

    public void setId(Integer id) {

        super.getPo().setId(id);
    }

    public String getDescription() {

        return getPo().getDescription();
    }

    public void setDescription(String name) {

        getPo().setDescription(name);
    }

    public String getName() {

        return getPo().getName();
    }

    public void setName(String name) {

        getPo().setName(name);
    }
}
