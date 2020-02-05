
package it.lms.tourney.po;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "user_role_client")
public class UserRoleClient extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private User              user;
    private Role              role;
    private Client            client;
    private Discipline        discipline;

    private Set<Tourney>      tourneys;

    @Override
    public String toString() {

        return super.toString() + " UserRoleClient [user=" + user + ", role=" + role + ", client=" + client + "]";
    }

    @Override
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    // bi-directional many-to-one association to User
    @ManyToOne
    @JoinColumn(name = "user_id")
    public User getUser() {

        return user;
    }

    public void setUser(User user) {

        this.user = user;
    }

    // bi-directional many-to-one association to Role
    @ManyToOne
    @JoinColumn(name = "role_id")
    public Role getRole() {

        return role;
    }

    public void setRole(Role role) {

        this.role = role;
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

    // bi-directional many-to-one association to Discipline
    @ManyToOne
    @JoinColumn(name = "discipline_id")
    public Discipline getDiscipline() {

        return discipline;
    }

    public void setDiscipline(Discipline discipline) {

        this.discipline = discipline;
    }

    // bi-directional many-to-many association to UserRoleClient
    @ManyToMany(mappedBy = "urcs", fetch = FetchType.LAZY)
    public Set<Tourney> getTourneys() {

        return tourneys;
    }

    public void setTourneys(Set<Tourney> tourneys) {

        this.tourneys = tourneys;
    }

}
