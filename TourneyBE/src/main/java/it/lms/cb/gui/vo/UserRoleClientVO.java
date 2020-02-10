
package it.lms.cb.gui.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRoleClientVO extends AbstractVO {

    private static final long serialVersionUID = 1L;

    UserVO                    userVo;
    RoleVO                    roleVo;
    ClientVO                  clientVO;
    Integer                   tourneyId;
    Integer                   disciplineId;

    public UserRoleClientVO() {

    }

    @Override
    public String toString() {

        return super.toString() + " UserRoleClientVO [userVo=" + userVo + ", roleVo=" + roleVo + ", clientVO="
                + clientVO + "]";
    }
}
