
package it.lms.tourney.rest;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.dao.SessionDao;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.po.Login;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/logon")
@Stateless
@Slf4j
public class LoginRESTService extends AbstractRESTService {
	@Inject
	private SessionDao sessionDao;
	@Inject
	private UserDao userDao;
	@Inject
	private RoleDao roleDao;
	
	@Inject
	@ConverterObject
	private Converter converter;

	public LoginRESTService() {

		super();
	}

	/**
	 * Called to perform the system login
	 */
	@PUT
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response doLogin(Login login) {
		log.info(logId() + "PUT: doLogin(" + login + ")");
		Response.ResponseBuilder builder;

		Map<String, String> responseObj = new HashMap<>();

		String username = login.getUsername();
		String md5Pssword = login.getPassword().toUpperCase();

		log.info(logId() + "Entering login() [username=" + username + ", password=" + md5Pssword + "]");

		printAuthentication();

		if (username == null || username.equals("")) {
			String errmsg = logId() + "Username is empty, re-logging";
			log.error(errmsg);
			responseObj = new HashMap<>();
			responseObj.put("error", errmsg);
			builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
		}

		try {
			User u = userDao.findUserBy(username, md5Pssword);
			if (u == null) {
				String message = logId() + "UserDao.findUserBy(" + username + ", " + md5Pssword + ") failed";
				log.error(message);
				responseObj = new HashMap<>();
				responseObj.put("error", "Login failed");
				builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
				return builder.build();
			}

			String sessionId = getSessionId();
			String userAgent = super.getUserAgent();

			Session s = sessionDao.findSessionBy(u);
			if (s == null) {
				String message = logId() + "User Session doesn't exist, create a new one";
				log.error(message);

				sessionDao.insert(u, sessionId, userAgent);
			} else {
				sessionDao.update(s, sessionId, userAgent);
			}

			String message = logId() + "UserDao.findUserBy(" + username + ", " + md5Pssword + ") successful";
			log.debug(message);

			UserVO uvo = prepareResponse(u);

			builder = Response.status(Response.Status.OK).entity(uvo);
		} catch (Exception e) {
			log.error(logId() + "Login failed", e);
			responseObj = new HashMap<>();
			responseObj.put("error", e.getMessage());
			builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
		}

		return builder.build();
	}

	private UserVO prepareResponse(User u) {

		Set<RoleVO> roleSet = new HashSet<>();
		UserVO uvo = converter.convertUserPoVo(u);
		for (UserRoleClient urc : u.getUrcSet()) {
			Role r = urc.getRole();
			RoleVO rvo = converter.convertRolePoVo(r);
			roleSet.add(rvo);
		}

		List<Role> minorRoles = roleDao.findRoleLesserThan(u.getId());

		List<RoleVO> minorRoleList = converter.convertRolePoVoList(minorRoles);

		uvo.setMinorRoles(minorRoleList);
		log.debug(logId() + uvo);
		return uvo;
	}

	/**
	 * Called to perform the system logout
	 */
	@PUT
	@Path("/logout/{loggedUserId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response doLogout(@PathParam("loggedUserId") Integer loggedUserId) {

		log.debug(logId() + "PUT: doLogout(" + loggedUserId + ")");

		try {
			super.invalidateSession();
		} catch (Exception e) {
			log.error(logId() + "Ignore logout Exception:" + e);
		}

		Response.ResponseBuilder builder = Response.ok();
		return builder.build();
	}
	
//	public Map<Integer, List<Meeting>> loadTournamentsData() {
//		List<Round> rounds = loadRounds();
//		Map<Integer, List<Meeting>> meetingMap = new HashMap<>();
//		
//		for( int r=0; r<rounds.size(); r++ ) {
//			Round round = rounds.get(r);
//			for( int d=0; d<round.days; d++ ) {
//				if( !meetingMap.containsKey(d)) {
//					List<Meeting> meetingList = new ArrayList<>();
//					meetingMap.put(d, meetingList);
//				}
//				List<Meeting> meetingList = meetingMap.get(d);
//				for( Meeting m : round.getOnewayMeetings() ) {
//					meetingList.add(m);
//				}
//			}
//		}
//		return meetingMap;
//	}
}
