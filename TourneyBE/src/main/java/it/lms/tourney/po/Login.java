
package it.lms.tourney.po;

import java.io.Serializable;

import javax.persistence.Column;

/**
 * The persistent class for the user database table.
 */
public class Login extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            username;
    private String            password;

    public Login() {

    }

    @Override
    public String toString() {

        return super.toString() + " Login [username=" + username + ", password=" + password + "]";
    }

    @Column(name = "username")
    public String getUsername() {

        return this.username;
    }

    public void setUsername(String username) {

        this.username = username;
    }

    @Column(name = "password")
    public String getPassword() {

        return this.password;
    }
}
