
package it.lms.cb.po;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 * The persistent class for the vehicle database table.
 * 
 */
@Entity
public class Person extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            firstName;
    private String            lastName;
    private String            residenceAddress;

    private Set<User>         users;

    public Person() {

        super();
    }

    @Override
    public String toString() {

        return "Person [firstName=" + firstName + ", lastName=" + lastName + "]";
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "first_name")
    public String getFirstName() {

        return firstName;
    }

    public void setFirstName(String firstName) {

        this.firstName = firstName;
    }

    @Column(name = "last_name")
    public String getLastName() {

        return lastName;
    }

    public void setLastName(String lastName) {

        this.lastName = lastName;
    }

    @Column(name = "residence_address")
    public String getResidenceAddress() {

        return residenceAddress;
    }

    public void setResidenceAddress(String residenceAddress) {

        this.residenceAddress = residenceAddress;
    }

    @OneToMany(mappedBy = "person")
    public Set<User> getUsers() {

        return users;
    }

    public void setUsers(Set<User> user) {

        this.users = user;
    }

}
