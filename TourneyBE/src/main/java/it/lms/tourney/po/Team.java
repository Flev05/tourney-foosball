
package it.lms.tourney.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "team")
@Getter
@Setter
public class Team extends AbstractPO {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "json")
	private String json;

	@Column(name = "team_name")
	private String teamName;

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

	@Override
	public boolean equals(Object obj) {

		if (!super.equals(obj)) {
			return false;
		}
		Team fobj = (Team) obj;
		return teamName.equals(fobj.teamName);
	}

	@Override
	public int hashCode() {

		return teamName.hashCode() + super.hashCode();
	}

	@Override
	public String toString() {

		return super.toString() + " Team [teamName=" + teamName + ", client=" + client + ", session=" + session
				+ ", country=" + country + ", json=" + json + "]";
	}
}
