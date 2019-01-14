
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

    private String            json;

    private Client            client;
    private Session           session;

    public Player() {

    }

    @Override
    public String toString() {

        return super.toString() + " Player [json=" + json + ", client=" + client + ", session=" + session + "]";
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "json")
    public String getJson() {

        return json;
    }

    public void setJson(String json) {

        this.json = json;
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

}
