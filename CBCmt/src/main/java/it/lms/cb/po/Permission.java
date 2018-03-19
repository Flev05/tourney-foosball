
package it.lms.cb.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * The persistent class for the role database table.
 * 
 */
@Entity
@Table(name = "permission")
public class Permission extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            accessType;

    private RoleType          roleType;
    private Resource          resource;

    public enum ACCESS_TYPE {
        NO, RO, RW;
    }

    public Permission() {

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "access_type")
    public String getAccessType() {

        return this.accessType;
    }

    public void setAccessType(String accessType) {

        this.accessType = accessType;
    }

    // bi-directional many-to-one association to Role
    @ManyToOne
    @JoinColumn(name = "role_type_id")
    public RoleType getRoleType() {

        return roleType;
    }

    public void setRoleType(RoleType r) {

        this.roleType = r;
    }

    // bi-directional many-to-one association to Resource
    @ManyToOne
    @JoinColumn(name = "resource_id")
    public Resource getResource() {

        return resource;
    }

    public void setResource(Resource r) {

        this.resource = r;
    }
}
