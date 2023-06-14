
package it.lms.tourney.rest;

import java.util.List;
import java.util.stream.Collectors;

import it.lms.cb.gui.vo.RoleVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.po.Role;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/roles")
@Stateless
@Slf4j
public class RoleRESTService extends AbstractRESTService {

	@Inject
	private RoleDao roleDao;

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
