
package it.lms.cb.po;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "user_table")
public class User extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;
    private String            gecos;
    private String            password;
    private String            username;
    private Person            person;
    private Boolean           roleAdmin;

    private String            guide;

    private Set<Role>         roles;

    public User() {

        person = new Person();
        roles = new HashSet<Role>();
    }

    @Override
    public String toString() {

        return "User [password=" + password + ", username=" + username + ", person=" + person + "]";
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    public String getGecos() {

        return this.gecos;
    }

    public void setGecos(String gecos) {

        this.gecos = gecos;
    }

    public String getPassword() {

        return this.password;
    }

    public void setPassword(String password) {

        this.password = password;
    }

    public String getUsername() {

        return this.username;
    }

    public void setUsername(String username) {

        this.username = username;
    }

    @Column(name = "role_admin")
    public Boolean getRoleAdmin() {

        return roleAdmin;
    }

    public void setRoleAdmin(Boolean roleAdmin) {

        this.roleAdmin = roleAdmin;
    }

    @Column(name = "guide")
    public String getGuide() {

        return guide;
    }

    public void setGuide(String guide) {

        this.guide = guide;
    }

    // bi-directional many-to-many association to Role
    @ManyToMany
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "ID"), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "ID"))
    public Set<Role> getRoles() {

        return this.roles;
    }

    public void setRoles(Set<Role> roles) {

        this.roles = roles;
    }

    @ManyToOne
    @JoinColumn(name = "person_id")
    public Person getPerson() {

        return person;
    }

    public void setPerson(Person person) {

        this.person = person;
    }
}
