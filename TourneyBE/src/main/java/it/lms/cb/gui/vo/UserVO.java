
package it.lms.cb.gui.vo;

import java.util.ArrayList;
import java.util.List;

import it.lms.tourney.cdi.ViewObject;

@ViewObject
public class UserVO extends CommonUserVO {

    private static final long serialVersionUID = 1L;

    private List<RoleVO>      roles;

    public UserVO() {

        roles = new ArrayList<RoleVO>();
    }

    public List<RoleVO> getRoles() {

        return roles;
    }

    public void setRoles(List<RoleVO> roles) {

        this.roles = roles;
    }
}
