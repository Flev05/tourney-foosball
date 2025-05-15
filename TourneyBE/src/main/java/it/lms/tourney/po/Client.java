
package it.lms.tourney.po;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@XmlRootElement
@Table(name = "client", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter
@Setter
public class Client extends AbstractPO {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "business_name")
	private String businessName;

	@Column(name = "address")
	private String address;

	@Column(name = "phone_number")
	private String phoneNumber;

	@Column(name = "email")
	private String email;

	@Column(name = "site_url")
	private String siteUrl;

	// bi-directional many-to-one association to Country
	@ManyToOne
	@JoinColumn(name = "country_id")
	private Country country;

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
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + Objects.hash(businessName);
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		Client other = (Client) obj;
		return Objects.equals(businessName, other.businessName);
	}
}
