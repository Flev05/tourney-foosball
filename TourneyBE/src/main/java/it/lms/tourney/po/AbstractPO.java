
package it.lms.tourney.po;

import java.io.Serializable;

import javax.persistence.Column;

import org.apache.commons.lang.builder.EqualsBuilder;

import com.fasterxml.jackson.annotation.JsonIgnore;

public abstract class AbstractPO implements Serializable {

    private static final long     serialVersionUID = 1L;

    private boolean               selected         = false;
    private boolean               enabled          = true;
    private boolean               selectAll        = false;

    private Integer               id               = 0;

    protected static final String DATE_FORMAT      = "dd/MM/yyyy";
    protected static final String TIME_FORMAT      = "HH:mm:ss";
    public static final String    FULL_DATE_FORMAT = DATE_FORMAT + " " + TIME_FORMAT; // "dd/MM/yyyy HH:mm:ss";

    public static final long      DAY_IN_MILLI     = 86400000L;                       // = 24*3600*1000 = one day in

    public AbstractPO() {

        id = 0;
    }

    @Override
    public String toString() {

        return "id=" + id;
    }

    public boolean isNull() {

        if (id == null || id == 0) {
            return true;
        }
        return false;
    }

    @Column(name = "id")
    public Integer getId() {

        return id;
    }

    public void setId(Integer id) {

        this.id = id;
    }

    @Override
    public boolean equals(Object other) {

        if (this == other) {
            return true;
        }
        if (!(other instanceof AbstractPO)) {
            return false;
        }
        AbstractPO that = (AbstractPO) other;

        EqualsBuilder eb = new EqualsBuilder();
        eb = eb.append(id, that.id);
        return eb.isEquals();
    }

    @Override
    public int hashCode() {

        return id;
    }

    @JsonIgnore
    public boolean isSelected() {

        return selected;
    }

    public void setSelected(boolean selected) {

        this.selected = selected;
    }

    @JsonIgnore
    public boolean isSelectAll() {

        return selectAll;
    }

    public void setSelectAll(boolean selectAll) {

        this.selectAll = selectAll;
    }

    @JsonIgnore
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
