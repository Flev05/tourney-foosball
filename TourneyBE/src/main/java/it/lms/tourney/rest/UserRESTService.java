
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

import it.lms.cb.gui.vo.OperatorsVO;
import it.lms.cb.gui.vo.TourneyVO;
import it.lms.cb.gui.vo.UserRoleClientVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.ClientDao;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.dao.TourneyDao;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.dao.UserRoleClientDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Tourney;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/users")
@Stateless
@Slf4j
public class UserRESTService extends AbstractRESTService {

    @Inject
    private UserDao           userDao;

    @Inject
    private UserRoleClientDao urcDao;

    @Inject
    private TourneyDao        tourneyDao;

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
    public List<UserVO> findByUserId(@PathParam("loggedUserId") Integer loggedUserId) {

        log.debug(logId() + "GET: findByUserId(" + loggedUserId + ")");

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

        log.debug(logId() + "GET: findOperatorsByClientId(" + clientId + ")");

        List<UserRoleClient> urcList = urcDao.findOperatorsUrcByClientId(clientId);

        List<User> userList = urcList.stream().map(urc -> urc.getUser()).collect(Collectors.toList());

        List<User> distinctElements = userList.stream().filter(distinctByKey(upo -> upo.getId()))
                .collect(Collectors.toList());

        return distinctElements.stream().map(upo -> converter.convertUserPoVo(upo)).collect(Collectors.toList());
    }

    @GET
    @Path("/loadOperatorsBy/{clientId:[0-9][0-9]*}/{tourneyId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<OperatorsVO> loadOperatorsBy(@PathParam("clientId") Integer clientId,
            @PathParam("tourneyId") Integer tourneyId) {

        log.debug(logId() + "GET: loadOperatorsBy(" + clientId + "/" + tourneyId + ")");

        List<UserRoleClient> urcList = urcDao.findOperatorsUrcBy(clientId, tourneyId);

        Tourney tpo = tourneyDao.getById(tourneyId);

        List<OperatorsVO> ops = new ArrayList<>();
        for (UserRoleClient urc : urcList) {
            OperatorsVO ovo = new OperatorsVO();
            ops.add(ovo);

            UserVO uvo = converter.convertUserPoVo(urc.getUser());
            ovo.getAllOperators().add(uvo);

            if (tpo.getUrcs().contains(urc)) {
                ovo.getSelectedOperators().add(uvo);
            }
        }

        return ops;
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

        log.debug(logId() + "GET: findUserById(" + id + ")");

        User upo = userDao.getUserById(id);
        UserVO uvo = converter.convertUserPoVo(upo);
        return uvo;
    }

    @GET
    @Path("/getUserByUsername/{username:[\\w]+}")
    @Produces(MediaType.APPLICATION_JSON)
    public UserVO getUserByUsername(@PathParam("username") String username) {

        log.debug(logId() + "GET: getUserByUsername(" + username + ")");

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
        log.debug(logId() + "POST: createUser(" + username + ")");

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
     * Creates a new operator from the values provided. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @POST
    @Path("/createOperator/{tourneyId:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createOperator(UserRoleClientVO urcvo, @PathParam("tourneyId") Integer tourneyId) {

        UserVO uvo = urcvo.getUserVo();
        String username = uvo.getUsername();
        log.debug(logId() + "POST: createOperator(" + username + "/" + tourneyId + ")");

        User upo = userDao.findUserBy(username);
        if (upo == null) {
            upo = converter.convertUserVoPo(uvo);
            userDao.insert(upo);
        }

        UserRoleClient urcpo = converter.convertUrcVoPo(urcvo);
        urcpo.setUser(upo);
        urcDao.insert(urcpo);

        Tourney tpo = tourneyDao.getById(tourneyId);
        tpo.getUrcs().add(urcpo);
        tourneyDao.update(tpo);

        Response.ResponseBuilder builder = Response.ok().entity(urcvo);

        return builder.build();
    }

    /**
     * Creates a new operator from the values provided. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @POST
    @Path("/attachOperators")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response attachOperators(OperatorsVO urcvo) {

        Integer tourneyId = urcvo.getTourneyId();
        Tourney tpo = tourneyDao.getById(tourneyId);

        tpo.getUrcs().clear();

        for (UserVO uvo : urcvo.getSelectedOperators()) {
            User upo = userDao.findById(uvo.getId());
            Role rpo = roleDao.getOperatorRole();

            UserRoleClient urc = new UserRoleClient();
            urc.setUser(upo);
            urc.setRole(rpo);
            Client cpo = clientDao.getById(urcvo.getClientId());
            urc.setClient(cpo);

            tpo.getUrcs().add(urc);
        }

        Response.ResponseBuilder builder = Response.ok().entity(urcvo);

        return builder.build();
    }

    /**
     * Finds the URC bounded to the incoming tourneyId, get the corresponding client and user , remove the found URC,
     * verify if there is no more URC for the got client and, if no, remove the got user
     */
    @GET
    @Path("/detachOperator/{userId:[0-9][0-9]*}/{tourneyId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public TourneyVO detachOperator(@PathParam("userId") Integer userId, @PathParam("tourneyId") Integer tourneyId) {

        Tourney tpo = tourneyDao.getById(tourneyId);

        for (UserRoleClient urc : tpo.getUrcs()) {
            User user = urc.getUser();
            if (user.getId().equals(userId)) {
                urcDao.delete(urc);
                List<UserRoleClient> urcList = urcDao.findByUserId(user.getId());
                if (urcList.isEmpty()) {
                    userDao.delete(user);
                }
            }
        }
        tourneyDao.update(tpo);

        TourneyVO tvo = converter.convertTourneyPoVo(tpo);
        return tvo;
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

        log.debug(logId() + "PUT: updateUser()");

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

        log.debug(logId() + "DELETE: deleteUser(" + id + ")");

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

        log.debug(logId() + "PUT: resetPassword()");

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

        log.debug(logId() + "PUT: changePassword()");

        User upo = converter.convertUserVoPo(uvo);
        userDao.update(upo);

        Response.ResponseBuilder builder = Response.ok().entity(uvo);

        return builder.build();
    }
}
