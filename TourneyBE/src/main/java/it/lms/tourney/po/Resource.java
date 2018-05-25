
package it.lms.tourney.po;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Entity;
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
@Table(name = "resource")
public class Resource extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            description;
    private String            name;

    private Set<Permission>   permissions;

    public Resource() {

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    public String getDescription() {

        return this.description;
    }

    public void setDescription(String description) {

        this.description = description;
    }

    public String getName() {

        return this.name;
    }

    public void setName(String name) {

        this.name = name;
    }

    @OneToMany(mappedBy = "resource")
    public Set<Permission> getPermissions() {

        return this.permissions;
    }

    public void setPermissions(Set<Permission> p) {

        this.permissions = p;
    }
}
