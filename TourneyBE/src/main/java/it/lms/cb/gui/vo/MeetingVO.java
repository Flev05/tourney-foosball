
package it.lms.cb.gui.vo;

import it.lms.tourney.po.Country;
import lombok.Getter;
import lombok.Setter;

/**
 * The view object VO class
 */
@Getter
@Setter
public class MeetingVO extends AbstractVO {

	private static final long serialVersionUID = 1L;

	private String json;

	private Integer tourneyId;
	private Integer roundId;
	private Integer playoffId;
	private Integer eliminatoryId;
	private Integer playoutId;
	private Integer eliminatoryBId;

	private Country country;

	public MeetingVO() {

	}

	@Override
	public String toString() {

		return super.toString() + " Meeting [json=" + json + ", tourneyId=" + tourneyId + ", roundId=" + roundId
				+ ", playoffId=" + playoffId + ", playoutId=" + playoutId + ", eliminatoryId=" + eliminatoryId
				+ ", eliminatoryBId=" + eliminatoryBId + ", country=" + country + "]";
	}
}
