
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

    public Meeting() {

    }

    @Override
    public String toString() {

        return super.toString() + " Meeting [tourney=" + tourney + ", roundId=" + roundId + ", playoffId=" + playoffId
                + ", eliminatoryId=" + eliminatoryId + ", country=" + country + "json=" + json + "]";
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
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
