
package it.lms.cb.gui.vo;

import java.io.Serializable;

public abstract class AbstractVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer           id;

    private boolean           selected         = false;
    private boolean           enabled          = true;
    private boolean           selectAll        = false;

    @Override
    public String toString() {

        return "AbstractVO [id=" + id + "]";
    }

    public Integer getId() {

        return id;
    }

    public void setId(Integer id) {

        this.id = id;
    }

    public boolean isSelected() {

        return selected;
    }

    public void setSelected(boolean selected) {

        this.selected = selected;
    }

    public boolean isSelectAll() {

        return selectAll;
    }

    public void setSelectAll(boolean selectAll) {

        this.selectAll = selectAll;
    }

    public boolean isEnabled() {

        return enabled;
    }

    public void setEnabled(boolean enabled) {

        this.enabled = enabled;
    }

    public Integer purgeDigit(String field) {

        if (field == null || field.equals("")) {
            return null;
        }
        field = field.trim();
        field = field.replace(".", "");
        field = field.replace(",", "");
        field = field.replace(";", "");
        field = field.replace(":", "");
        field = field.replace("'", "");
        return new Integer(field);
    }

}
