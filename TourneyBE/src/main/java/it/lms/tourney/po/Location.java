
package it.lms.tourney.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "location")
public class Location extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            city;
    private String            cityCode;
    private String            provinceCode;
    private String            zipCode;
    private String            countryCode;

    public Location() {

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "city")
    public String getCity() {

        return city;
    }

    public void setCity(String city) {

        this.city = city;
    }

    @Column(name = "city_code")
    public String getCityCode() {

        return cityCode;
    }

    public void setCityCode(String cityCode) {

        this.cityCode = cityCode;
    }

    @Column(name = "province_code")
    public String getProvinceCode() {

        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {

        this.provinceCode = provinceCode;
    }

    @Column(name = "zip_code")
    public String getZipCode() {

        return zipCode;
    }

    public void setZipCode(String zipCode) {

        this.zipCode = zipCode;
    }

    @Column(name = "country_code")
    public String getCountryCode() {

        return countryCode;
    }

    public void setCountryCode(String countryCode) {

        this.countryCode = countryCode;
    }

}
