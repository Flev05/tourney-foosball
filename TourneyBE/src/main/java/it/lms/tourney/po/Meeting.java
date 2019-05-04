
package it.lms.tourney.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "meeting")
public class Meeting extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            json;

    private Tourney           tourney;
    private Integer           roundId;
    private Integer           playoffId;
    private Integer           eliminatoryId;
    private Country           country;

    @Override
    public boolean equals(Object obj) {

        if (!super.equals(obj)) {
            return false;
        }
        Meeting fobj = (Meeting) obj;

        boolean res0 = tourney.equals(fobj.tourney);
        boolean res1 = roundId.equals(fobj.roundId);
        boolean res2 = playoffId.equals(fobj.playoffId);
        boolean res3 = eliminatoryId.equals(fobj.eliminatoryId);

        return res0 && res1 && res2 && res3;
    }

    @Override
    public int hashCode() {

        int sum1 = roundId == null ? 0 : roundId.hashCode();
        int sum2 = playoffId == null ? 0 : playoffId.hashCode();
        int sum3 = eliminatoryId == null ? 0 : eliminatoryId.hashCode();
        return tourney.hashCode() + sum1 + sum2 + sum3 + super.hashCode();
    }

    @Override
    public String toString() {

        return super.toString() + " Meeting [tourney=" + tourney + ", roundId=" + roundId + ", playoffId=" + playoffId
                + ", eliminatoryId=" + eliminatoryId + ", country=" + country + "json=" + json + "]";
    }

    @Override
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    @Column(name = "json")
    public String getJson() {

        return json;
    }

    public void setJson(String json) {

        this.json = json;
    }

    @Column(name = "round_id")
    public Integer getRoundId() {

        return roundId;
    }

    public void setRoundId(Integer roundId) {

        this.roundId = roundId;
    }

    @Column(name = "playoff_id")
    public Integer getPlayoffId() {

        return playoffId;
    }

    public void setPlayoffId(Integer playoffId) {

        this.playoffId = playoffId;
    }

    @Column(name = "eliminatory_id")
    public Integer getEliminatoryId() {

        return eliminatoryId;
    }

    public void setEliminatoryId(Integer eliminatoryId) {

        this.eliminatoryId = eliminatoryId;
    }

    // bi-directional many-to-one association to Tourney
    @ManyToOne
    @JoinColumn(name = "tourney_id")
    public Tourney getTourney() {

        return tourney;
    }

    public void setTourney(Tourney tourney) {

        this.tourney = tourney;
    }

    // bi-directional many-to-one association to Country
    @ManyToOne
    @JoinColumn(name = "country_id")
    public Country getCountry() {

        return country;
    }

    public void setCountry(Country country) {

        this.country = country;
    }
}
