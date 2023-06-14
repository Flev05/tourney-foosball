
package it.lms.tourney.po;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "meeting")
@Getter
@Setter
public class Meeting extends AbstractPO {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "json")
	private String json;

	// bi-directional many-to-one association to Tourney
	@ManyToOne
	@JoinColumn(name = "tourney_id")
	private Tourney tourney;

	@Column(name = "round_id")
	private Integer roundId;

	@Column(name = "playoff_id")
	private Integer playoffId;

	@Column(name = "playout_id")
	private Integer playoutId;

	@Column(name = "eliminatory_id")
	private Integer eliminatoryId;

	@Column(name = "eliminatory_b_id")
	private Integer eliminatoryBId;

	// bi-directional many-to-one association to Country
	@ManyToOne
	@JoinColumn(name = "country_id")
	private Country country;

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
}
