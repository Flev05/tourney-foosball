
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
@Table(name = "player")
@Getter
@Setter
public class Player extends AbstractPO {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "player_name")
	private String playerName;

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

	@Column(name = "json")
	private String json;

	@Override
	public boolean equals(Object obj) {

		if (!super.equals(obj)) {
			return false;
		}
		Player fobj = (Player) obj;
		return playerName.equals(fobj.playerName);
	}

	@Override
	public int hashCode() {

		return playerName.hashCode() + super.hashCode();
	}

	@Override
	public String toString() {

		return super.toString() + " Player [playerName=" + playerName + ", client=" + client + ", session=" + session
				+ ", country=" + country + ", json=" + json + "]";
	}
}
