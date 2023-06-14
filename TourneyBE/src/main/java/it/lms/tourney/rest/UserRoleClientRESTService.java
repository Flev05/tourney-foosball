
package it.lms.tourney.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import it.lms.cb.gui.vo.OperatorsVO;
import it.lms.cb.gui.vo.UserRoleClientVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.ClientDao;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.dao.TourneyDao;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.dao.UserRoleClientDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Tourney;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/urc")
@Stateless
@Slf4j
public class UserRoleClientRESTService extends AbstractRESTService {

	@Inject
	private UserDao userDao;

	@Inject
	private TourneyDao tourneyDao;

	@Inject
	private UserRoleClientDao urcDao;

	@Inject
	RoleDao roleDao;

	@Inject
	ClientDao clientDao;

	@Inject
	@ConverterObject
	private Converter converter;

	@GET
	@Path("/findByUserId/{loggedUserId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserRoleClientVO> findByUserId(@PathParam("loggedUserId") Integer loggedUserId) {

		log.debug(logId() + "GET: UserRoleClientRESTService.findByUserId(" + loggedUserId + ")");

		List<UserRoleClient> urcList = new ArrayList<>();

		if (userDao.isDeveloperUser(loggedUserId)) {
			urcList = urcDao.findAllUrc();
			urcList = urcList.stream().filter(urc -> apply(urc)).collect(Collectors.toList());
		} else {
			urcList = urcDao.findUrcByUser(loggedUserId);
		}

		List<UserRoleClientVO> userVoList = urcList.stream().map(upo -> converter.convertUrcPoVo(upo))
				.collect(Collectors.toList());

		log.debug(logId() + "URC(s): " + userVoList);

		return userVoList;
	}

	private boolean apply(UserRoleClient urc) {

		boolean b = !urc.getRole().getName().equals(Role.ROLES.OPERATOR.name())
				&& !urc.getRole().getName().equals(Role.ROLES.FOLLOWER.name());
		return b;
	}

	/**
	 * Creates a new user from the values provided. Performs validation, and will return a JAX-RS response with either
	 * 200 ok, or with a map of fields, and related errors.
	 */
	@POST
	@Path("/insert")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createUrc(UserRoleClientVO urcvo) {

		log.debug(logId() + "POST: createUrc()");

		UserRoleClient urcpo = converter.convertUrcVoPo(urcvo);
		urcDao.insert(urcpo);

		Response.ResponseBuilder builder = Response.ok();

		return builder.build();
	}

	/**
	 * Updates the received user found in the database. Performs validation, and will return a JAX-RS response with
	 * either 200 ok, or with a map of fields, and related errors.
	 */
	@PUT
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUser(UserRoleClientVO urcvo) {

		log.debug(logId() + "PUT: updateUser()");

		UserRoleClient urcpo = converter.convertUrcVoPo(urcvo);
		urcDao.update(urcpo);

		Response.ResponseBuilder builder = Response.ok();

		return builder.build();
	}

	/**
	 * Removes a the received client from the persistent store. Return a JAX-RS response with either 200 ok, or with a
	 * map of fields, and related errors.
	 */
	@DELETE
	@Path("/delete/{id:[0-9][0-9]*}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUrc(@PathParam("id") Integer id) {

		log.debug(logId() + "DELETE: deleteUrc(" + id + ")");

		UserRoleClient urc = urcDao.findById(id);
		urcDao.delete(urc);

		Response.ResponseBuilder builder = Response.ok();

		return builder.build();
	}

	@POST
	@Path("/insertUrcOperator")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response insertUrcOperator(UserRoleClientVO urcvo) {

		log.debug(logId() + "Entering insertAvailableOperator({})", urcvo);

		Integer tourneyId = urcvo.getTourneyId();
		Tourney tpo = tourneyDao.getById(tourneyId);
		if (tpo == null) {
			log.error("Tourney [{}] not found!", tourneyId);
			throw new WebApplicationException(Response.Status.NOT_FOUND);
		}
		Integer clientId = urcvo.getClientVO().getId();
		Client cpo = clientDao.getById(clientId);
		if (cpo == null) {
			log.error("Client [{}] not found!", clientId);
			throw new WebApplicationException(Response.Status.NOT_FOUND);
		}

		UserVO uvo = urcvo.getUserVo();
		String username = uvo.getUsername();
		log.debug(logId() + "POST: createOperator(" + username + "/" + tourneyId + ")");
		UserRoleClient urcpo = urcDao.getOperator(username, cpo.getId(), tourneyId);
		if (urcpo != null) {
			Response.ResponseBuilder builder = Response.ok(urcvo);
			return builder.build();
		}

		User upo = userDao.findUserBy(username);
		if (upo == null) {
			upo = converter.convertUserVoPo(uvo);
			userDao.insert(upo);
		}
		urcpo = new UserRoleClient();
		urcpo.setAvailable(false);
		urcpo.setClient(cpo);
		urcpo.setUser(upo);
		urcpo.setTourney(tpo);
		Role rpo = roleDao.getOperatorRole();
		urcpo.setRole(rpo);
		urcDao.insert(urcpo);

		tpo.getUrcs().add(urcpo);
		upo.getUrcSet().add(urcpo);
		rpo.getUrcSet().add(urcpo);

		Response.ResponseBuilder builder = Response.ok(urcvo);

		return builder.build();
	}

	/**
	 * Creates a new operator from the provided values.
	 */
	@POST
	@Path("/mergeOperators")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response mergeOperators(OperatorsVO urcvo) {

		log.debug(logId() + "POST: mergeOperators(" + urcvo.getClientId() + "/" + urcvo.getTourneyId() + ")");

		Integer tourneyId = urcvo.getTourneyId();
		Tourney tpo = tourneyDao.getById(tourneyId);
		if (tpo == null) {
			log.error("Tourney [{}] not found!", tourneyId);
			throw new WebApplicationException(Response.Status.NOT_FOUND);
		}
		Client cpo = clientDao.getById(urcvo.getClientId());
		if (cpo == null) {
			log.error("Client [{}] not found!", urcvo.getClientId());
			throw new WebApplicationException(Response.Status.NOT_FOUND);
		}

		List<UserRoleClient> urcList = urcDao.findAllOperatorsOf(urcvo.getClientId(), tourneyId);
		for (UserRoleClient urc : urcList) {
			urc.setAvailable(true);
			urcDao.update(urc);
		}
		for (UserVO uvo : urcvo.getSelectedOperators()) {
			UserRoleClient urc = urcDao.getOperator(uvo.getUsername(), urcvo.getClientId(), tourneyId);
			urc.setAvailable(false);
			urcDao.update(urc);
		}

		Response.ResponseBuilder builder = Response.ok().entity(urcvo);

		return builder.build();
	}
}
