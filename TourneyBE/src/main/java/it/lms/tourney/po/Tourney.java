
package it.lms.tourney.po;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
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
@Table(name = "tourney")
@Getter
@Setter
public class Tourney extends AbstractPO {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "tourney_name")
	private String tourneyName;

	// bi-directional many-to-one association to Client
	@ManyToOne
	@JoinColumn(name = "client_id")
	private Client client;

	// bi-directional many-to-one association to Session
	@ManyToOne
	@JoinColumn(name = "session_id")
	private Session session;

	// bi-directional many-to-one association to Country
	@ManyToOne
	@JoinColumn(name = "country_id")
	private Country country;

	// bi-directional many-to-one association to Discipline
	@ManyToOne
	@JoinColumn(name = "discipline_id")
	private Discipline discipline;

	@Column(name = "json")
	private String json;

	// bi-directional one-to-many association to Meeting
	@OneToMany(mappedBy = "tourney", cascade = { CascadeType.ALL }, fetch = FetchType.LAZY)
	private Set<Meeting> meetings;

	// bi-directional many-to-many association to UserRoleClient
	@OneToMany(mappedBy = "tourney", fetch = FetchType.LAZY)
	private Set<UserRoleClient> urcs = new HashSet<>();

	@Override
	public boolean equals(Object obj) {

		if (!super.equals(obj)) {
			return false;
		}
		Tourney fobj = (Tourney) obj;
		return tourneyName.equals(fobj.tourneyName);
	}

	@Override
	public int hashCode() {

		return tourneyName.hashCode() + super.hashCode();
	}

	@Override
	public String toString() {

		return super.toString() + " Tourney [client=" + client + ", session=" + session + ", country=" + country
				+ ", json=" + json + "]";
	}
}
