
package it.lms.cb.gui.vo;

import it.lms.tourney.po.Country;

public class CommonUserVO extends AbstractVO {

    private static final long serialVersionUID = 1L;

    private String            username;
    private String            password;

    private String            firstname;
    private String            lastname;

    private String            address;
    private String            email;
    private String            phoneNumber;

    private String            description;

    private Country           country;

    public CommonUserVO() {

    }

    @Override
    public String toString() {

        return super.toString() + " UserVO [username=" + username + ", password=" + password + ", firstname="
                + firstname + ", lastname=" + lastname + ", address=" + address + ", email=" + email + ", phoneNumber="
                + phoneNumber + ", description=" + description + ", country=" + country + "]";
    }

    public String getUsername() {

        return username;
    }

    public void setUsername(String username) {

        this.username = username;
    }

    public String getPassword() {

        return password;
    }

    public void setPassword(String password) {

        this.password = password;
    }

    public String getFirstname() {

        return firstname;
    }

    public void setFirstname(String firstname) {

        this.firstname = firstname;
    }

    public String getLastname() {

        return lastname;
    }

    public void setLastname(String lastname) {

        this.lastname = lastname;
    }

    public String getAddress() {

        return address;
    }

    public void setAddress(String address) {

        this.address = address;
    }

    public String getEmail() {

        return email;
    }

    public void setEmail(String email) {

        this.email = email;
    }

    public String getPhoneNumber() {

        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {

        this.phoneNumber = phoneNumber;
    }

    public Country getCountry() {

        return country;
    }

    public void setCountry(Country country) {

        this.country = country;
    }

    public String getDescription() {

        return this.description;
    }

    public void setDescription(String description) {

        this.description = description;
    }
}
