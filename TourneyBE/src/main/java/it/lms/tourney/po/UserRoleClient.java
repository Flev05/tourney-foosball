
package it.lms.tourney.po;

import jakarta.persistence.Column;
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

	@Column(name = "available")
	private Boolean available;

	@Override
	public String toString() {

		return super.toString() + " UserRoleClient [user=" + user.getUsername() + ", role=" + role.getName()
				+ ", client=" + client.getBusinessName() + "]";
	}
}
