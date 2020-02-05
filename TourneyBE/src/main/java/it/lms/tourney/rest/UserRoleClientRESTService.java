
package it.lms.tourney.rest;

import java.util.ArrayList;
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

import it.lms.cb.gui.vo.UserRoleClientVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.dao.UserRoleClientDao;
import it.lms.tourney.po.UserRoleClient;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/urc")
@Stateless
@Slf4j
public class UserRoleClientRESTService extends AbstractRESTService {

    @Inject
    private UserDao           userDao;

    @Inject
    private UserRoleClientDao urcDao;

    @Inject
    @ConverterObject
    private Converter         converter;

    @GET
    @Path("/findByUserId/{loggedUserId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserRoleClientVO> findByUserId(@PathParam("loggedUserId") Integer loggedUserId) {

        log.debug(logId() + "GET: UserRoleClientRESTService.findByUserId(" + loggedUserId + ")");

        List<UserRoleClient> urcList = new ArrayList<>();

        if (userDao.isDeveloperUser(loggedUserId)) {
            urcList = urcDao.findAllUrc();
        } else {
            urcList = urcDao.findUrcByUser(loggedUserId);
        }

        List<UserRoleClientVO> userVoList = urcList.stream().map(upo -> converter.convertUrcPoVo(upo))
                .collect(Collectors.toList());

        log.debug(logId() + "URC(s): " + userVoList);

        return userVoList;
    }

    /**
     * Creates a new user from the values provided. Performs validation, and will return a JAX-RS response with either
     * 200 ok, or with a map of fields, and related errors.
     */
    @POST
    @Path("/insert")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUrc(UserRoleClientVO urcvo) {

        log.debug(logId() + "POST: createUrc()");

        UserRoleClient urcpo = converter.convertUrcVoPo(urcvo);
        urcDao.insert(urcpo);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }

    /**
     * Updates the received user found in the database. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(UserRoleClientVO urcvo) {

        log.debug(logId() + "PUT: updateUser()");

        UserRoleClient urcpo = converter.convertUrcVoPo(urcvo);
        urcDao.update(urcpo);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }

    /**
     * Removes a the received client from the persistent store. Return a JAX-RS response with either 200 ok, or with a
     * map of fields, and related errors.
     */
    @DELETE
    @Path("/delete/{id:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUrc(@PathParam("id") Integer id) {

        log.debug(logId() + "DELETE: deleteUrc(" + id + ")");

        UserRoleClient urc = urcDao.findById(id);
        urcDao.delete(urc);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }

}
