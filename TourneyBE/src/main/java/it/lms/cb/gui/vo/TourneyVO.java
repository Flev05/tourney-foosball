
package it.lms.cb.gui.vo;

import java.io.Serializable;

/**
 * The persistent class for the user database table.
 */
public class TourneyVO extends AbstractVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            tourneyName;
    private Integer           clientId;
    private String            json;

    public TourneyVO() {

    }

    public String getTourneyName() {

        return tourneyName;
    }

    public void setTourneyName(String tourneyName) {

        this.tourneyName = tourneyName;
    }

    public String getJson() {

        return json;
    }

    public void setJson(String json) {

        this.json = json;
    }

    public Integer getClientId() {

        return clientId;
    }

    public void setClientId(Integer clientId) {

        this.clientId = clientId;
    }
}
