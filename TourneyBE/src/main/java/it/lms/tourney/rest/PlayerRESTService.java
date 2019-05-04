
package it.lms.tourney.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import it.lms.cb.gui.vo.PlayerVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.PlayerDao;
import it.lms.tourney.dao.SessionDao;
import it.lms.tourney.po.Player;
import it.lms.tourney.po.Session;

/**
 * JAX-RS to produces a RESTful service to read/write by DAOs.
 */
@Path("/players")
@Stateless
public class PlayerRESTService extends AbstractRESTService {

    @Inject
    private PlayerDao  playerDao;

    @Inject
    private SessionDao sessionDao;

    @Inject
    @ConverterObject
    private Converter  converter;

    @GET
    @Path("/loadByClientId/{clientId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<PlayerVO> loadByClientId(@PathParam("clientId") Integer clientId) {

        logger.debug(logId() + "GET: loadByClientId(" + clientId + ")");

        List<Player> playerList = playerDao.findPlayersByClientId(clientId);

        return playerList.stream().map(tpo -> converter.convertPlayerPoVo(tpo)).collect(Collectors.toList());
    }

    @GET
    @Path("/loadBySessionId")
    @Produces(MediaType.APPLICATION_JSON)
    public List<PlayerVO> loadBySessionId() {

        logger.debug(logId() + "GET: loadBySessionId()");

        String sessionId = super.getSessionId();

        List<Player> playerList = playerDao.findPlayersBySessionId(sessionId);

        return playerList.stream().map(tpo -> converter.convertPlayerPoVo(tpo)).collect(Collectors.toList());
    }

    @GET
    @Path("/load/{id:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Player loadPlayerById(@PathParam("id") Integer id) {

        logger.debug(logId() + "GET: loadPlayerById(" + id + ")");

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

        logger.debug(logId() + "POST: createPlayer(" + tvo + ")");

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
                logger.error(message);

                spo = sessionDao.insert(null, sessionId, userAgent);
            } else {
                spo = sessionDao.update(spo, sessionId, userAgent);
            }
        } else {
            Integer clientId = tvo.getClientId();
            foundPlayer = playerDao.getPlayerByClientId(clientId, tvo.getPlayerName());
        }

        if (foundPlayer != null) {

            logger.error("Player found");
            responseObj.put("errorCode", "PlayerAlreadyExists");
            responseObj.put("message", "Player " + tvo.getPlayerName() + " already exists");

            Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
            return builder.build();
        }

        Player player = newPlayer(tvo, spo);

        tvo = converter.convertPlayerPoVo(player);

        logger.debug(tvo);

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

        logger.debug(logId() + "PUT: updatePlayer(" + tvo + ")");
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

            logger.error("Player found");
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

        logger.debug(logId() + "DELETE: deletePlayer(" + id + ")");

        Player player = playerDao.getById(id);
        playerDao.delete(player);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }
}
