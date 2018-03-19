
package it.lms.cb.po;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "company")
public class Company extends AbstractCompany {

    private static final long serialVersionUID = 1L;

    public Company() {

        super();
    }
}
