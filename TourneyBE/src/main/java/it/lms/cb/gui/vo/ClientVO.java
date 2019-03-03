
package it.lms.cb.gui.vo;

import it.lms.tourney.po.Country;

public class ClientVO extends AbstractVO {

    private static final long serialVersionUID = 1L;

    private String            businessName;
    private String            address;
    private String            phoneNumber;
    private String            email;
    private String            siteUrl;

    private Country           country;

    @Override
    public String toString() {

        return super.toString() + " ClientVO [businessName=" + businessName + ", address=" + address + ", phoneNumber="
                + phoneNumber + ", email=" + email + ", siteUrl=" + siteUrl + ", country=" + country + "]";
    }

    public String getBusinessName() {

        return businessName;
    }

    public void setBusinessName(String businessName) {

        this.businessName = businessName;
    }

    public String getAddress() {

        return address;
    }

    public void setAddress(String address) {

        this.address = address;
    }

    public String getPhoneNumber() {

        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {

        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {

        return email;
    }

    public void setEmail(String email) {

        this.email = email;
    }

    public String getSiteUrl() {

        return siteUrl;
    }

    public void setSiteUrl(String siteUrl) {

        this.siteUrl = siteUrl;
    }

    public Country getCountry() {

        return country;
    }

    public void setCountry(Country country) {

        this.country = country;
    }
}
