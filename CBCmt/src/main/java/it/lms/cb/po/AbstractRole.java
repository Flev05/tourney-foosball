
package it.lms.cb.po;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

/**
 * The persistent class for the role database table.
 * 
 */
@MappedSuperclass
public class AbstractRole extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;
    private String            description;

    private String            name;

    private RoleType          roleType;
    private Company           company;

    private Set<User>         users;

    public AbstractRole() {

        roleType = new RoleType();
        company = new Company();
        users = new HashSet<>();
    }

    @Override
    public String toString() {

        return " Role [" + super.toString() + ", roleName=" + name + ", roleType=" + roleType.getName() + ", company="
                + company.getName() + "]";
    }

    @Override
    public int hashCode() {

        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((company == null) ? 0 : company.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result + ((roleType == null) ? 0 : roleType.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {

        if (this == obj) return true;
        if (!super.equals(obj)) return false;
        if (getClass() != obj.getClass()) return false;
        AbstractRole other = (AbstractRole) obj;
        if (company == null) {
            if (other.company != null) return false;
        } else if (!company.equals(other.company)) return false;
        if (name == null) {
            if (other.name != null) return false;
        } else if (!name.equals(other.name)) return false;
        if (roleType == null) {
            if (other.roleType != null) return false;
        } else if (!roleType.equals(other.roleType)) return false;
        return true;
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

    // bi-directional many-to-one association to Company
    @ManyToOne
    @JoinColumn(name = "company_id")
    public Company getCompany() {

        return company;
    }

    public void setCompany(Company company) {

        this.company = company;
    }

    // bi-directional many-to-one association to RoleType
    @ManyToOne
    @JoinColumn(name = "role_type_id")
    public RoleType getRoleType() {

        return roleType;
    }

    public void setRoleType(RoleType rt) {

        this.roleType = rt;
    }

    // bi-directional many-to-many association to User
    @ManyToMany(mappedBy = "roles")
    public Set<User> getUsers() {

        return users;
    }

    public void setUsers(Set<User> users) {

        this.users = users;
    }
}
