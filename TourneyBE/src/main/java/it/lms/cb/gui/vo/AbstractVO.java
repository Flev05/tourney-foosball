
package it.lms.cb.gui.vo;

import java.io.Serializable;

public abstract class AbstractVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Integer id;

	@Override
	public String toString() {

		return "AbstractVO [id=" + id + "]";
	}

	@Override
	public int hashCode() {

		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {

		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		AbstractVO other = (AbstractVO) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	public Integer getId() {

		return id;
	}

	public void setId(Integer id) {

		this.id = id;
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
		return Integer.valueOf(field);
	}

}
