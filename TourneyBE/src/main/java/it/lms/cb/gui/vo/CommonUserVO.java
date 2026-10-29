
package it.lms.cb.gui.vo;

import it.lms.tourney.po.Country;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommonUserVO extends AbstractVO {

    private static final long serialVersionUID = 1L;

    private String            username;
    private String            password;
    private String            firstname;
    private String            lastname;
    private String            address;
    private String            email;
    private String            phoneNumber;
    private String            asd;
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

}
