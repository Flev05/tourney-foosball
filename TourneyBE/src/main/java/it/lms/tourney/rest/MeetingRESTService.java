
package it.lms.tourney.rest;

import java.util.List;
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
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import it.lms.cb.gui.vo.MeetingVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.MeetingDao;
import it.lms.tourney.po.Meeting;

/**
 * JAX-RS to produces a RESTful service to read/write by DAOs.
 */
// The @Stateless annotation eliminates the need for manual transaction demarcation
@Stateless
@Path("/meetings")
public class MeetingRESTService extends AbstractRESTService {

    @Inject
    private MeetingDao meetingDao;

    @Inject
    @ConverterObject
    private Converter  converter;

    @GET
    @Path("/loadByRoundId/{tourneyId:[0-9][0-9]*}/{roundId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<MeetingVO> loadByRoundId(@PathParam("tourneyId") Integer tourneyId,
            @PathParam("roundId") Integer roundId) {

        logger.debug(logId() + "[GET: loadByRoundId(" + tourneyId + ", " + roundId + ")]");

        List<Meeting> meetingList = meetingDao.findMeetingsByRoundId(tourneyId, roundId);

        List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
                .collect(Collectors.toList());

        logger.debug(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + ", roundId "
                + roundId + "]");

        return meetingVoList;
    }

    @POST
    @Path("/loadByRoundIds/{tourneyId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<MeetingVO> loadByRoundIds(@PathParam("tourneyId") Integer tourneyId, List<Integer> roundIds) {

        logger.debug(logId() + "[GET: loadByRoundIds(" + tourneyId + ")]");

        List<Meeting> meetingList = meetingDao.findMeetingsByRoundIds(tourneyId, roundIds);

        List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
                .collect(Collectors.toList());

        logger.debug(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + ", roundIds "
                + "]");

        return meetingVoList;
    }

    @GET
    @Path("/loadByPlayoffId/{tourneyId:[0-9][0-9]*}/{playoffId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<MeetingVO> loadByPlayoffId(@PathParam("tourneyId") Integer tourneyId,
            @PathParam("playoffId") Integer playoffId) {

        logger.debug(logId() + "[GET: loadByPlayoffId(" + tourneyId + ", " + playoffId + ")]");

        List<Meeting> meetingList = meetingDao.findMeetingsByPlayoffId(tourneyId, playoffId);

        List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
                .collect(Collectors.toList());

        logger.debug(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId
                + ", playoffId " + playoffId + "]");

        return meetingVoList;
    }

    @POST
    @Path("/loadByPlayoffIds/{tourneyId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<MeetingVO> loadByPlayoffIds(@PathParam("tourneyId") Integer tourneyId, List<Integer> playoffs) {

        logger.debug(logId() + "[GET: loadByPlayoffIds(" + tourneyId + ")]");

        List<Meeting> meetingList = meetingDao.findMeetingsByPlayoffIds(tourneyId, playoffs);

        List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
                .collect(Collectors.toList());

        logger.debug(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId
                + ", playoffId " + "]");

        return meetingVoList;
    }

    @GET
    @Path("/loadByEliminatoryId/{tourneyId:[0-9][0-9]*}/{eliminatoryId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<MeetingVO> loadByEliminatoryIdId(@PathParam("tourneyId") Integer tourneyId,
            @PathParam("eliminatoryId") Integer eliminatoryId) {

        logger.debug(logId() + "[GET: loadByEliminatoryIdId(" + tourneyId + ", " + eliminatoryId + ")]");

        List<Meeting> meetingList = meetingDao.findMeetingsByEliminatoryId(tourneyId, eliminatoryId);

        List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
                .collect(Collectors.toList());

        logger.debug(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId
                + ", eliminatoryId " + eliminatoryId + "]");

        return meetingVoList;
    }

    @GET
    @Path("/loadAllEliminatoryMeetingsBy/{tourneyId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<MeetingVO> loadAllEliminatoryMeetingsBy(@PathParam("tourneyId") Integer tourneyId) {

        logger.debug(logId() + "[GET: loadAllEliminatoryMeetingsBy(" + tourneyId + ")]");

        List<Meeting> meetingList = meetingDao.findAllEliminatoryMeetingsBy(tourneyId);

        List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
                .collect(Collectors.toList());

        logger.debug(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + "]");

        return meetingVoList;
    }

