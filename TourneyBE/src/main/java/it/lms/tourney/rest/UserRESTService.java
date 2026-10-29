
package it.lms.tourney.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import it.lms.cb.dao.DaoException;
import it.lms.cb.gui.vo.OperatorsVO;
import it.lms.cb.gui.vo.UserRoleClientVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.ClientDao;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.dao.UserRoleClientDao;
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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/users")
@Stateless
@Slf4j
public class UserRESTService extends AbstractRESTService {

	@Inject
	private UserDao userDao;

	@Inject
	private UserRoleClientDao urcDao;

	@Inject
	ClientDao clientDao;

	@Inject
	RoleDao roleDao;

	@Inject
	@ConverterObject
	private Converter converter;

	@GET
	@Path("/findByUserId/{loggedUserId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<UserVO> findByUserId(@PathParam("loggedUserId") Integer loggedUserId) {

		log.info(logId() + "GET: findByUserId(" + loggedUserId + ")");

		List<User> userList;
		if (userDao.isDeveloperUser(loggedUserId)) {
			userList = userDao.findAllUsersAtLeastOperator();
		} else {
			List<UserRoleClient> urcList = urcDao.findUrcByUser(loggedUserId);
			userList = urcList.stream().map(urc -> urc.getUser()).collect(Collectors.toList());
		}

		List<User> distinctElements = userList.stream().filter(distinctByKey(upo -> upo.getId()))
				.collect(Collectors.toList());

		return distinctElements.stream().map(upo -> converter.convertUserPoVo(upo)).collect(Collectors.toList());
	}

	@GET
	@Path("/loadOperatorsBy/{clientId:[0-9][0-9]*}/{tourneyId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public OperatorsVO loadOperatorsBy(@PathParam("clientId") Integer clientId,
			@PathParam("tourneyId") Integer tourneyId) {

		log.info(logId() + "GET: loadOperatorsBy(" + clientId + "/" + tourneyId + ")");

		OperatorsVO ovo = new OperatorsVO();
		ovo.setClientId(clientId);
		ovo.setTourneyId(tourneyId);

		List<User> opList = urcDao.findDistinctOperators(clientId, tourneyId);
		for (User op : opList) {
			UserVO uvo = converter.convertUserPoVo(op);
			ovo.getAllOperators().add(uvo);
		}

		return ovo;
	}

	private static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {

		Map<Object, Boolean> map = new ConcurrentHashMap<>();
		return t -> map.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
	}

	public List<UserVO> prepareUserVoList(Set<User> userSet) {

		List<User> userList = new ArrayList<>();
		userList.addAll(userSet);

		return userList.stream().map(upo -> converter.convertUserPoVo(upo)).collect(Collectors.toList());
	}

	@GET
	@Path("/find/{id:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public UserVO findUserById(@PathParam("id") Integer id) {

		log.debug(logId() + "GET: findUserById(" + id + ")");

		User upo = userDao.getUserById(id);
		UserVO uvo = converter.convertUserPoVo(upo);
		return uvo;
	}

	@GET
	@Path("/getUserByUsername/{username:[\\w]+}")
	@Produces(MediaType.APPLICATION_JSON)
	public UserVO getUserByUsername(@PathParam("username") String username) {

		log.debug(logId() + "GET: getUserByUsername(" + username + ")");

		User upo = userDao.getPoBy(username);
		if (upo == null) {
			return null;
		}
		UserVO uvo = converter.convertUserPoVo(upo);
		return uvo;
	}

	/**
	 * Creates a new user from the values provided. Performs validation, and will return a JAX-RS response with either
	 * 200 ok, or with a map of fields, and related errors.
	 */
	@POST
	@Path("/insert")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createUser(UserRoleClientVO urcvo) {

		UserVO uvo = urcvo.getUserVo();
		String username = uvo.getUsername();
		log.debug(logId() + "POST: createUser(" + username + ")");

		User upo = userDao.findUserBy(username);
		if (upo == null) {
			upo = converter.convertUserVoPo(uvo);
			userDao.insert(upo);
		}

		UserRoleClient urcpo = converter.convertUrcVoPo(urcvo);
		urcpo.setUser(upo);
		urcDao.insert(urcpo);

		Response.ResponseBuilder builder = Response.ok().entity(uvo);

		return builder.build();
	}

	/**
	 * Finds the URC bounded to the incoming tourneyId, get the corresponding client and user , remove the found URC,
	 * verify if there is no more URC for the got client and, if no, remove the got user
	 */
	@DELETE
	@Path("/deleteOperator")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteOperator(@QueryParam("userId") Integer userId, @QueryParam("clientId") Integer clientId,
			@QueryParam("tourneyId") Integer tourneyId) {

		log.debug(logId() + "deleteOperator(userId={} clientId={} tourneyId={}", userId, clientId, tourneyId);

		try {
			List<UserRoleClient> urcList = urcDao.findUrcBy(userId, clientId, tourneyId);
			UserVO uvo = null;
			for (UserRoleClient urc : urcList) {
				urcDao.delete(urc);
				uvo = converter.convertUserPoVo(urc.getUser());
			}

			Response.ResponseBuilder builder = Response.ok().entity(uvo);

			return builder.build();
		} catch (Exception e) {
			log.error("Unable to delete the user", e);
			throw new WebApplicationException(Response.Status.NOT_FOUND);
		}
	}

	/**
	 * Updates the received user found in the database. Performs validation, and will return a JAX-RS response with
	 * either 200 ok, or with a map of fields, and related errors.
	 */
	@PUT
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUser(UserVO uvo) {

		log.debug(logId() + "PUT: updateUser()");

		User upo = converter.convertUserVoPo(uvo);
		userDao.update(upo);

		Response.ResponseBuilder builder = Response.ok().entity(uvo);

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
	public Response deleteUser(@PathParam("id") Integer id) {

		log.debug(logId() + "DELETE: deleteUser(" + id + ")");

		try {
			User upo = userDao.getUserById(id);

			List<UserRoleClient> urcList = urcDao.findByUserId(upo.getId());

			urcList.stream().forEach(urc -> urcDao.delete(urc));

			userDao.delete(upo);
			Response.ResponseBuilder builder = Response.ok();
			return builder.build();
		} catch (DaoException e) {
			log.error("Unable do delete the user", e);
		}
		Response.ResponseBuilder builder = Response.ok();
		return builder.build();
	}

	/**
	 * Resets the password inserting a default value passed in the incoming user
	 */
	@PUT
	@Path("/resetPassword")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response resetPassword(UserVO uvo) {

		log.debug(logId() + "PUT: resetPassword()");

		User upo = converter.convertUserVoPo(uvo);
		userDao.update(upo);

		Response.ResponseBuilder builder = Response.ok().entity(uvo);

		return builder.build();
	}

	/**
	 * Changes the password of the received user by updating the password passed in the incoming parameter
	 */
	@PUT
	@Path("/changePassword")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response changePassword(UserVO uvo) {

		log.debug(logId() + "PUT: changePassword()");

		User upo = converter.convertUserVoPo(uvo);
		userDao.update(upo);

		Response.ResponseBuilder builder = Response.ok().entity(uvo);

		return builder.build();
	}
}
