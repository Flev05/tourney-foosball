
package it.lms.tourney.po;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "user_role_client")
@Getter
@Setter
public class UserRoleClient extends AbstractPO {

	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// bi-directional many-to-one association to User
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	// bi-directional many-to-one association to Role
	@ManyToOne
	@JoinColumn(name = "role_id")
	private Role role;

	// bi-directional many-to-one association to Client
	@ManyToOne
	@JoinColumn(name = "client_id")
	private Client client;

	// bi-directional many-to-many association to Tourney
	@ManyToOne()
	@JoinColumn(name = "tourney_id")
	private Tourney tourney;

	@Override
	public String toString() {
		return super.toString() + " UserRoleClient [user=" + user.getUsername() + ", role=" + role.getName()
				+ ", client=" + client.getBusinessName()   + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + Objects.hash(client, role, user);
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		UserRoleClient other = (UserRoleClient) obj;
		return Objects.equals(client, other.client) && Objects.equals(role, other.role)
				&& Objects.equals(user, other.user);
	}
}
