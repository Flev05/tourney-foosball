
package it.lms.tourney.cdi;

import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;

import it.lms.cb.gui.vo.ClientVO;
import it.lms.cb.gui.vo.MeetingVO;
import it.lms.cb.gui.vo.PlayerVO;
import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.gui.vo.TeamVO;
import it.lms.cb.gui.vo.TourneyVO;
import it.lms.cb.gui.vo.UserRoleClientVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.dao.ClientDao;
import it.lms.tourney.dao.CountryDao;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.dao.TourneyDao;
import it.lms.tourney.dao.UserRoleClientDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Country;
import it.lms.tourney.po.Meeting;
import it.lms.tourney.po.Player;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.Team;
import it.lms.tourney.po.Tourney;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;

@ConverterObject
public class Converter extends AbstractLogger {

    @Inject
    RoleDao           roleDao;

    @Inject
    ClientDao         clientDao;

    @Inject
    TourneyDao        tourneyDao;

    @Inject
    UserRoleClientDao urcDao;

    @Inject
    CountryDao        countryDao;

    public RoleVO convertRolePoVo(Role rpo) {

        RoleVO rvo = new RoleVO();

        rvo.setId(rpo.getId());
        rvo.setDescription(rpo.getDescription());
        rvo.setName(rpo.getName());

        return rvo;
    }

    public ClientVO convertClientPoVo(Client cpo) {

        if (cpo == null) {
            return null;
        }

        ClientVO cvo = new ClientVO();

        cvo.setId(cpo.getId());

        cvo.setAddress(cpo.getAddress());
        cvo.setBusinessName(cpo.getBusinessName());
        cvo.setCountry(cpo.getCountry());
        cvo.setEmail(cpo.getEmail());
        cvo.setPhoneNumber(cpo.getPhoneNumber());
        cvo.setSiteUrl(cpo.getSiteUrl());

        return cvo;
    }

    public UserRoleClientVO convertUrcPoVo(UserRoleClient urc) {

        UserRoleClientVO urcvo = new UserRoleClientVO();
        urcvo.setId(urc.getId());

        UserVO userVo = convertUserPoVo(urc.getUser());
        urcvo.setUserVo(userVo);

        RoleVO roleVo = convertRolePoVo(urc.getRole());
        urcvo.setRoleVo(roleVo);

        ClientVO clientVo = convertClientPoVo(urc.getClient());
        urcvo.setClientVO(clientVo);

        return urcvo;
    }

    public UserVO convertUserPoVo(User u) {

        UserVO uvo = new UserVO();
        uvo.setId(u.getId());
        uvo.setAddress(u.getAddress());
        uvo.setCountry(u.getCountry());
        uvo.setEmail(u.getEmail());
        uvo.setFirstname(u.getFirstname());
        uvo.setLastname(u.getLastname());
        uvo.setPassword(u.getPassword());
        uvo.setPhoneNumber(u.getPhoneNumber());
        uvo.setUsername(u.getUsername());
        uvo.setDescription(u.getDescription());

        List<Role> roleList = roleDao.findRoleByUser(u);

        List<RoleVO> roleVoList = roleList.stream().map(r -> convertRolePoVo(r)).collect(Collectors.toList());

        uvo.setRoles(roleVoList);

        return uvo;
    }

    public User convertUserVoPo(UserVO uvo) {

        User upo = new User();

        upo.setAddress(uvo.getAddress());
        upo.setCountry(uvo.getCountry());
        upo.setDescription(uvo.getDescription());
        upo.setEmail(uvo.getEmail());
        upo.setId(uvo.getId());
        upo.setLastname(uvo.getLastname());
        upo.setFirstname(uvo.getFirstname());
        upo.setPhoneNumber(uvo.getPhoneNumber());
        upo.setDescription(upo.getDescription());

        String password = uvo.getPassword() != null ? uvo.getPassword().trim().toUpperCase() : "";
        upo.setPassword(password);

        upo.setUsername(uvo.getUsername());

        return upo;
    }

