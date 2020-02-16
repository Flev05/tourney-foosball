
package it.lms.tourney.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
import it.lms.tourney.dao.ClientDao;
import it.lms.tourney.dao.CountryDao;
import it.lms.tourney.dao.MeetingDao;
import it.lms.tourney.dao.SessionDao;
import it.lms.tourney.dao.TourneyDao;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.dao.UserRoleClientDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Country;
import it.lms.tourney.po.Meeting;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.Tourney;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/tourneys")
@Stateless
@Slf4j
public class TourneyRESTService extends AbstractRESTService {

    @Inject
    private MeetingDao        meetingDao;

    @Inject
    private TourneyDao        tourneyDao;

    @Inject
    private SessionDao        sessionDao;

    @Inject
    private UserDao           userDao;

    @Inject
    private UserRoleClientDao urcDao;

    @Inject
    private ClientDao         clientDao;

    @Inject
    private CountryDao        countryDao;

    @Inject
    @ConverterObject
    private Converter         converter;

    @GET
    @Path("/loadByClientUserId/{clientId:[0-9][0-9]*}/{loggedUserId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<TourneyVO> loadByClientUserId(@PathParam("clientId") Integer clientId,
            @PathParam("loggedUserId") Integer loggedUserId) {

        log.debug(logId() + "GET: loadByClientUserId(" + clientId + "/" + loggedUserId + ")");

        List<Tourney> tourneyList;
        if (userDao.isDeveloperUser(loggedUserId) || userDao.isAtLeastAdmin(clientId, loggedUserId)) {
            tourneyList = tourneyDao.findTourneysByClientId(clientId);
        } else {
            tourneyList = tourneyDao.findTourneysLesserThanAdmin(clientId, loggedUserId);
        }

        return tourneyList.stream().map(tpo -> converter.convertLightTourneyPoVo(tpo)).collect(Collectors.toList());
    }

    @GET
    @Path("/loadTourneyById/{tourneyId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public TourneyVO loadTourneyById(@PathParam("tourneyId") Integer tourneyId) {

        log.debug(logId() + "GET: loadTourneyById(" + tourneyId + ")");

        Tourney tpo = tourneyDao.getById(tourneyId);

        TourneyVO tvo = converter.convertTourneyPoVo(tpo);
        if (tvo == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
        return tvo;
    }

    @GET
    @Path("/loadTourneyByFollowerName/{followerName}")
    @Produces(MediaType.APPLICATION_JSON)
    public TourneyVO loadTourneyByFollowerName(@PathParam("followerName") String followerName) {

        log.debug(logId() + "GET: loadTourneyByFollowerName(" + followerName + ")");

        Tourney tpo = tourneyDao.getByFollower(followerName);
        if (tpo == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }

        TourneyVO tvo = converter.convertTourneyPoVo(tpo);
        return tvo;
    }

    @GET
    @Path("/loadBySessionId")
    @Produces(MediaType.APPLICATION_JSON)
    public List<TourneyVO> loadBySessionId() {

        log.debug(logId() + "GET: loadBySessionId()");

        String sessionId = super.getSessionId();
        List<Tourney> tourneyList = tourneyDao.findTourneysBySessionId(sessionId);

        return tourneyList.stream().map(tpo -> converter.convertTourneyPoVo(tpo)).collect(Collectors.toList());
    }

    @GET
    @Path("/load/{id:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Tourney lookupTourneyById(@PathParam("id") Integer id) {

        log.debug(logId() + "GET: lookupTourneyById(" + id + ")");

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

        log.debug(logId() + "POST: createTourney(" + tvo + ")");

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
                log.error(message);

                spo = sessionDao.insert(null, sessionId, userAgent);
            } else {
                spo = sessionDao.update(spo, sessionId, userAgent);
            }

        } else {
            Integer clientId = tvo.getClientVO().getId();
            foundTourney = tourneyDao.getTourneyByClient(clientId, tvo.getTourneyName());
        }

        if (foundTourney != null) {
            log.error("Tourney found");
            responseObj.put("errorCode", "TourneyAlreadyExists");
            responseObj.put("message", "Tourney " + tvo.getTourneyName() + " already exists");

            Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
            return builder.build();
        }

        Tourney tourney = newTourney(tvo, spo);

        TourneyVO newtvo = converter.convertTourneyPoVo(tourney);
        newtvo.setFollowerName(tvo.getFollowerName());

        log.debug("{}", newtvo);

        Response.ResponseBuilder builder = Response.ok().entity(newtvo);

