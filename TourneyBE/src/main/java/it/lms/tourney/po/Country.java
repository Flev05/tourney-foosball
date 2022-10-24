
package it.lms.tourney.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Getter;
import lombok.Setter;

@Entity
@XmlRootElement
@Table(name = "country", uniqueConstraints = @UniqueConstraint(columnNames = "city"))
@Getter
@Setter
public class Country extends AbstractPO {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "city")
	private String city;

	@Column(name = "city_code")
	private String cityCode;

	@Column(name = "province_code")
	private String provinceCode;

	@Column(name = "zip_code")
	private String zipCode;

	@Column(name = "country_code")
	private String countryCode;

	public Country() {

	}

	@Override
	public String toString() {

		return super.toString() + " Country [city=" + city + ", cityCode=" + cityCode + ", provinceCode=" + provinceCode
				+ ", zipCode=" + zipCode + ", countryCode=" + countryCode + "]";
	}
}
