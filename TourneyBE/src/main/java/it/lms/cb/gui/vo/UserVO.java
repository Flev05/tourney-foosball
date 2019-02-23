
package it.lms.cb.gui.vo;

import java.util.ArrayList;
import java.util.List;

public class UserVO extends CommonUserVO {

    private static final long serialVersionUID = 1L;

    private List<RoleVO>      roles;

    public UserVO() {

        roles = new ArrayList<RoleVO>();
    }

    public List<RoleVO> getRoles() {

        return roles;
    }

}
