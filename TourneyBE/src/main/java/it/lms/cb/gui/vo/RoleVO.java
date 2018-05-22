
package it.lms.cb.gui.vo;

import it.lms.cb.po.AbstractRole;
import it.lms.cb.po.Company;
import it.lms.cb.po.Role;
import it.lms.cb.po.RoleType;

/**
 * The View Object to represent a row in the table of the presences
 * 
 * @author Luciano Martino
 */
public class RoleVO extends GenericVO<AbstractRole> {

    private static final long serialVersionUID = 1L;

    private Integer           roleId;
    private Integer           companyId;

    public RoleVO(AbstractRole bo) {

        super(bo);
    }

    public RoleVO() {

        this(new Role());
    }

    public String getName() {

        return getPo().getName();
    }

    public void setName(String name) {

        this.getPo().setName(name);
    }

    public void setRoleTypeName(String name) {

        this.getRoleType().setName(name);
    }

    public RoleType getRoleType() {

        return this.getPo().getRoleType();
    }

    public void setRoleType(RoleType rt) {

        this.getPo().setRoleType(rt);
    }

    public String getDescription() {

        return getPo().getDescription();
    }

    public void setDescription(String name) {

        this.getPo().setDescription(name);
    }

    public String getCompanyName() {

        Company company = getPo().getCompany();

        return company.getName();
    }

    public void setCompanyName(String companyName) {

        Company company = getCompany();
        company.setName(companyName);
    }

    public Company getCompany() {

        return getPo().getCompany();
    }

    public void setCompany(Company cpo) {

        getPo().setCompany(cpo);
    }

    public Integer getRoleId() {

        return roleId;
    }

    public void setRoleId(Integer roleId) {

        this.roleId = roleId;
    }

    public Integer getCompanyId() {

        return companyId;
    }

    public void setCompanyId(Integer companyId) {

        this.companyId = companyId;
    }
}
