
package it.lms.tourney.po;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

/**
 * The persistent class for the role database table.
 * 
 */
@Entity
@Table(name = "role")
@Getter
@Setter
public class Role extends AbstractPO {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name")
	private String name;

	@Column(name = "description")
	private String description;

	// bi-directional one-to-many association to UserRoleClient
	@OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
	private Set<UserRoleClient> urcSet;

	public enum ROLES {

						DEVELOPER(5),
						OWNER(4),
						ADMIN(3),
						OPERATOR(2),
						FOLLOWER(1);

		private ROLES(int value) {

			this.value = value;
		}

		public static ROLES resolve(String roleName) {

			for (ROLES r : ROLES.values()) {
				if (r.name().equals(roleName)) {
					return r;
				}
			}
			return null;
		}

		private int value;

		public int getValue() {

			return value;
		}
	}

	public Role() {

		urcSet = new HashSet<>();
	}

	@Override
	public String toString() {

		return super.toString() + " Role [name=" + name + ", description=" + description + "]";
	}
}
