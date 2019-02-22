
package it.lms.tourney.po;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * The persistent class for the role database table.
 * 
 */
@Entity
@Table(name = "role")
public class Role extends AbstractPO implements Serializable {

    private static final long   serialVersionUID = 1L;

    private String              name;
    private String              description;

    private Set<UserRoleClient> urcSet;

    public enum ROLES {
        DEVELOPER, OWNER, ADMIN, OPERATOR, FOLLOWER;
    }

    public Role() {

        urcSet = new HashSet<>();
    }

    @Override
    public String toString() {

        return super.toString() + " Role [name=" + name + ", description=" + description + "]";
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "name")
    public String getName() {

        return this.name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public String getDescription() {

        return this.description;
    }

    public void setDescription(String description) {

        this.description = description;
    }

    // bi-directional one-to-many association to UserRoleClient
    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    public Set<UserRoleClient> getUrcSet() {

        return this.urcSet;
    }

    public void setUrcSet(Set<UserRoleClient> urcSet) {

        this.urcSet = urcSet;
    }
}