    @POST
    @Path("/loadEliminatoryMeetingByIdList/{tourneyId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response loadEliminatoryMeetingByIdList(@PathParam("tourneyId") Integer tourneyId, List<Integer> idsList) {

        logger.debug(logId() + "[GET: loadEliminatoryMeetingByIdList(" + tourneyId + ")]");

        List<Meeting> meetingList = meetingDao.findAllEliminatoryMeetingsByIdList(tourneyId, idsList);

        List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
                .collect(Collectors.toList());

        logger.debug(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + "]");

        Response.ResponseBuilder builder = Response.ok().entity(meetingVoList);

        return builder.build();
    }

    /**
     * Creates a new meeting from the values provided. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @POST
    @Path("/insert")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createMeeting(MeetingVO mvo) {

        logger.debug(logId() + "[POST: createMeeting(" + mvo + ")]");

        Meeting mpo = converter.convertMeetingVoPo(mvo);

        meetingDao.insert(mpo);

        mvo = converter.convertMeetingPoVo(mpo);

        Response.ResponseBuilder builder = Response.ok().entity(mvo);

        return builder.build();
    }

    /**
     * Updates the received meeting found in the database. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateMeeting(MeetingVO mvo) {

        logger.debug(logId() + "[PUT: updateMeeting(" + mvo + ")]");

        Meeting cpo = converter.convertMeetingVoPo(mvo);

        meetingDao.update(cpo);

        Response.ResponseBuilder builder = Response.ok().entity(mvo);

        return builder.build();
    }

    /**
     * Removes the received meeting from the persistent store. Return a JAX-RS response with either 200 ok, or with a
     * map of fields, and related errors.
     */
    @DELETE
    @Path("/delete/{id:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteMeeting(@PathParam("id") Integer id) {

        logger.debug(logId() + "[DELETE: deleteMeeting(" + id + ")]");

        Meeting meeting = meetingDao.getById(id);
        meetingDao.delete(meeting);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }

    /**
     * Removes the received meeting from the persistent store. Return a JAX-RS response with either 200 ok, or with a
     * map of fields, and related errors.
     */
    @DELETE
    @Path("/deleteRoundMeetingsByTourneyId/{tourneyId:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteRoundMeetingsByTourneyId(@PathParam("tourneyId") Integer tourneyId) {

        logger.debug(logId() + "[DELETE: deleteRoundMeetingsByTourneyId(" + tourneyId + ")]");

        meetingDao.deleteRoundMeetingsByTourneyId(tourneyId);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }

    /**
     * Removes the received meeting from the persistent store. Return a JAX-RS response with either 200 ok, or with a
     * map of fields, and related errors.
     */
    @DELETE
    @Path("/deleteMeetingsByRoundId/{tourneyId:[0-9][0-9]*}/{roundId:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteMeetingsByRoundId(@PathParam("tourneyId") Integer tourneyId,
            @PathParam("roundId") Integer roundId) {

        logger.debug(logId() + "[DELETE: deleteMeetingsByRoundId(" + tourneyId + ", " + roundId + ")]");

        meetingDao.deleteMeetingsByRoundId(tourneyId, roundId);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }

    /**
     * Removes the received meeting from the persistent store. Return a JAX-RS response with either 200 ok, or with a
     * map of fields, and related errors.
     */
    @DELETE
    @Path("/deletePlayoffMeetingsByTourneyId/{tourneyId:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePlayoffMeetingsByTourneyId(@PathParam("tourneyId") Integer tourneyId) {

        logger.debug(logId() + "[DELETE: deletePlayoffMeetingsByTourneyId(" + tourneyId + ")]");

        meetingDao.deletePlayoffMeetingsByTourneyId(tourneyId);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }

    /**
     * Removes the meeting from the persistent store. Return a JAX-RS response with either 200 ok, or with a map of
     * fields, and related errors.
     */
    @DELETE
    @Path("/deleteEliminatoryMeetingsByTourneyId/{tourneyId:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteEliminatoryMeetingsByTourneyId(@PathParam("tourneyId") Integer tourneyId) {

        logger.debug(logId() + "[DELETE: deleteEliminatoryMeetingsByTourneyId(" + tourneyId + ")]");

        meetingDao.deleteEliminatoryMeetingsByTourneyId(tourneyId);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }
}
