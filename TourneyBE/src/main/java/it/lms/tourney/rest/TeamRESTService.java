
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

import it.lms.cb.gui.vo.TeamVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.SessionDao;
import it.lms.tourney.dao.TeamDao;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.Team;

/**
 * JAX-RS to produces a RESTful service to read/write by DAOs.
 */
@Path("/teams")
@Stateless
public class TeamRESTService extends AbstractRESTService {

    @Inject
    private TeamDao    teamDao;

    @Inject
    private SessionDao sessionDao;

    @Inject
    @ConverterObject
    private Converter  converter;

    @GET
    @Path("/loadByClientId/{clientId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<TeamVO> loadByClientId(@PathParam("clientId") Integer clientId) {

        logger.debug(logId() + "GET: loadByClientId()");

        List<Team> teamList = teamDao.findTeamsByClientId(clientId);

        List<TeamVO> teamVoList = teamList.stream().map(tpo -> converter.convertTeamPoVo(tpo))
                .collect(Collectors.toList());

        return teamVoList;
    }

    @GET
    @Path("/loadBySessionId")
    @Produces(MediaType.APPLICATION_JSON)
    public List<TeamVO> loadBySessionId() {

        logger.debug(logId() + "GET: loadBySessionId()");

        String sessionId = super.getSessionId();

        List<Team> teamList = teamDao.findPlayersBySessionId(sessionId);

        List<TeamVO> teamVoList = teamList.stream().map(tpo -> converter.convertTeamPoVo(tpo))
                .collect(Collectors.toList());

        return teamVoList;
    }

    @GET
    @Path("/load/{id:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Team lookupTeamById(@PathParam("id") Integer id) {

        logger.debug(logId() + "GET: lookupTeamById(" + id + ")");

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

        logger.debug(logId() + "POST: createTeam(" + tvo + ")");

        Map<String, String> responseObj = new HashMap<String, String>();
        Team foundTeam;
        Session spo = null;
        if (tvo.getClientId() == null) {
            String sessionId = request.getSession().getId();
            foundTeam = teamDao.getTeamSessionId(sessionId, tvo.getTeamName());
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
            foundTeam = teamDao.getTeamClientId(tvo.getClientId(), tvo.getTeamName());
        }

        if (foundTeam != null) {

            logger.error("Team found");
            responseObj.put("errorCode", "TeamAlreadyExists");
            responseObj.put("message", "Team " + tvo.getTeamName() + " already exists");

            Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
            return builder.build();
        }

        Team team = newTeam(tvo, spo);

        tvo = converter.convertTeamPoVo(team);

        logger.debug(tvo);

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

        logger.debug(logId() + "PUT: updateTeam(" + tvo + ")");
        Map<String, String> responseObj = new HashMap<String, String>();

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

            logger.error("Team found");
            responseObj.put("errorCode", "TeamAlreadyExists");
            responseObj.put("message", "Team " + tvo.getTeamName() + " already exists");

            Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
            return builder.build();
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

        logger.debug(logId() + "DELETE: deleteTeam(" + id + ")");

        Team team = teamDao.getById(id);
        teamDao.delete(team);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }
}
