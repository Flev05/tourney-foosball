
package it.lms.cb.gui.vo;

import it.lms.tourney.cdi.DaoQualifier;
import it.lms.tourney.po.Country;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * The persistent class for the user database table.
 */
@SuppressWarnings("serial")
@DaoQualifier
@Getter
@Setter
@ToString
public class PlayerVO extends AbstractVO {
	private String json;
	private String playerName;
	private Integer clientId;
	private Country country;
}
