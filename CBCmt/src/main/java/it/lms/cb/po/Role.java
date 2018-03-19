
package it.lms.cb.po;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * The persistent class for the role database table.
 * 
 */
@Entity
@Table(name = "role")
public class Role extends AbstractRole {

    private static final long serialVersionUID = 1L;

    public Role() {

        super();
    }

}
