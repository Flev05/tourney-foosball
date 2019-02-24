
package it.lms.tourney.cdi;

import javax.enterprise.inject.Produces;

import it.lms.cb.gui.vo.ClientVO;
import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.User;

public class Converter extends AbstractLogger {

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

    // private CommonUserVO prepareCommonUserVo(User upo) {
    //
    // CommonUserVO uvo = new CommonUserVO();
    //
    // uvo.setId(upo.getId());
    // uvo.setUsername(upo.getUsername());
    // uvo.setPassword(upo.getPassword());
    //
    // uvo.setAddress(upo.getAddress());
    // uvo.setCountry(upo.getCountry());
    // uvo.setDescription(upo.getDescription());
    // uvo.setEmail(upo.getEmail());
    // uvo.setFirstname(upo.getFirstname());
    // uvo.setLastname(upo.getLastname());
    // uvo.setPhoneNumber(upo.getPhoneNumber());
    //
    // return uvo;
    // }

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

        return uvo;
    }
}
