
package it.lms.cb.gui.vo;

import it.lms.tourney.cdi.DaoQualifier;
import it.lms.tourney.po.Country;

/**
 * The persistent class for the user database table.
 */
@DaoQualifier
public class TeamVO extends AbstractVO {

    private static final long serialVersionUID = 1L;

    private String            json;
    private String            teamName;
    private Integer           clientId;
    private Country           country;

    public TeamVO() {

    }

    @Override
    public String toString() {

        return super.toString() + " Team [json=" + json + ", clientId=" + clientId + ", teamName=" + teamName
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

    public Integer getClientId() {

        return clientId;
    }

    public void setClientId(Integer clientId) {

        this.clientId = clientId;
    }

    public Country getCountry() {

        return country;
    }

    public void setCountry(Country country) {

        this.country = country;
    }

}