        return builder.build();
    }

    /**
     * Also creates a new default URC relation for the the new incoming tourney
     * 
     * @param tvo the new tourney to create
     * @param spo the session
     * @return the new tourney entity
     */
    private Tourney newTourney(TourneyVO tvo, Session spo) {

        Tourney tpo = prepareNewTourney(tvo, spo);
        if (spo == null) {
            insertFollowerUser(tvo, tpo);
        }
        tourneyDao.insert(tpo);
        return tpo;
    }

    private void insertFollowerUser(TourneyVO tvo, Tourney tpo) {

        String followerUserName = tvo.getFollowerName();
        Integer clientId = tvo.getClientVO().getId();
        User foundUpo = userDao.getFollowerLike(followerUserName, clientId);
        if (foundUpo != null) {
            int lastIndex = followerUserName.lastIndexOf('.');
            if (lastIndex != -1) {
                String digitS = followerUserName.substring(lastIndex + 1);
                int digit = Integer.valueOf(digitS);
                digit++;
                String prefix = followerUserName.substring(0, lastIndex);
                followerUserName = prefix + "." + digit;
            } else {
                followerUserName = followerUserName + "." + 1;
            }
        }

        Client cpo = clientDao.getById(clientId);
        User upo = userDao.newFollowerUser(followerUserName, cpo);
        tvo.setFollowerName(followerUserName);
        userDao.insert(upo);

        UserRoleClient urcFollower = urcDao.newFollowerUrc(upo, cpo);
        urcDao.insert(urcFollower);

        Set<UserRoleClient> urcSet = tpo.getUrcs();
        urcSet.add(urcFollower);

        upo.getUrcSet().add(urcFollower);
    }

    private Tourney prepareNewTourney(TourneyVO tvo, Session spo) {

        Tourney tpo = new Tourney();

        if (spo == null) {
            Client cpo = clientDao.findById(tvo.getClientVO().getId());
            tpo.setClient(cpo);
        } else {
            tpo.setSession(spo);
        }

        if (tvo.getCountry() != null) {
            Country country = countryDao.getById(tvo.getCountry().getId());
            tpo.setCountry(country);
        }

        tpo.setTourneyName(tvo.getTourneyName());
        tpo.setId(tvo.getId());
        tpo.setJson(tvo.getJson());

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

        log.debug(logId() + "PUT: updateTourney(" + tvo + ")");

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

        log.debug(logId() + "PUT: updateTourneyDeleteAllMeetings(" + tvo + ")");

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

        log.debug(logId() + "PUT: updateTourneyRounds(" + tvo + ")");

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

        log.debug(logId() + "PUT: updateTourneyPlayoffs(" + tvo + ")");

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

        log.debug(logId() + "PUT: updateTourneyEliminatories(" + tvo + ")");

        return updateTourney(tvo, EMeetingUpdate.ELIMNATORY);
    }

    private Response updateTourney(TourneyVO tvo, EMeetingUpdate update) {

        log.debug(logId() + "PUT: updateTourney(" + tvo + ")");

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

            log.error("Tourney found");
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

        Tourney tpo = prepareTourneyForUpdate(tvo, spo);

        tourneyDao.update(tpo);

        Response.ResponseBuilder builder = Response.ok().entity(tvo);

        return builder.build();
    }

    private Tourney prepareTourneyForUpdate(TourneyVO tvo, Session spo) {

        Tourney tpo = tourneyDao.findById(tvo.getId());

        if (spo != null) {
            tpo.setSession(spo);
        } else {

            boolean found = false;
            for (UserRoleClient urc : tpo.getUrcs()) {
                Role r = urc.getRole();
                if (r.getName().equals(Role.ROLES.FOLLOWER.name())) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                insertFollowerUser(tvo, tpo);
            } else if (!tpo.getTourneyName().equals(tvo.getTourneyName())) {
                User fupo = userDao.getFollowerByTourneyID(tpo.getId(), tvo.getClientVO().getId());
                if (fupo == null) {
                    insertFollowerUser(tvo, tpo);
                } else {
                    String followerUserName = tvo.getFollowerName();
                    User upo = userDao.getFollowerLike(followerUserName, tvo.getClientVO().getId());
                    if (upo != null) {
                        int lastIndex = followerUserName.lastIndexOf('.');
                        if (lastIndex != -1) {
                            String digitS = followerUserName.substring(lastIndex + 1);
                            int digit = Integer.valueOf(digitS);
                            digit++;
                            String prefix = followerUserName.substring(0, lastIndex);
                            followerUserName = prefix + "." + digit;
                        } else {
                            followerUserName = followerUserName + "." + 1;
                        }
                    }
                    fupo.setUsername(followerUserName);
                    tvo.setFollowerName(followerUserName);
                }
            }
        }

        if (tvo.getCountry() != null) {
            Country country = countryDao.getById(tvo.getCountry().getId());
            tpo.setCountry(country);
        }

        tpo.setTourneyName(tvo.getTourneyName());
        tpo.setJson(tvo.getJson());

        return tpo;
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

        log.debug(logId() + "DELETE: deleteTourney(" + id + ")");

        Tourney tourney = tourneyDao.getById(id);
        tourneyDao.delete(tourney);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }
}
