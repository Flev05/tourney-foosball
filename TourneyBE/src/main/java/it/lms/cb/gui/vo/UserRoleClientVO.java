
package it.lms.cb.gui.vo;

public class UserRoleClientVO extends AbstractVO {

    private static final long serialVersionUID = 1L;

    UserVO                    userVo;
    RoleVO                    roleVo;
    ClientVO                  clientVO;

    public UserRoleClientVO() {

    }

    @Override
    public String toString() {

        return super.toString() + " UserRoleClientVO [userVo=" + userVo + ", roleVo=" + roleVo + ", clientVO="
                + clientVO + "]";
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

    public ClientVO getClientVO() {

        return clientVO;
    }

    public void setClientVO(ClientVO clientVO) {

        this.clientVO = clientVO;
    }

}