    public TourneyVO convertTourneyPoVo(Tourney tpo) {

        TourneyVO tvo = new TourneyVO();

        ClientVO cvo = convertClientPoVo(tpo.getClient());

        tvo.setClientVO(cvo);
        tvo.setId(tpo.getId());
        tvo.setJson(tpo.getJson());
        tvo.setTourneyName(tpo.getTourneyName());
        tvo.setCountry(tpo.getCountry());

        return tvo;
    }

    public Tourney convertTourneyVoPo(TourneyVO tvo, Session spo) {

        Tourney tpo = new Tourney();

        if (spo == null) {
            Client cpo = clientDao.findById(tvo.getClientVO().getId());
            tpo.setClient(cpo);
        } else {
            tpo.setSession(spo);
        }

        if (tvo.getCountry() != null) {
            Country country = countryDao.getById(tvo.getCountry().getId());
            tpo.setCountry(country);
        }

        tpo.setTourneyName(tvo.getTourneyName());
        tpo.setId(tvo.getId());
        tpo.setJson(tvo.getJson());

        return tpo;
    }

    public PlayerVO convertPlayerPoVo(Player ppo) {

        PlayerVO pvo = new PlayerVO();

        ClientVO cvo = convertClientPoVo(ppo.getClient());
        pvo.setClientVO(cvo);

        if (ppo.getCountry() != null) {
            Country country = countryDao.getById(ppo.getCountry().getId());
            pvo.setCountry(country);
        }

        pvo.setId(ppo.getId());
        pvo.setJson(ppo.getJson());
        pvo.setPlayerName(ppo.getPlayerName());

        return pvo;
    }

    public TeamVO convertTeamPoVo(Team tpo) {

        TeamVO tvo = new TeamVO();

        ClientVO cvo = convertClientPoVo(tpo.getClient());
        tvo.setClientVO(cvo);

        if (tpo.getCountry() != null) {
            Country country = countryDao.getById(tpo.getCountry().getId());
            tvo.setCountry(country);
        }

        tvo.setId(tpo.getId());
        tvo.setJson(tpo.getJson());
        tvo.setTeamName(tpo.getTeamName());

        return tvo;
    }

    public Player convertPlayerVoPo(PlayerVO pvo, Session spo) {

        Player ppo = new Player();

        if (spo == null) {
            Client cpo = clientDao.findById(pvo.getClientVO().getId());
            ppo.setClient(cpo);
        } else {
            ppo.setSession(spo);
        }

        if (pvo.getCountry() != null) {
            Country country = countryDao.findById(pvo.getCountry().getId());
            ppo.setCountry(country);
        }

        ppo.setId(pvo.getId());
        ppo.setJson(pvo.getJson());
        ppo.setPlayerName(pvo.getPlayerName());

        return ppo;
    }

    public Team convertTeamVoPo(TeamVO tvo, Session spo) {

        Team tpo = new Team();

        if (spo == null) {
            Client cpo = clientDao.findById(tvo.getClientVO().getId());
            tpo.setClient(cpo);
        } else {
            tpo.setSession(spo);
        }

        if (tvo.getCountry() != null) {
            Country country = countryDao.findById(tvo.getCountry().getId());
            tpo.setCountry(country);
        }

        tpo.setId(tvo.getId());
        tpo.setTeamName(tvo.getTeamName());
        tpo.setJson(tvo.getJson());

        return tpo;
    }

    public MeetingVO convertMeetingPoVo(Meeting mpo) {

        MeetingVO mvo = new MeetingVO();

        mvo.setEliminatoryId(mpo.getEliminatoryId());
        mvo.setId(mpo.getId());
        mvo.setJson(mpo.getJson());
        mvo.setPlayoffId(mpo.getPlayoffId());
        mvo.setRoundId(mpo.getRoundId());
        mvo.setTourneyId(mpo.getTourney().getId());

        return mvo;
    }

    public Meeting convertMeetingVoPo(MeetingVO mvo) {

        Meeting mpo = new Meeting();

        mpo.setEliminatoryId(mvo.getEliminatoryId());
        mpo.setId(mvo.getId());
        mpo.setJson(mvo.getJson());
        mpo.setPlayoffId(mvo.getPlayoffId());
        mpo.setRoundId(mvo.getRoundId());

        Tourney tpo = tourneyDao.findById(mvo.getTourneyId());

        mpo.setTourney(tpo);

        return mpo;
    }

}
