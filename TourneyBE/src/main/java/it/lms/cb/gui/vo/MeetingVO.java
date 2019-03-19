
package it.lms.cb.gui.vo;

import java.io.Serializable;

import it.lms.tourney.po.Country;

/**
 * The view object VO class
 */
public class MeetingVO extends AbstractVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            json;

    private Integer           tourneyId;
    private Integer           roundId;
    private Integer           playoffId;
    private Integer           eliminatoryId;

    private Country           country;

    public MeetingVO() {

    }

    @Override
    public String toString() {

        return super.toString() + " Meeting [json=" + json + ", tourneyId=" + tourneyId + ", roundId=" + roundId
                + ", playoffId=" + playoffId + ", eliminatoryId=" + eliminatoryId + ", country=" + country + "]";
    }

    public Integer getTourneyId() {

        return tourneyId;
    }

    public void setTourneyId(Integer tourneyId) {

        this.tourneyId = tourneyId;
    }

    public String getJson() {

        return json;
    }

    public void setJson(String json) {

        this.json = json;
    }

    public Integer getRoundId() {

        return roundId;
    }

    public void setRoundId(Integer roundId) {

        this.roundId = roundId;
    }

    public Integer getPlayoffId() {

        return playoffId;
    }

    public void setPlayoffId(Integer playoffId) {

        this.playoffId = playoffId;
    }

    public Integer getEliminatoryId() {

        return eliminatoryId;
    }

    public void setEliminatoryId(Integer eliminatoryId) {

        this.eliminatoryId = eliminatoryId;
    }

    public Country getCountry() {

        return country;
    }

    public void setCountry(Country country) {

        this.country = country;
    }

}
