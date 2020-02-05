
package it.lms.cb.gui.vo;

import java.util.ArrayList;
import java.util.List;

import it.lms.tourney.cdi.DaoQualifier;
import lombok.Getter;
import lombok.Setter;

@DaoQualifier
@Getter
@Setter
public class UserVO extends CommonUserVO {

    private static final long serialVersionUID = 1L;

    private List<RoleVO>      roles;
    private List<RoleVO>      minorRoles;

    public UserVO() {

        roles = new ArrayList<>();
        minorRoles = new ArrayList<>();
    }
}
