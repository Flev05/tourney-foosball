
package it.lms.tourney.rest;

import java.util.List;
import java.util.stream.Collectors;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import it.lms.cb.gui.vo.RoleVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.po.Role;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/roles")
@Stateless
@Slf4j
public class RoleRESTService extends AbstractRESTService {

    @Inject
    private RoleDao   roleDao;

    @Inject
    @ConverterObject
    private Converter converter;

    @GET
    @Path("/loadAllRoles/{loggedUserId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<RoleVO> loadAllRoles(@PathParam("loggedUserId") Integer loggedUserId) {

        log.debug(logId() + "GET: loadAllRoles()");

        List<Role> roleList = roleDao.findRolesLesserThan(loggedUserId);

        return roleList.stream().map(rpo -> converter.convertRolePoVo(rpo)).collect(Collectors.toList());
    }
}
