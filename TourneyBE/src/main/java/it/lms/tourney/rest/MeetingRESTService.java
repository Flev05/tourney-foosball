
package it.lms.tourney.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import it.lms.cb.gui.vo.MeetingVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.MeetingDao;
import it.lms.tourney.po.Meeting;
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
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Stateless
@Path("/meetings")
@Slf4j
public class MeetingRESTService extends AbstractRESTService {

	@Inject
	private MeetingDao meetingDao;

	@Inject
	@ConverterObject
	private Converter converter;

	@GET
	@Path("/loadByRoundId/{tourneyId:[0-9][0-9]*}/{roundId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<MeetingVO> loadByRoundId(@PathParam("tourneyId") Integer tourneyId,
			@PathParam("roundId") Integer roundId) {

		log.info(logId() + "[GET: loadByRoundId(" + tourneyId + ", " + roundId + ")]");

		List<Meeting> meetingList = meetingDao.findMeetingsByRoundId(tourneyId, roundId);

		List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
				.collect(Collectors.toList());

		log.info(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + ", roundId "
				+ roundId + "]");

		return meetingVoList;
	}

	@POST
	@Path("/loadByRoundIds/{tourneyId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<MeetingVO> loadByRoundIds(@PathParam("tourneyId") Integer tourneyId, List<Integer> roundIds) {

		log.info(logId() + "[GET: loadByRoundIds(" + tourneyId + "/roundIds=" + roundIds	+ ")]");

		List<Meeting> meetingList = meetingDao.findMeetingsByRoundIds(tourneyId, roundIds);

		List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
				.collect(Collectors.toList());

		log.info(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + ", roundIds="
				+ roundIds + "]");

		return meetingVoList;
	}

	@GET
	@Path("/loadByPlayoffId/{tourneyId:[0-9][0-9]*}/{playoffId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<MeetingVO> loadByPlayoffId(@PathParam("tourneyId") Integer tourneyId,
			@PathParam("playoffId") Integer playoffId) {
		log.info(logId() + "[GET: loadByPlayoffId(" + tourneyId + ", " + playoffId + ")]");
		List<Meeting> meetingList = meetingDao.findMeetingsByPlayoffId(tourneyId, playoffId);
		List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
				.collect(Collectors.toList());
		log.info(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + ", playoffId "
				+ playoffId + "]");
		return meetingVoList;
	}

	@GET
	@Path("/loadByPlayoutId/{tourneyId:[0-9][0-9]*}/{playoutId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<MeetingVO> loadByPlayoutId(@PathParam("tourneyId") Integer tourneyId,
			@PathParam("playoutId") Integer playoutId) {
		log.info(logId() + "[GET: loadByPlayoutId(" + tourneyId + ", " + playoutId + ")]");
		List<Meeting> meetingList = meetingDao.findMeetingsByPlayoutId(tourneyId, playoutId);
		List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
				.collect(Collectors.toList());
		log.info(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + ", playoutId "
				+ playoutId + "]");
		return meetingVoList;
	}

	@POST
	@Path("/loadByPlayoffIds/{tourneyId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<MeetingVO> loadByPlayoffIds(@PathParam("tourneyId") Integer tourneyId, List<Integer> playoffs) {
		log.info(logId() + "[GET: loadByPlayoffIds(" + tourneyId + ")]");
		if (playoffs.isEmpty()) {
			return new ArrayList<>();
		}
		List<Meeting> meetingList = meetingDao.findMeetingsByPlayoffIds(tourneyId, playoffs);
		List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
				.collect(Collectors.toList());
		log.info(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + ", playoffId "
				+ "]");
		return meetingVoList;
	}

	@POST
	@Path("/loadByPlayoutIds/{tourneyId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<MeetingVO> loadByPlayoutIds(@PathParam("tourneyId") Integer tourneyId, List<Integer> playouts) {
		log.info(logId() + "[GET: loadByPlayoutIds(" + tourneyId + ")]");
		if (playouts.isEmpty()) {
			return new ArrayList<>();
		}
		List<Meeting> meetingList = meetingDao.findMeetingsByPlayoutIds(tourneyId, playouts);
		List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
				.collect(Collectors.toList());
		log.info(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + ", playoutId "
				+ "]");
		return meetingVoList;
	}

