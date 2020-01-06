
package it.lms.tourney.rest;

import java.util.ArrayList;
import java.util.HashMap;
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

        List<UserRoleClient> urcList = urcDao.findUrcByUser(loggedUserId);

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
    public User findUserById(@PathParam("id") Integer id) {

        logger.debug(logId() + "GET: findUserById(" + id + ")");

        return userDao.getUserById(id);
    }

    /**
     * Creates a new user from the values provided. Performs validation, and will return a JAX-RS response with either
     * 200 ok, or with a map of fields, and related errors.
     */
    @POST
    @Path("/insert")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(UserVO uvo) {

        String username = uvo.getUsername();
        logger.debug(logId() + "POST: createUser(" + username + ")");

        User user = userDao.findUserBy(username);
        if (user != null) {
            Map<String, String> responseObj = new HashMap<>();

            responseObj.put("errorCode", "UserAlreadyExists");
            responseObj.put("message", "User " + uvo.getUsername() + " already exists");

            Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
            return builder.build();
        }

        User upo = converter.convertUserVoPo(uvo);

        userDao.insert(upo);

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
        List<UserRoleClient> urcList = upo.getUrcSet().stream().collect(Collectors.toList());

        urcList.stream().forEach(urc -> urcDao.delete(urc));

        userDao.delete(upo);

        Response.ResponseBuilder builder = Response.ok();

        return builder.build();
    }
}
