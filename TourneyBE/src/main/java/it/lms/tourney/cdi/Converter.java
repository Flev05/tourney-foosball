
package it.lms.tourney.cdi;

import java.util.List;
import java.util.stream.Collectors;

import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import it.lms.cb.gui.vo.ClientVO;
import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.dao.ClientDao;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.User;

public class Converter extends AbstractLogger {

    @Inject
    RoleDao   roleDao;

    @Inject
    ClientDao clientDao;

    @Produces
    public RoleVO convertRolePoVo(Role rpo) {

        RoleVO rvo = new RoleVO();

        rvo.setId(rpo.getId());
        rvo.setDescription(rpo.getDescription());
        rvo.setName(rpo.getName());

        return rvo;
    }

    @Produces
    public Role convertRoleVoPo(RoleVO rvo) {

        Role rpo = new Role();

        rpo.setDescription(rvo.getDescription());
        rpo.setId(rvo.getId());
        rpo.setName(rvo.getName());

        return rpo;
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

        List<Role> roleList = roleDao.findRoleByUser(u);

        List<RoleVO> roleVoList = roleList.stream().map(r -> convertRolePoVo(r)).collect(Collectors.toList());

        uvo.setRoles(roleVoList);

        List<Client> clientList = clientDao.findClientsByUser(u.getId());
        List<Integer> clientIdList = clientList.stream().map(cpo -> cpo.getId()).collect(Collectors.toList());

        uvo.setClientIdList(clientIdList);

        return uvo;
    }

    @Produces
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
        upo.setPassword(uvo.getPassword());

        upo.setUsername(uvo.getUsername());

        return upo;
    }

}
