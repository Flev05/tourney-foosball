
package it.lms.tourney.rest;

import java.util.ArrayList;
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
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import it.lms.cb.gui.vo.UserRoleClientVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.ClientDao;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.dao.UserRoleClientDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/urc")
@Stateless
public class UserRoleClientRESTService extends AbstractRESTService {

    @Inject
    private UserDao           userDao;

    @Inject
    private UserRoleClientDao urcDao;

    @Inject
    private RoleDao           roleDao;

    @Inject
    private ClientDao         clientDao;

    @Inject
    @ConverterObject
    private Converter         converter;

    @GET
    @Path("/findByUserId/{loggedUserId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserRoleClientVO> findByUserId(@PathParam("loggedUserId") Integer loggedUserId) {

        logger.debug(logId() + "GET: UserRoleClientRESTService.findByUserId(" + loggedUserId + ")");

        List<UserRoleClient> urcList = new ArrayList<>();

        if (userDao.isDeveloperUser(loggedUserId)) {
            urcList = urcDao.findAllUrc();
        } else {
            urcList = urcDao.findUrcByUser(loggedUserId);
        }

        List<UserRoleClientVO> userVoList = urcList.stream().map(upo -> converter.convertUrcPoVo(upo))
                .collect(Collectors.toList());

        logger.debug(logId() + "URC(s): " + userVoList);

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
    public Response createUser(UserRoleClientVO urcvo) {

        logger.debug(logId() + "POST: createUser()");

        UserVO uvo = urcvo.getUserVo();
        String username = uvo.getUsername();
        logger.debug(logId() + "POST: createUser(" + username + ")");

        User user = userDao.findUserBy(username);
        if (user != null) {
            Map<String, String> responseObj = new HashMap<String, String>();

            responseObj.put("errorCode", "UserAlreadyExists");
            responseObj.put("message", "User " + uvo.getUsername() + " already exists");

            Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
            return builder.build();
        }

        User upo = converter.convertUserVoPo(uvo);

        userDao.insert(upo);

        createUrc(urcvo, upo);

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

        logger.debug(logId() + "PUT: updateUser()");

        UserVO uvo = deleteOldUrc(urcvo);

        User upo = converter.convertUserVoPo(uvo);
        userDao.update(upo);

        createUrc(urcvo, upo);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }

    private void createUrc(UserRoleClientVO urcvo, User upo) {

        Role rpo = roleDao.findById(urcvo.getRoleVo().getId());

        Client cpo = clientDao.findById(urcvo.getClientVO().getId());

        UserRoleClient urc = new UserRoleClient();
        urc.setUser(upo);
        urc.setRole(rpo);
        urc.setClient(cpo);

        urcDao.save(urc);
    }

    private UserVO deleteOldUrc(UserRoleClientVO urcvo) {

        UserVO uvo = urcvo.getUserVo();
        List<UserRoleClient> urcList = urcDao.findByUserId(uvo.getId());

        urcList.stream().forEach(urc -> urcDao.delete(urc));
        return uvo;
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

        logger.debug(logId() + "DELETE: deleteClient(" + id + ")");

        UserRoleClient urc = urcDao.findById(id);
        urcDao.delete(urc);

        List<UserRoleClient> lastUrc = urcDao.findByUserId(urc.getUser().getId());
        if (lastUrc.isEmpty()) {
            userDao.delete(urc.getUser());
        }

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }

}
