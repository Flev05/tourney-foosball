
package it.lms.cb.po;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
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
@Table(name = "role_type")
public class RoleType extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            name;
    private String            description;
    private Set<Role>         roles;
    private Set<Permission>   permissions;

    public enum ROLES {
        DEVELOPER, DEMO, OWNER, ADMIN, OPERATOR, DRIVER, AGENCY, LINES, PASSENGER;
    }

    private static Set<String> NOT_AGENCY_ROLES;

    static {
        NOT_AGENCY_ROLES = new HashSet<>();
        NOT_AGENCY_ROLES.add(RoleType.ROLES.DEVELOPER.name());
        NOT_AGENCY_ROLES.add(RoleType.ROLES.OWNER.name());
        NOT_AGENCY_ROLES.add(RoleType.ROLES.ADMIN.name());
        NOT_AGENCY_ROLES.add(RoleType.ROLES.LINES.name());
        NOT_AGENCY_ROLES.add(RoleType.ROLES.DRIVER.name());
        NOT_AGENCY_ROLES.add(RoleType.ROLES.OPERATOR.name());
        NOT_AGENCY_ROLES.add(RoleType.ROLES.PASSENGER.name());
    };

    public RoleType() {

        permissions = new HashSet<>();

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

    @Column(name = "name")
    public String getName() {

        return this.name;
    }

    public void setName(String name) {

        this.name = name;
    }

    @OneToMany(mappedBy = "roleType")
    public Set<Role> getRoles() {

        return this.roles;
    }

    public void setRoles(Set<Role> roles) {

        this.roles = roles;
    }

    @OneToMany(mappedBy = "roleType")
    public Set<Permission> getPermissions() {

        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {

        this.permissions = permissions;
    }

    public static boolean containsNotAgencyRoles(String roleName) {

        return NOT_AGENCY_ROLES.contains(roleName);
    }

    public static List<String> initialRoleTypes() {

        List<String> rtList = new ArrayList<>();

        rtList.add(RoleType.ROLES.OWNER.name());
        rtList.add(RoleType.ROLES.ADMIN.name());
        rtList.add(RoleType.ROLES.LINES.name());
        rtList.add(RoleType.ROLES.DRIVER.name());
        rtList.add(RoleType.ROLES.OPERATOR.name());
        rtList.add(RoleType.ROLES.PASSENGER.name());

        return rtList;
    }

    public static String getOwnerRoleType() {

        return RoleType.ROLES.OWNER.name();
    }

    // public boolean isOwner() {
    //
    // return name.equals(RoleType.ROLES.OWNER.name());
    // }
}
