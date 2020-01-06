
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

import it.lms.cb.gui.vo.MeetingVO;
import it.lms.cb.gui.vo.TourneyVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.MeetingDao;
import it.lms.tourney.dao.SessionDao;
import it.lms.tourney.dao.TourneyDao;
import it.lms.tourney.po.Meeting;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.Tourney;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/tourneys")
@Stateless
public class TourneyRESTService extends AbstractRESTService {

    @Inject
    private MeetingDao meetingDao;

    @Inject
    private TourneyDao tourneyDao;

    @Inject
    private SessionDao sessionDao;

    @Inject
    @ConverterObject
    private Converter  converter;

    @GET
    @Path("/loadByClientId/{clientId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<TourneyVO> loadByClientId(@PathParam("clientId") Integer clientId) {

        logger.debug(logId() + "GET: loadByClientId()");

        List<Tourney> tourneyList = tourneyDao.findTourneysByClientId(clientId);

        return tourneyList.stream().map(tpo -> converter.convertLightTourneyPoVo(tpo)).collect(Collectors.toList());
    }

    @GET
    @Path("/loadTourneyById/{tourneyId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public TourneyVO loadTourneyById(@PathParam("tourneyId") Integer tourneyId) {

        logger.debug(logId() + "GET: loadTourneyById(" + tourneyId + ")");

        Tourney tpo = tourneyDao.getById(tourneyId);

        TourneyVO tvo = converter.convertTourneyPoVo(tpo);
        if (tvo == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
        return tvo;
    }

    @GET
    @Path("/loadBySessionId")
    @Produces(MediaType.APPLICATION_JSON)
    public List<TourneyVO> loadBySessionId() {

        logger.debug(logId() + "GET: loadBySessionId()");

        String sessionId = super.getSessionId();
        List<Tourney> tourneyList = tourneyDao.findTourneysBySessionId(sessionId);

        return tourneyList.stream().map(tpo -> converter.convertTourneyPoVo(tpo)).collect(Collectors.toList());
    }

    @GET
    @Path("/load/{id:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Tourney lookupTourneyById(@PathParam("id") Integer id) {

        logger.debug(logId() + "GET: lookupTourneyById(" + id + ")");

        Tourney tourney = tourneyDao.getById(id);
        if (tourney == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
        return tourney;
    }

    /**
     * Creates a new tourney from the values provided. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @POST
    @Path("/insert")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTourney(TourneyVO tvo) {

        logger.debug(logId() + "POST: createTourney(" + tvo + ")");

        Map<String, String> responseObj = new HashMap<>();

        Session spo = null;
        Tourney foundTourney;
        if (tvo.getClientVO() == null) {
            String sessionId = request.getSession().getId();
            foundTourney = tourneyDao.getTourneyBySession(sessionId, tvo.getTourneyName());
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
            Integer clientId = tvo.getClientVO().getId();
            foundTourney = tourneyDao.getTourneyByClient(clientId, tvo.getTourneyName());
        }

        if (foundTourney != null) {

            logger.error("Tourney found");
            responseObj.put("errorCode", "TourneyAlreadyExists");
            responseObj.put("message", "Tourney " + tvo.getTourneyName() + " already exists");

            Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
            return builder.build();
        }

        Tourney tourney = newTourney(tvo, spo);

        tvo = converter.convertTourneyPoVo(tourney);

        logger.debug(tvo);

        Response.ResponseBuilder builder = Response.ok().entity(tvo);

        return builder.build();
    }

    private Tourney newTourney(TourneyVO tvo, Session spo) {

        Tourney tpo = converter.convertTourneyVoPo(tvo, spo);
        tourneyDao.insert(tpo);
        return tpo;
    }

    /**
     * Updates the received tourney found in the database. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTourney(TourneyVO tvo) {

        logger.debug(logId() + "PUT: updateTourney(" + tvo + ")");

        return updateTourney(tvo, EMeetingUpdate.NONE);
    }

    /**
     * Updates the received tourney after deleting all Round meetings related to the tourney and inserting the list of
     * meetings received in the tourney
     */
    @PUT
    @Path("/updateTourneyDeleteAllMeetings")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTourneyDeleteAllMeetings(TourneyVO tvo) {

        logger.debug(logId() + "PUT: updateTourneyDeleteAllMeetings(" + tvo + ")");

        return updateTourney(tvo, EMeetingUpdate.RESET);
    }

    /**
     * Updates the received tourney after deleting all Round meetings related to the tourney and inserting the list of
     * meetings received in the tourney
     */
    @PUT
    @Path("/updateTourneyRounds")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTourneyRounds(TourneyVO tvo) {

        logger.debug(logId() + "PUT: updateTourneyRounds(" + tvo + ")");

        return updateTourney(tvo, EMeetingUpdate.ROUND);
    }

    /**
     * Updates the received tourney after deleting all playoff meetings related to the tourney and inserting the list of
     * meetings received in the tourney
     */
    @PUT
    @Path("/updateTourneyPlayoffs")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTourneyPlayoffs(TourneyVO tvo) {

        logger.debug(logId() + "PUT: updateTourneyPlayoffs(" + tvo + ")");

        return updateTourney(tvo, EMeetingUpdate.PLAYOFF);
    }

    /**
     * Updates the received tourney found in the database. Performs validation, deletes the meetings related to the
     * Rounds, and will return a JAX-RS response with either 200 ok, or with a map of fields, and related errors.
     */
    @PUT
    @Path("/updateTourneyEliminatories")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTourneyEliminatories(TourneyVO tvo) {

        logger.debug(logId() + "PUT: updateTourneyEliminatories(" + tvo + ")");

        return updateTourney(tvo, EMeetingUpdate.ELIMNATORY);
    }

    private Response updateTourney(TourneyVO tvo, EMeetingUpdate update) {

        logger.debug(logId() + "PUT: updateTourney(" + tvo + ")");

        Map<String, String> responseObj = new HashMap<>();

        Session spo = null;
        Tourney foundTourney;
        if (tvo.getClientVO() == null) {
            String sessionId = request.getSession().getId();
            foundTourney = tourneyDao.getTourneyBySession(sessionId, tvo.getTourneyName());
            spo = sessionDao.findBySessionId(sessionId);
        } else {
            foundTourney = tourneyDao.getTourneyByClient(tvo.getClientVO().getId(), tvo.getTourneyName());
        }

        Integer tourneyId = tvo.getId();
        if (foundTourney != null && !foundTourney.getId().equals(tourneyId)) {

            logger.error("Tourney found");
            responseObj.put("errorCode", "TourneyAlreadyExists");
            responseObj.put("message", "Tourney " + tvo.getTourneyName() + " already exists");

            Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
            return builder.build();
        }

        if (update == EMeetingUpdate.RESET) {
            meetingDao.deleteAllMeetingsByTourneyId(tourneyId);
        }

        if (update == EMeetingUpdate.ROUND) {
            meetingDao.deleteRoundMeetingsByTourneyId(tourneyId);
            insertMeetings(tvo);
        }
        if (update == EMeetingUpdate.PLAYOFF) {
            meetingDao.deletePlayoffMeetingsByTourneyId(tourneyId);
            insertMeetings(tvo);
        }
        if (update == EMeetingUpdate.ELIMNATORY) {
            meetingDao.deleteEliminatoryMeetingsByTourneyId(tourneyId);
            insertMeetings(tvo);
        }

        Tourney tpo = converter.convertTourneyVoPo(tvo, spo);

        tourneyDao.update(tpo);

        Response.ResponseBuilder builder = Response.ok().entity(tvo);

        return builder.build();
    }

    private void insertMeetings(TourneyVO tvo) {

        List<MeetingVO> mdbs = tvo.getMdbs();
        for (MeetingVO mvo : mdbs) {
            Meeting mpo = converter.convertMeetingVoPo(mvo);
            meetingDao.insert(mpo);
            mvo.setId(mpo.getId());
        }
    }

    /**
     * Removes a the received tourney from the persistent store. Return a JAX-RS response with either 200 ok, or with a
     * map of fields, and related errors.
     */
    @DELETE
    @Path("/delete/{id:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteTourney(@PathParam("id") Integer id) {

        logger.debug(logId() + "DELETE: deleteTourney(" + id + ")");

        Tourney tourney = tourneyDao.getById(id);
        tourneyDao.delete(tourney);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }
}
