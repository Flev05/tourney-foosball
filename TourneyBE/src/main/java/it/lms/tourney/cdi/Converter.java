
package it.lms.tourney.cdi;

import it.lms.cb.gui.vo.ClientVO;
import it.lms.cb.gui.vo.PlayerVO;
import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.gui.vo.TeamVO;
import it.lms.cb.gui.vo.TourneyVO;
import it.lms.cb.gui.vo.UserRoleClientVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Player;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Team;
import it.lms.tourney.po.Tourney;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;

@ConverterObject
public interface Converter {

    public RoleVO convertRolePoVo(Role rpo);

    public ClientVO convertClientPoVo(Client cpo);

    public UserRoleClientVO convertUrcPoVo(UserRoleClient urc);

    public UserVO convertUserPoVo(User u);

    public User convertUserVoPo(UserVO uvo);

    public TourneyVO convertTourneyPoVo(Tourney tpo);

    public Tourney convertTourneyVoPo(TourneyVO tvo);

    public PlayerVO convertPlayerPoVo(Player ppo);

    public TeamVO convertTeamPoVo(Team tpo);

    public Player convertPlayerVoPo(PlayerVO pvo);

    public Team convertTeamVoPo(TeamVO tvo);
}
