
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
@Path("/meetings")
@Stateless
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

        logger.debug(logId() + "GET: loadByRoundId()");

        List<Meeting> meetingList = meetingDao.findMeetingsByRoundId(tourneyId, roundId);

        List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
                .collect(Collectors.toList());

        return meetingVoList;
    }

    @GET
    @Path("/loadByPlayoffId/{tourneyId:[0-9][0-9]*}/{playoffId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<MeetingVO> loadByPlayoffId(@PathParam("tourneyId") Integer tourneyId,
            @PathParam("playoffId") Integer playoffId) {

        logger.debug(logId() + "GET: loadByPlayoffId()");

        List<Meeting> meetingList = meetingDao.findMeetingsByPlayoffId(tourneyId, playoffId);

        List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
                .collect(Collectors.toList());

        return meetingVoList;
    }

    @GET
    @Path("/loadByEliminatoryId/{tourneyId:[0-9][0-9]*}/{eliminatoryId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<MeetingVO> loadByEliminatoryIdId(@PathParam("tourneyId") Integer tourneyId,
            @PathParam("eliminatoryId") Integer eliminatoryId) {

        logger.debug(logId() + "GET: loadByEliminatoryIdId()");

        List<Meeting> meetingList = meetingDao.findMeetingsByEliminatoryId(tourneyId, eliminatoryId);

        List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
                .collect(Collectors.toList());

        return meetingVoList;
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

        logger.debug(logId() + "POST: createMeeting(" + mvo + ")");

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

        logger.debug(logId() + "PUT: updateMeeting(" + mvo + ")");

        Meeting cpo = converter.convertMeetingVoPo(mvo);

        meetingDao.update(cpo);

        Response.ResponseBuilder builder = Response.ok().entity(mvo);

        return builder.build();
    }

    /**
     * Removes a the received meeting from the persistent store. Return a JAX-RS response with either 200 ok, or with a
     * map of fields, and related errors.
     */
    @DELETE
    @Path("/delete/{id:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteMeeting(@PathParam("id") Integer id) {

        logger.debug(logId() + "DELETE: deleteMeeting(" + id + ")");

        Meeting meeting = meetingDao.getById(id);
        meetingDao.delete(meeting);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }
}
