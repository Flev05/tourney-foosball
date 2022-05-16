
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
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Getter;
import lombok.Setter;

@Entity
@XmlRootElement
@Table(name = "client", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter
@Setter
public class Client extends AbstractPO implements Serializable {

    private static final long   serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer             id;

    @Column(name = "business_name")
    private String              businessName;

    @Column(name = "address")
    private String              address;

    @Column(name = "phone_number")
    private String              phoneNumber;

    @Column(name = "email")
    private String              email;

    @Column(name = "site_url")
    private String              siteUrl;

    // bi-directional many-to-one association to Country
    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country             country;

    // bi-directional one-to-many association to UserRoleClient
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private Set<UserRoleClient> urcSet;

    public Client() {

        super();
        urcSet = new HashSet<>();

    }

    @Override
    public String toString() {

        return "Client [businessName=" + businessName + ", address=" + address + ", phoneNumber=" + phoneNumber
                + ", email=" + email + ", siteUrl=" + siteUrl + ", country=" + country + "]";
    }

    @Override
    public int hashCode() {

        return getId() + email.hashCode();
    }
}
