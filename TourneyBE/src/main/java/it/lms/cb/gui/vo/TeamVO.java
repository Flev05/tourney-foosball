
package it.lms.cb.gui.vo;

import it.lms.tourney.cdi.ViewObject;

/**
 * The persistent class for the user database table.
 */
@ViewObject
public class TeamVO extends AbstractVO {

    private static final long serialVersionUID = 1L;

    private String            json;
    private String            teamName;
    private ClientVO          clientVO;

    public TeamVO() {

    }

    @Override
    public String toString() {

        return super.toString() + " Player [json=" + json + ", client=" + clientVO + ", teamName=" + teamName + "]";
    }

    public String getJson() {

        return json;
    }

    public void setJson(String json) {

        this.json = json;
    }

    public String getTeamName() {

        return teamName;
    }

    public void setTeamName(String teamName) {

        this.teamName = teamName;
    }

    public ClientVO getClientVO() {

        return clientVO;
    }

    public void setClientVO(ClientVO clientVO) {

        this.clientVO = clientVO;
    }
}
