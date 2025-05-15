
package it.lms.tourney.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import it.lms.cb.gui.vo.PlayerVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.PlayerDao;
import it.lms.tourney.dao.SessionDao;
import it.lms.tourney.po.Player;
import it.lms.tourney.po.Session;
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
@Path("/players")
@Stateless
@Slf4j
public class PlayerRESTService extends AbstractRESTService {

	@Inject
	private PlayerDao playerDao;

	@Inject
	private SessionDao sessionDao;

	@Inject
	@ConverterObject
	private Converter converter;

	@GET
	@Path("/loadByClientId/{clientId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<PlayerVO> loadByClientId(@PathParam("clientId") Integer clientId) {

		log.debug(logId() + "GET: loadByClientId(" + clientId + ")");

		List<Player> playerList = playerDao.findPlayersByClientId(clientId);

		return playerList.stream().map(tpo -> converter.convertPlayerPoVo(tpo)).collect(Collectors.toList());
	}

	@GET
	@Path("/loadBySessionId")
	@Produces(MediaType.APPLICATION_JSON)
	public List<PlayerVO> loadBySessionId() {

		log.debug(logId() + "GET: loadBySessionId()");

		String sessionId = super.getSessionId();

		List<Player> playerList = playerDao.findPlayersBySessionId(sessionId);

		return playerList.stream().map(tpo -> converter.convertPlayerPoVo(tpo)).collect(Collectors.toList());
	}

	@GET
	@Path("/load/{id:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public Player loadPlayerById(@PathParam("id") Integer id) {

		log.debug(logId() + "GET: loadPlayerById(" + id + ")");

		Player player = playerDao.getById(id);
		if (player == null) {
			throw new WebApplicationException(Response.Status.NOT_FOUND);
		}
		return player;
	}

	/**
	 * Creates a new player from the values provided. Performs validation, and will return a JAX-RS response with either
	 * 200 ok, or with a map of fields, and related errors.
	 */
	@POST
	@Path("/insert")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createPlayer(PlayerVO tvo) {

		log.debug(logId() + "POST: createPlayer(" + tvo + ")");

		Map<String, String> responseObj = new HashMap<>();
		Player foundPlayer;
		Session spo = null;
		if (tvo.getClientId() == null) {
			String sessionId = request.getSession().getId();
			foundPlayer = playerDao.getPlayerBySessionId(sessionId, tvo.getPlayerName());
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
			Integer clientId = tvo.getClientId();
			foundPlayer = playerDao.getPlayerByClientId(clientId, tvo.getPlayerName());
		}

		if (foundPlayer != null) {
			log.error("Player found");
			responseObj.put("errorCode", "PlayerAlreadyExists");
			responseObj.put("message", "Player " + tvo.getPlayerName() + " already exists");
			Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
			return builder.build();
		}

		Player player = newPlayer(tvo, spo);

		tvo = converter.convertPlayerPoVo(player);

		log.debug("{}", tvo);

		Response.ResponseBuilder builder = Response.ok().entity(tvo);

		return builder.build();
	}

	private Player newPlayer(PlayerVO tvo, Session spo) {

		Player cpo = converter.convertPlayerVoPo(tvo, spo);

		playerDao.insert(cpo);
		return cpo;
	}

	/**
	 * Updates the received player found in the database. Performs validation, and will return a JAX-RS response with
	 * either 200 ok, or with a map of fields, and related errors.
	 */
	@PUT
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updatePlayer(PlayerVO tvo) {

		log.debug(logId() + "PUT: updatePlayer(" + tvo + ")");
		Map<String, String> responseObj = new HashMap<>();

		Player foundPlayer;

		Session spo = null;
		if (tvo.getClientId() == null) {
			String sessionId = request.getSession().getId();
			foundPlayer = playerDao.getPlayerBySessionId(sessionId, tvo.getPlayerName());
			spo = sessionDao.findBySessionId(sessionId);
		} else {
			Integer clientId = tvo.getClientId();
			foundPlayer = playerDao.getPlayerByClientId(clientId, tvo.getPlayerName());
		}

		if (foundPlayer != null && !foundPlayer.getId().equals(tvo.getId())) {

			log.error("Player found");
			responseObj.put("errorCode", "PlayerAlreadyExists");
			responseObj.put("message", "Player " + tvo.getPlayerName() + " already exists");

			Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
			return builder.build();
		}

		Player tpo = converter.convertPlayerVoPo(tvo, spo);

		playerDao.update(tpo);

		Response.ResponseBuilder builder = Response.ok().entity(tvo);

		return builder.build();
	}

	/**
	 * Removes a the received player from the persistent store. Return a JAX-RS response with either 200 ok, or with a
	 * map of fields, and related errors.
	 */
	@DELETE
	@Path("/delete/{id:[0-9][0-9]*}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response deletePlayer(@PathParam("id") Integer id) {

		log.debug(logId() + "DELETE: deletePlayer(" + id + ")");

		Player player = playerDao.getById(id);
		playerDao.delete(player);

		Response.ResponseBuilder builder = Response.ok();

		return builder.build();
	}
}
