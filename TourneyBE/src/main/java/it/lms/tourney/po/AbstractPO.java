
package it.lms.tourney.po;

import java.io.Serializable;

import org.apache.commons.lang.builder.EqualsBuilder;

import com.fasterxml.jackson.annotation.JsonIgnore;

public abstract class AbstractPO implements Serializable {

	private static final long serialVersionUID = 1L;

	@JsonIgnore
	private boolean selected = false;

	@JsonIgnore
	private boolean enabled = true;

	@JsonIgnore
	private boolean selectAll = false;

	public AbstractPO() {

		setId(0);
	}

	public abstract Integer getId();

	public abstract void setId(Integer id);

	@Override
	public String toString() {

		return "id=" + getId();
	}

	@JsonIgnore
	public boolean isNull() {

		if (getId() == null || getId() == 0) {
			return true;
		}
		return false;
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
		eb = eb.append(getId(), that.getId());
		return eb.isEquals();
	}

	@Override
	public int hashCode() {

		return getId();
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

	@JsonIgnore
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
		return Integer.valueOf(field);
	}
}
