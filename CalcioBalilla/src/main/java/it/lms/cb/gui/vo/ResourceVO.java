
package it.lms.cb.gui.vo;

import it.lms.cb.po.Resource;

/**
 * The View Object to represent a row in the table of the presences
 * 
 * @author Luciano Martino
 */
public class ResourceVO extends GenericVO<Resource> {

    private static final long serialVersionUID = 1L;

    public ResourceVO(Resource bo) {

        super(bo);
    }

    public ResourceVO() {

        this(new Resource());
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

    public void setDescription(String description) {

        getPo().setDescription(description);
    }

    public String getName() {

        return super.getPo().getName();
    }

    public void setName(String name) {

        this.getPo().setName(name);
    }
}
