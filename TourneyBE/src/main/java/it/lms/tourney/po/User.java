
package it.lms.tourney.po;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "user_table")
@Getter
@Setter
public class User extends AbstractPO {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "username")
	private String username;

	@Column(name = "password")
	private String password;

	@Column(name = "firstname")
	private String firstname;

	@Column(name = "lastname")
	private String lastname;

	@Column(name = "address")
	private String address;

	@Column(name = "email")
	private String email;

	@Column(name = "phone_number")
	private String phoneNumber;

	@Column(name = "description")
	private String description;

	// bi-directional many-to-one association to Country
	@ManyToOne
	@JoinColumn(name = "country_id")
	private Country country;

	// bi-directional one-to-many association to UserRoleClient
	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
	private Set<UserRoleClient> urcSet;

	public User() {

		urcSet = new HashSet<>();
	}

	@Override
	public String toString() {

		return super.toString() + " User [username=" + username + ", password=" + password + ", firstname=" + firstname
				+ ", lastname=" + lastname + ", address=" + address + ", email=" + email + ", phoneNumber="
				+ phoneNumber + ", description=" + description + "]";
	}
}
