
package it.lms.cb.gui.vo;

import it.lms.tourney.cdi.ViewObject;

/**
 * The persistent class for the user database table.
 */
@ViewObject
public class PlayerVO extends AbstractVO {

    private static final long serialVersionUID = 1L;

    private String            json;
    private String            playerName;
    private ClientVO          clientVO;

    public PlayerVO() {

    }

    @Override
    public String toString() {

        return super.toString() + " Player [json=" + json + ", client=" + clientVO + ", playerName=" + playerName + "]";
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
}
