
package it.lms.cb.gui.vo;

import java.io.Serializable;
import java.util.List;

import it.lms.tourney.po.Country;

/**
 * The persistent class for the user database table.
 */
public class TourneyVO extends AbstractVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            tourneyName;
    private ClientVO          clientVO;
    private Country           country;
    private String            json;
    private List<MeetingVO>   mdbs;

    public TourneyVO() {

    }

    @Override
    public String toString() {

        return super.toString() + " TourneyVO [tourneyName=" + tourneyName + ", clientVO=" + clientVO + ", json=" + json
                + ", country=" + country + "]";
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

    public List<MeetingVO> getMdbs() {

        return mdbs;
    }

    public void setMdbs(List<MeetingVO> mdbs) {

        this.mdbs = mdbs;
    }
}
