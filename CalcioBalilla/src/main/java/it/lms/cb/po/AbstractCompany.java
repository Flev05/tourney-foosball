
package it.lms.cb.po;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToMany;

@MappedSuperclass
public abstract class AbstractCompany extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            name;
    private String            address;
    private String            vat;
    private String            taxCode;
    private String            phoneNumber;
    private String            logoUrl;
    private String            companyEmail;
    private String            companyCode;

    private Set<Role>         roles;

    public AbstractCompany() {

        super();
        roles = new HashSet<>();
    }

    @Override
    public String toString() {

        return "AbstractCompany [name=" + name + ", address=" + address + ", vat=" + vat + ", taxCode=" + taxCode
                + ", phoneNumber=" + phoneNumber + ", logoUrl=" + logoUrl + ", companyEmail=" + companyEmail
                + ", companyCode=" + companyCode + "]";
    }

    @Override
    public int hashCode() {

        return super.getId() + companyEmail.hashCode();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "COMPANY_EMAIL")
    public String getCompanyEmail() {

        return companyEmail;
    }

    public void setCompanyEmail(String email) {

        this.companyEmail = email;
    }

    @Column(name = "VAT")
    public String getVat() {

        return vat;
    }

    public void setVat(String vat) {

        this.vat = vat;
    }

    @Column(name = "TAX_CODE")
    public String getTaxCode() {

        return taxCode;
    }

    public void setTaxCode(String url) {

        this.taxCode = url;
    }

    @Column(name = "NAME")
    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    @Column(name = "ADDRESS")
    public String getAddress() {

        return address;
    }

    public void setAddress(String address) {

        this.address = address;
    }

    @Column(name = "phone_number")
    public String getPhoneNumber() {

        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {

        this.phoneNumber = phoneNumber;
    }

    @Column(name = "logo_url")
    public String getLogoUrl() {

        return logoUrl;
    }

    public void setLogoUrl(String url) {

        this.logoUrl = url;
    }

    @Column(name = "company_code")
    public String getCompanyCode() {

        return companyCode;
    }

    public void setCompanyCode(String companyCode) {

        this.companyCode = companyCode;
    }

    @OneToMany(mappedBy = "company")
    public Set<Role> getRoles() {

        return roles;
    }

    public void setRoles(Set<Role> roles) {

        this.roles = roles;
    }

}
