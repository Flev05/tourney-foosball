
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

@Entity
@Table(name = "client")
public class Client extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            firstname;
    private String            lastname;
    private String            businessName;

    private String            address;
    private String            phoneNumber;
    private String            email;

    private String            siteUrl;

    private Location          location;

    public Client() {

        super();
        location = new Location();
    }

    @Override
    public String toString() {

        return "Client [firstname=" + firstname + ", lastname=" + lastname + ", businessName=" + businessName
                + ", address=" + address + ", phoneNumber=" + phoneNumber + ", email=" + email + ", siteUrl=" + siteUrl
                + ", location=" + location + "]";
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

    @Column(name = "firstname")
    public String getFirstname() {

        return firstname;
    }

    public void setFirstname(String name) {

        this.firstname = name;
    }

    @Column(name = "lastname")
    public String getLastname() {

        return lastname;
    }

    public void setLastname(String lastname) {

        this.lastname = lastname;
    }

    @Column(name = "business_name")
    public String getBusinessName() {

        return businessName;
    }

    public void setBusinessName(String businessName) {

        this.businessName = businessName;
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

    // bi-directional many-to-one association to Location
    @ManyToOne
    @JoinColumn(name = "location_id")
    public Location getLocation() {

        return location;
    }

    public void setLocation(Location location) {

        this.location = location;
    }
}
