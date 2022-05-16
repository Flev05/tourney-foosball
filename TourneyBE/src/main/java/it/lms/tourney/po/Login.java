
package it.lms.tourney.po;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

/**
 * The persistent class for the user database table.
 */
@Getter
@Setter
public class Login extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer           id;

    private String            username;
    private String            password;

    public Login() {

    }

    @Override
    public String toString() {

        return super.toString() + " Login [username=" + username + ", password=" + password + "]";
    }
}
