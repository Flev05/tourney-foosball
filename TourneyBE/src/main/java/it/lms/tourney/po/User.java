
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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import it.lms.tourney.cdi.PersistentObject;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "user_table")
@PersistentObject
public class User extends AbstractPO implements Serializable {

    private static final long   serialVersionUID = 1L;
    private String              username;
    private String              password;

    private String              firstname;
    private String              lastname;

    private String              address;
    private String              email;
    private String              phoneNumber;

    private String              description;

    private Country             country;

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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "username")
    public String getUsername() {

        return username;
    }

    public void setUsername(String username) {

        this.username = username;
    }

    @Column(name = "password")
    public String getPassword() {

        return password;
    }

    public void setPassword(String password) {

        this.password = password;
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

    public String getDescription() {

        return description;
    }

    public void setDescription(String description) {

        this.description = description;
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

    // bi-directional one-to-many association to UserRoleClient
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    public Set<UserRoleClient> getUrcSet() {

        return this.urcSet;
    }

    public void setUrcSet(Set<UserRoleClient> urcSet) {

        this.urcSet = urcSet;
    }

}
