
package it.lms.cb.gui.vo;

import java.util.List;

import it.lms.tourney.po.Country;
import lombok.Getter;
import lombok.Setter;

/**
 * The persistent class for the user database table.
 */
@Getter
@Setter
public class TourneyVO extends AbstractVO {

	private static final long serialVersionUID = 1L;

	private String tourneyName;
	private String calendar;
	private String followerName;
	private ClientVO clientVO;
	private Country country;
	private String json;
	private List<MeetingVO> mdbs;

	public TourneyVO() {

	}

	@Override
	public String toString() {

		return super.toString() + " TourneyVO [tourneyName=" + tourneyName + ", clientVO=" + clientVO + ", json=" + json
				+ ", country=" + country + "]";
	}
}
