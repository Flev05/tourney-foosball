
package it.lms.tourney.po;

import java.io.Serializable;
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
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@XmlRootElement
@Table(name = "client", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class Client extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            businessName;
    private String            username;

    private String            address;
    private String            phoneNumber;
    private String            email;

    private String            siteUrl;

    private Country           country;

    private Set<User>         users;

    public Client() {

        super();
    }

    @Override
    public String toString() {

        return "Client [businessName=" + businessName + ", username=" + username + ", address=" + address
                + ", phoneNumber=" + phoneNumber + ", email=" + email + ", siteUrl=" + siteUrl + ", country=" + country
                + "]";
    }

    @Override
    public int hashCode() {

        return super.getId() + email.hashCode();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "business_name")
    public String getBusinessName() {

        return businessName;
    }

    public void setBusinessName(String businessName) {

        this.businessName = businessName;
    }

    @Transient
    public String getUsername() {

        return username;
    }

    public void setUsername(String username) {

        this.username = username;
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

    @Column(name = "email")
    public String getEmail() {

        return email;
    }

    public void setEmail(String email) {

        this.email = email;
    }

    @Column(name = "site_url")
    public String getSiteUrl() {

        return siteUrl;
    }

    public void setSiteUrl(String url) {

        this.siteUrl = url;
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

    // bi-directional many-to-many association to User
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_client", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "ID"), inverseJoinColumns = @JoinColumn(name = "client_id", referencedColumnName = "ID"))
    public Set<User> getUsers() {

        return users;
    }

    public void setUsers(Set<User> users) {

        this.users = users;
    }
}
