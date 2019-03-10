
package it.lms.cb.gui.vo;

import it.lms.tourney.cdi.DaoQualifier;
import it.lms.tourney.po.Country;

/**
 * The persistent class for the user database table.
 */
@DaoQualifier
public class PlayerVO extends AbstractVO {

    private static final long serialVersionUID = 1L;

    private String            json;
    private String            playerName;
    private ClientVO          clientVO;
    private Country           country;

    public PlayerVO() {

    }

    @Override
    public String toString() {

        return super.toString() + " Player [json=" + json + ", country=" + country + ", playerName=" + playerName
                + ", clientVO=" + clientVO + ", country=" + country + "]";
    }

    public String getJson() {

        return json;
    }

    public void setJson(String json) {

        this.json = json;
    }

    public String getPlayerName() {

        return playerName;
    }

    public void setPlayerName(String playerName) {

        this.playerName = playerName;
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
