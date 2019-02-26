
package it.lms.tourney.cdi;

import java.util.List;
import java.util.stream.Collectors;

import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import it.lms.cb.gui.vo.ClientVO;
import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.gui.vo.UserRoleClientVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.dao.ClientDao;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.dao.UserRoleClientDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;

public class Converter extends AbstractLogger {

    @Inject
    RoleDao           roleDao;

    @Inject
    ClientDao         clientDao;

    @Inject
    UserRoleClientDao urcDao;

    @Produces
    public RoleVO convertRolePoVo(Role rpo) {

        RoleVO rvo = new RoleVO();

        rvo.setId(rpo.getId());
        rvo.setDescription(rpo.getDescription());
        rvo.setName(rpo.getName());

        return rvo;
    }

    @Produces
    public ClientVO convertClientPoVo(Client cpo) {

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

    @Produces
    public UserRoleClientVO convertUrcPoVo(UserRoleClient urc) {

        UserRoleClientVO urcvo = new UserRoleClientVO();
        urcvo.setId(urc.getId());

        UserVO userVo = convertUserPoVo(urc.getUser());
        urcvo.setUserVo(userVo);

        RoleVO roleVo = convertRolePoVo(urc.getRole());
        urcvo.setRoleVo(roleVo);

        ClientVO clientVo = convertClientPoVo(urc.getClient());
        urcvo.setClientVo(clientVo);

        return urcvo;
    }

    @Produces
    public UserVO convertUserPoVo(@PersistentObject User u) {

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

        List<Role> roleList = roleDao.findRoleByUser(u);

        List<RoleVO> roleVoList = roleList.stream().map(r -> convertRolePoVo(r)).collect(Collectors.toList());

        uvo.setRoles(roleVoList);

        return uvo;
    }

    @Produces
    public User convertUserVoPo(@ViewObject UserVO uvo) {

        User upo = new User();

        upo.setAddress(uvo.getAddress());
        upo.setCountry(uvo.getCountry());
        upo.setDescription(uvo.getDescription());
        upo.setEmail(uvo.getEmail());
        upo.setId(uvo.getId());
        upo.setLastname(uvo.getLastname());
        upo.setFirstname(uvo.getFirstname());
        upo.setPhoneNumber(uvo.getPhoneNumber());
        upo.setPassword(uvo.getPassword());

        upo.setUsername(uvo.getUsername());

        return upo;
    }

}
