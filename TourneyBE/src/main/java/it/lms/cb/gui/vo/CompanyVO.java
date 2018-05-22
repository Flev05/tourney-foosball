
package it.lms.cb.gui.vo;

import it.lms.cb.po.Company;

/**
 * The View Object to represent a row in the table on the GUI
 * 
 * @author Luciano Martino
 */
public class CompanyVO extends GenericVO<Company> {

    private static final long serialVersionUID = 1L;

    public CompanyVO() {

        this(new Company());
    }

    public CompanyVO(Company ac) {

        super(ac);
    }

    @Override
    public String toString() {

        return getName();
    }

    public String getCompanyEmail() {

        return this.getPo().getCompanyEmail();
    }

    public void setCompanyEmail(String email) {

        this.getPo().setCompanyEmail(email);
    }

    public String getVat() {

        return this.getPo().getVat();
    }

    public void setVat(String vat) {

        this.getPo().setVat(vat);
    }

    public String getTaxCode() {

        return this.getPo().getTaxCode();
    }

    public void setTaxCode(String taxCode) {

        this.getPo().setTaxCode(taxCode);
    }

    public String getName() {

        return super.getPo().getName();
    }

    public void setName(String name) {

        super.getPo().setName(name);
    }

    public String getAddress() {

        return this.getPo().getAddress();
    }

    public void setAddress(String address) {

        this.getPo().setAddress(address);
    }

    public String getPhoneNumber() {

        return this.getPo().getPhoneNumber();
    }

    public void setPhoneNumber(String phoneNumber) {

        this.getPo().setPhoneNumber(phoneNumber);
    }

    public String getLogoUrl() {

        return this.getPo().getLogoUrl();
    }

    public void setLogoUrl(String url) {

        this.getPo().setLogoUrl(url);
    }
}
