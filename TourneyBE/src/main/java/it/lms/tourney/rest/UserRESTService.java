
package it.lms.tourney.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
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
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.dao.UserRoleClientDao;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/users")
@Stateless
public class UserRESTService extends AbstractRESTService {

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
    public List<UserVO> findByUserId(@PathParam("loggedUserId") Integer loggedUserId) {

        logger.debug(logId() + "GET: findByUserId(" + loggedUserId + ")");

        List<User> userList;
        if (userDao.isDeveloperUser(loggedUserId)) {
            userList = userDao.findAllUsers();
        } else {
            List<UserRoleClient> urcList = urcDao.findUrcByUser(loggedUserId);
            userList = urcList.stream().map(urc -> urc.getUser()).collect(Collectors.toList());
        }

        List<User> distinctElements = userList.stream().filter(distinctByKey(upo -> upo.getId()))
                .collect(Collectors.toList());

        return distinctElements.stream().map(upo -> converter.convertUserPoVo(upo)).collect(Collectors.toList());
    }

    @GET
    @Path("/findOperatorsByClientId/{clientId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserVO> findOperatorsByClientId(@PathParam("clientId") Integer clientId) {

        logger.debug(logId() + "GET: findOperatorsByClientId(" + clientId + ")");

        List<UserRoleClient> urcList = urcDao.findOperatorsUrcByClientId(clientId);

        List<User> userList = urcList.stream().map(urc -> urc.getUser()).collect(Collectors.toList());

        List<User> distinctElements = userList.stream().filter(distinctByKey(upo -> upo.getId()))
                .collect(Collectors.toList());

        return distinctElements.stream().map(upo -> converter.convertUserPoVo(upo)).collect(Collectors.toList());
    }

    private static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {

        Map<Object, Boolean> map = new ConcurrentHashMap<>();
        return t -> map.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }

    public List<UserVO> prepareUserVoList(Set<User> userSet) {

        List<User> userList = new ArrayList<>();
        userList.addAll(userSet);

        return userList.stream().map(upo -> converter.convertUserPoVo(upo)).collect(Collectors.toList());
    }

    @GET
    @Path("/find/{id:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public UserVO findUserById(@PathParam("id") Integer id) {

        logger.debug(logId() + "GET: findUserById(" + id + ")");

        User upo = userDao.getUserById(id);
        UserVO uvo = converter.convertUserPoVo(upo);
        return uvo;
    }

    @GET
    @Path("/getUserByUsername/{username:[\\w]+}")
    @Produces(MediaType.APPLICATION_JSON)
    public UserVO getUserByUsername(@PathParam("username") String username) {

        logger.debug(logId() + "GET: getUserByUsername(" + username + ")");

        User upo = userDao.getPoBy(username);
        UserVO uvo = converter.convertUserPoVo(upo);
        return uvo;
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

        UserVO uvo = urcvo.getUserVo();
        String username = uvo.getUsername();
        logger.debug(logId() + "POST: createUser(" + username + ")");

        User upo = userDao.findUserBy(username);
        if (upo == null) {
            upo = converter.convertUserVoPo(uvo);
            userDao.insert(upo);
        }

        UserRoleClient urcpo = converter.convertUrcVoPo(urcvo);
        urcpo.setUser(upo);
        urcDao.insert(urcpo);

        Response.ResponseBuilder builder = Response.ok().entity(uvo);

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
    public Response updateUser(UserVO uvo) {

        logger.debug(logId() + "PUT: updateUser()");

        User upo = converter.convertUserVoPo(uvo);
        userDao.update(upo);

        Response.ResponseBuilder builder = Response.ok().entity(uvo);

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
    public Response deleteUser(@PathParam("id") Integer id) {

        logger.debug(logId() + "DELETE: deleteUser(" + id + ")");

        User upo = userDao.getUserById(id);

        List<UserRoleClient> urcList = urcDao.findByUserId(upo.getId());

        // if (!urcList.isEmpty()) {
        // Map<String, String> responseObj = new HashMap<>();
        // responseObj.put("errorCode", "UserUsedByOtheObject");
        // responseObj.put("message",
        // "Unable to remove user [" + upo.getUsername() + "] because it is used by another object");
        // Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
        // return builder.build();
        // }
        // List<UserRoleClient> urcList = upo.getUrcSet().stream().collect(Collectors.toList());

        urcList.stream().forEach(urc -> urcDao.delete(urc));

        userDao.delete(upo);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }

    /**
     * Resets the password inserting a default value passed in the incoming user
     */
    @PUT
    @Path("/resetPassword")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(UserVO uvo) {

        logger.debug(logId() + "PUT: resetPassword()");

        User upo = converter.convertUserVoPo(uvo);
        userDao.update(upo);

        Response.ResponseBuilder builder = Response.ok().entity(uvo);

        return builder.build();
    }

    /**
     * Changes the password of the received user by updating the password passed in the incoming parameter
     */
    @PUT
    @Path("/changePassword")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response changePassword(UserVO uvo) {

        logger.debug(logId() + "PUT: changePassword()");

        User upo = converter.convertUserVoPo(uvo);
        userDao.update(upo);

        Response.ResponseBuilder builder = Response.ok().entity(uvo);

        return builder.build();
    }
}
