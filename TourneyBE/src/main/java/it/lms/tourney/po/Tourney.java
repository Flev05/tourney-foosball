
package it.lms.tourney.po;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "tourney")
public class Tourney extends AbstractPO implements Serializable {

    private static final long   serialVersionUID = 1L;

    private String              tourneyName;
    private Client              client;
    private Session             session;
    private Country             country;
    private String              json;

    private Set<Meeting>        meetings;

    private Set<UserRoleClient> urcs             = new HashSet<>();

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

    @Column(name = "tourney_name")
    public String getTourneyName() {

        return tourneyName;
    }

    public void setTourneyName(String tourneyName) {

        this.tourneyName = tourneyName;
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

    // bi-directional one-to-many association to Meeting
    @OneToMany(mappedBy = "tourney", cascade = { CascadeType.ALL }, fetch = FetchType.LAZY)
    public Set<Meeting> getMeetings() {

        return this.meetings;
    }

    public void setMeetings(Set<Meeting> meetings) {

        this.meetings = meetings;
    }

    // bi-directional many-to-many association to UserRoleClient
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "tourney_urc", joinColumns = { @JoinColumn(name = "tourney_id") }, inverseJoinColumns = {
            @JoinColumn(name = "urc_id") })
    public Set<UserRoleClient> getUrcs() {

        return urcs;
    }

    public void setUrcs(Set<UserRoleClient> urcs) {

        this.urcs = urcs;
    }
}
