
package it.lms.cb.gui.vo;

import java.util.ArrayList;
import java.util.List;

public class UserVO extends CommonUserVO {

    private static final long serialVersionUID = 1L;

    private List<Integer>     clientIdList;

    private List<RoleVO>      roles;

    public UserVO() {

        roles = new ArrayList<RoleVO>();
        clientIdList = new ArrayList<>();
    }

    public List<Integer> getClientIdList() {

        return clientIdList;
    }

    public void setClientIdList(List<Integer> clientIdList) {

        this.clientIdList = clientIdList;
    }

    public List<RoleVO> getRoles() {

        return roles;
    }

    public void setRoles(List<RoleVO> roles) {

        this.roles = roles;
    }
}
