
package it.lms.cb.gui.vo;

import it.lms.cb.po.Permission;
import it.lms.cb.po.RoleType;

/**
 * The View Object to represent a row in the table of the presences
 * 
 * @author Luciano Martino
 */
public class PermissionVO extends GenericVO<Permission> {

    private static final long serialVersionUID = 1L;

    private Integer           roleTypeId;
    private Integer           resourceId;
    private String            permissionId;

    public PermissionVO(Permission bo) {

        super(bo);
    }

    public PermissionVO() {

        this(new Permission());
    }

    public Integer getId() {

        return super.getPo().getId();
    }

    public void setId(Integer id) {

        super.getPo().setId(id);
    }

    public String getAccessType() {

        return getPo().getAccessType();
    }

    public RoleType getRoleType() {

        return getPo().getRoleType();
    }

    public void setAccessType(String name) {

        this.getPo().setAccessType(name);
    }

    public String getRoleName() {

        return getRoleType().getName();
    }

    public void setRoleName(String name) {

        this.getRoleType().setName(name);
    }

    public String getResourceName() {

        return getPo().getResource().getName();
    }

    public void setResourceName(String name) {

        this.getPo().getResource().setName(name);
    }

    public Integer getRoleTypeId() {

        return roleTypeId;
    }

    public void setRoleTypeId(Integer roleId) {

        this.roleTypeId = roleId;
    }

    public Integer getResourceId() {

        return resourceId;
    }

    public void setResourceId(Integer resourceId) {

        this.resourceId = resourceId;
    }

    public String getPermissionId() {

        return permissionId;
    }

    public void setPermissionId(String permissionId) {

        this.permissionId = permissionId;
    }

}