	@GET
	@Path("/loadByEliminatoryId/{tourneyId:[0-9][0-9]*}/{eliminatoryId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<MeetingVO> loadByEliminatoryIdId(@PathParam("tourneyId") Integer tourneyId,
			@PathParam("eliminatoryId") Integer eliminatoryId) {

		log.info(logId() + "[GET: loadByEliminatoryIdId(" + tourneyId + ", " + eliminatoryId + ")]");

		List<Meeting> meetingList = meetingDao.findMeetingsByEliminatoryId(tourneyId, eliminatoryId);

		List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
				.collect(Collectors.toList());

		log.info(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId
				+ ", eliminatoryId " + eliminatoryId + "]");

		return meetingVoList;
	}

	@GET
	@Path("/loadAllEliminatoryMeetingsBy/{tourneyId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<MeetingVO> loadAllEliminatoryMeetingsBy(@PathParam("tourneyId") Integer tourneyId) {

		log.info(logId() + "[GET: loadAllEliminatoryMeetingsBy(" + tourneyId + ")]");

		List<Meeting> meetingList = meetingDao.findAllEliminatoryMeetingsBy(tourneyId);

		List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
				.collect(Collectors.toList());

		log.info(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + "]");

		return meetingVoList;
	}

	@POST
	@Path("/loadEliminatoryMeetingByIdList/{tourneyId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response loadEliminatoryMeetingByIdList(@PathParam("tourneyId") Integer tourneyId, List<Integer> idsList) {

		log.info(logId() + "[GET: loadEliminatoryMeetingByIdList(" + tourneyId + ")]");

		List<Meeting> meetingList = meetingDao.findAllEliminatoryMeetingsByIdList(tourneyId, idsList);

		List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
				.collect(Collectors.toList());

		log.info(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + "]");

		Response.ResponseBuilder builder = Response.ok().entity(meetingVoList);

		return builder.build();
	}

	@POST
	@Path("/loadEliminatoryBMeetingByIdList/{tourneyId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response loadEliminatoryBMeetingByIdList(@PathParam("tourneyId") Integer tourneyId, List<Integer> idsList) {

		log.info(logId() + "[GET: loadEliminatoryBMeetingByIdList(" + tourneyId + ")]");

		List<Meeting> meetingList = meetingDao.findAllEliminatoryBMeetingsByIdList(tourneyId, idsList);

		List<MeetingVO> meetingVoList = meetingList.stream().map(mpo -> converter.convertMeetingPoVo(mpo))
				.collect(Collectors.toList());

		log.info(logId() + "[Found " + meetingVoList.size() + " meetings for tourneyId " + tourneyId + "]");

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

		log.info(logId() + "[POST: createMeeting(" + mvo + ")]");

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

		log.info(logId() + "[PUT: updateMeeting(" + mvo + ")]");

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

		log.info(logId() + "[DELETE: deleteMeeting(" + id + ")]");

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

		log.info(logId() + "[DELETE: deleteRoundMeetingsByTourneyId(" + tourneyId + ")]");

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

		log.info(logId() + "[DELETE: deleteMeetingsByRoundId(" + tourneyId + ", " + roundId + ")]");

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
		log.info(logId() + "[DELETE: deletePlayoffMeetingsByTourneyId(" + tourneyId + ")]");
		meetingDao.deletePlayoffMeetingsByTourneyId(tourneyId);
		Response.ResponseBuilder builder = Response.ok();
		return builder.build();
	}

	@DELETE
	@Path("/deletePlayoutMeetingsByTourneyId/{tourneyId:[0-9][0-9]*}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response deletePlayoutMeetingsByTourneyId(@PathParam("tourneyId") Integer tourneyId) {
		log.info(logId() + "[DELETE: deletePlayoutMeetingsByTourneyId(" + tourneyId + ")]");
		meetingDao.deletePlayoutMeetingsByTourneyId(tourneyId);
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

		log.info(logId() + "[DELETE: deleteEliminatoryMeetingsByTourneyId(" + tourneyId + ")]");

		meetingDao.deleteEliminatoryMeetingsByTourneyId(tourneyId);

		Response.ResponseBuilder builder = Response.ok();

		return builder.build();
	}
}
