
package it.lms.cb.gui.vo;

public class RoleVO extends AbstractVO {

	private static final long serialVersionUID = 1L;

	private String name;
	private String description;

	@Override
	public String toString() {

		return super.toString() + " RoleVO [name=" + name + ", description=" + description + "]";
	}

	public String getName() {

		return name;
	}

	public void setName(String name) {

		this.name = name;
	}

	public String getDescription() {

		return description;
	}

	public void setDescription(String description) {

		this.description = description;
	}

}
