
package it.lms.cb.gui.vo;

public class UserRoleClientVO extends CommonUserVO {

    private static final long serialVersionUID = 1L;

    UserVO                    userVo;
    RoleVO                    roleVo;
    ClientVO                  clientVo;

    public UserRoleClientVO() {

    }

    public UserVO getUserVo() {

        return userVo;
    }

    public void setUserVo(UserVO userVo) {

        this.userVo = userVo;
    }

    public RoleVO getRoleVo() {

        return roleVo;
    }

    public void setRoleVo(RoleVO roleVo) {

        this.roleVo = roleVo;
    }

    public ClientVO getClientVo() {

        return clientVo;
    }

    public void setClientVo(ClientVO clientVo) {

        this.clientVo = clientVo;
    }

}
