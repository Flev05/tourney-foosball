
package it.lms.cb.gui.vo;

import it.lms.tourney.cdi.ViewObject;
import it.lms.tourney.po.Country;

/**
 * The persistent class for the user database table.
 */
@ViewObject
public class TeamVO extends AbstractVO {

    private static final long serialVersionUID = 1L;

    private String            json;
    private String            teamName;
    private ClientVO          clientVO;
    private Country           country;

    public TeamVO() {

    }

    @Override
    public String toString() {

        return super.toString() + " Team [json=" + json + ", clientVO=" + clientVO + ", teamName=" + teamName
                + ", country=" + country + "]";
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

    public Country getCountry() {

        return country;
    }

    public void setCountry(Country country) {

        this.country = country;
    }

}
