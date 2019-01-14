
package it.lms.tourney.po;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

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
import javax.persistence.Table;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "user_table")
public class User extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;
    private String            firstname;
    private String            lastname;

    private String            address;
    private String            email;
    private String            phoneNumber;

    private Client            client;
    private Country           country;

    private Set<Role>         roles;

    public User() {

        roles = new HashSet<Role>();
    }

    @Override
    public String toString() {

        return super.toString() + " User [firstname=" + firstname + ", lastname=" + lastname + ", address=" + address
                + ", email=" + email + ", phoneNumber=" + phoneNumber + ", client=" + client + ", country=" + country
                + ", roles=" + roles + "]";
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "firstname")
    public String getFirstname() {

        return firstname;
    }

    public void setFirstname(String firstname) {

        this.firstname = firstname;
    }

    @Column(name = "lastname")
    public String getLastname() {

        return lastname;
    }

    public void setLastname(String lastname) {

        this.lastname = lastname;
    }

    @Column(name = "email")
    public String getEmail() {

        return email;
    }

    public void setEmail(String email) {

        this.email = email;
    }

    @Column(name = "address")
    public String getAddress() {

        return address;
    }

    public void setAddress(String address) {

        this.address = address;
    }

    @Column(name = "phone_number")
    public String getPhoneNumber() {

        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {

        this.phoneNumber = phoneNumber;
    }

    // bi-directional many-to-many association to Role
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "ID"), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "ID"))
    public Set<Role> getRoles() {

        return this.roles;
    }

    public void setRoles(Set<Role> roles) {

        this.roles = roles;
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
