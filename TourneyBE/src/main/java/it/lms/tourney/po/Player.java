
package it.lms.tourney.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "player")
public class Player extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            playerName;

    private Client            client;
    private Session           session;
    private Country           country;
    private String            json;

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

    @Override
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    @Column(name = "json")
    public String getJson() {

        return json;
    }

    public void setJson(String json) {

        this.json = json;
    }

    @Column(name = "player_name")
    public String getPlayerName() {

        return playerName;
    }

    public void setPlayerName(String playerName) {

        this.playerName = playerName;
    }

    // bi-directional many-to-one association to Client
    @ManyToOne
    @JoinColumn(name = "client_id")
    public Client getClient() {

        return client;
    }

    public void setClient(Client client) {

        this.client = client;
    }

    // bi-directional many-to-one association to Session
    @ManyToOne
    @JoinColumn(name = "session_id")
    public Session getSession() {

        return session;
    }

    public void setSession(Session session) {

        this.session = session;
    }

    // bi-directional many-to-one association to Country
    @ManyToOne
    @JoinColumn(name = "country_id")
    public Country getCountry() {

        return country;
    }

    public void setCountry(Country country) {

        this.country = country;
    }
}
