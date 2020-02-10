
package it.lms.cb.gui.vo;

import java.util.ArrayList;
import java.util.List;

import it.lms.tourney.cdi.DaoQualifier;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@DaoQualifier
@Slf4j
@Getter
@Setter
@ToString
public class OperatorsVO {

    private Integer      tourneyId;
    private Integer      clientId;

    private List<UserVO> allOperators;
    private List<UserVO> selectedOperators;

    public OperatorsVO() {

        log.debug("Entering OperatorVO()");

        allOperators = new ArrayList<>();
        selectedOperators = new ArrayList<>();
    }
}
