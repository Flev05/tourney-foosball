
package it.lms.tourney.rest;

import java.util.List;
import java.util.stream.Collectors;

import it.lms.cb.gui.vo.TeamVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.SessionDao;
import it.lms.tourney.dao.TeamDao;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.Team;
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
@Path("/teams")
@Stateless
@Slf4j
public class TeamRESTService extends AbstractRESTService {
	@Inject
	private TeamDao teamDao;
	@Inject
	private SessionDao sessionDao;

	@Inject
	@ConverterObject
	private Converter converter;

	@GET
	@Path("/loadByClientId/{clientId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TeamVO> loadByClientId(@PathParam("clientId") Integer clientId) {
		log.info("{}", logId() + "GET: loadByClientId(" + clientId + ")");
		List<Team> teamList = teamDao.findTeamsByClientId(clientId);
		return teamList.stream().map(tpo -> converter.convertTeamPoVo(tpo)).collect(Collectors.toList());
	}

	@GET
	@Path("/loadBySessionId")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TeamVO> loadBySessionId() {

		log.debug(logId() + "GET: loadBySessionId()");

		String sessionId = super.getSessionId();

		List<Team> teamList = teamDao.findPlayersBySessionId(sessionId);

		// teamList.forEach(t -> logger.debug(t));

		return teamList.stream().map(tpo -> converter.convertTeamPoVo(tpo)).collect(Collectors.toList());
	}

	@GET
	@Path("/load/{id:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public Team lookupTeamById(@PathParam("id") Integer id) {

		log.debug(logId() + "GET: lookupTeamById(" + id + ")");

		Team team = teamDao.getById(id);
		if (team == null) {
			throw new WebApplicationException(Response.Status.NOT_FOUND);
		}
		return team;
	}

	/**
	 * Creates a new team from the values provided. Performs validation, and will return a JAX-RS response with either
	 * 200 ok, or with a map of fields, and related errors.
	 */
	@POST
	@Path("/insert")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createTeam(TeamVO tvo) {

		log.debug(logId() + "POST: createTeam(" + tvo + ")");

		// Map<String, String> responseObj = new HashMap<>();
		Team foundTeam;
		Session spo = null;
		if (tvo.getClientId() == null) {
			String sessionId = request.getSession().getId();
			foundTeam = teamDao.getTeamSessionId(sessionId, tvo.getTeamName());
			spo = sessionDao.findBySessionId(sessionId);
			String userAgent = super.getUserAgent();
			if (spo == null) {
				String message = logId() + "User Session doesn't exist, create a new one";
				log.error(message);
				spo = sessionDao.insert(null, sessionId, userAgent);
			} else {
				spo = sessionDao.update(spo, sessionId, userAgent);
			}
		} else {
			foundTeam = teamDao.getTeamClientId(tvo.getClientId(), tvo.getTeamName());
		}

		if (foundTeam != null) {
			return updateTeam(tvo);
			// log.error("Team found");
			// responseObj.put("errorCode", "TeamAlreadyExists");
			// responseObj.put("message", "Team " + tvo.getTeamName() + " already exists");
			// Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
			// return builder.build();
		}

		Team team = newTeam(tvo, spo);

		tvo = converter.convertTeamPoVo(team);

		log.debug("{}", tvo);

		Response.ResponseBuilder builder = Response.ok().entity(tvo);

		return builder.build();
	}

	private Team newTeam(TeamVO tvo, Session spo) {

		Team cpo = converter.convertTeamVoPo(tvo, spo);

		teamDao.insert(cpo);
		return cpo;
	}

	/**
	 * Updates the received team found in the database. Performs validation, and will return a JAX-RS response with
	 * either 200 ok, or with a map of fields, and related errors.
	 */
	@PUT
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateTeam(TeamVO tvo) {

		log.debug(logId() + "PUT: updateTeam(" + tvo + ")");

		Team foundTeam;
		Session spo = null;
		if (tvo.getClientId() == null) {
			String sessionId = request.getSession().getId();
			foundTeam = teamDao.getTeamSessionId(sessionId, tvo.getTeamName());
			spo = sessionDao.findBySessionId(sessionId);
		} else {
			foundTeam = teamDao.getTeamClientId(tvo.getClientId(), tvo.getTeamName());
		}

		if (foundTeam != null && !foundTeam.getId().equals(tvo.getId())) {
			tvo.setId(foundTeam.getId());
			// log.error("Team found");
			// responseObj.put("errorCode", "TeamAlreadyExists");
			// responseObj.put("message", "Team " + tvo.getTeamName() + " already exists");
			// Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
			// return builder.build();
		}

		Team tpo = converter.convertTeamVoPo(tvo, spo);

		teamDao.update(tpo);

		Response.ResponseBuilder builder = Response.ok().entity(tvo);

		return builder.build();
	}

	/**
	 * Removes a the received team from the persistent store. Return a JAX-RS response with either 200 ok, or with a map
	 * of fields, and related errors.
	 */
	@DELETE
	@Path("/delete/{id:[0-9][0-9]*}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteTeam(@PathParam("id") Integer id) {

		log.debug(logId() + "DELETE: deleteTeam(" + id + ")");

		Team team = teamDao.getById(id);
		teamDao.delete(team);

		Response.ResponseBuilder builder = Response.ok();

		return builder.build();
	}
}
