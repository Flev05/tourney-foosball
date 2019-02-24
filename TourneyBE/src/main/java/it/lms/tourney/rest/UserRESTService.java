/*
 * JBoss, Home of Professional Open Source
 * Copyright 2015, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package it.lms.tourney.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.enterprise.context.RequestScoped;
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

import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.po.User;

/**
 * JAX-RS Example
 * <p/>
 * This class produces a RESTful service to read/write the contents of the members table.
 */
@Path("/users")
@RequestScoped
public class UserRESTService extends AbstractRESTService {

    @Inject
    private UserDao userDao;

    @GET
    @Path("/findByUserId/{loggedUserId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserVO> findByUserId(@PathParam("loggedUserId") Integer loggedUserId) {

        logger.debug(logId() + "GET: findByUserId()");

        List<User> userList = new ArrayList<>();
        if (userDao.isDeveloperUser(loggedUserId)) {
            userList = userDao.findAllUsers();
        }

        if (userDao.isOwnerUser(loggedUserId)) {
            userList = userDao.findOwnerUsers(loggedUserId);
        }

        if (userDao.isAdminUser(loggedUserId)) {
            userList = userDao.findAdminUsers(loggedUserId);
        }

        List<UserVO> userVoList = prepareUserVoList(userList);

        return userVoList;
    }

    public static List<UserVO> prepareUserVoList(Set<User> userSet) {

        List<User> userList = new ArrayList<>();
        userList.addAll(userSet);

        List<UserVO> userVoList = prepareUserVoList(userList);

        return userVoList;
    }

    private static List<UserVO> prepareUserVoList(List<User> userList) {

        List<UserVO> userVoList = new ArrayList<>();

        for (User c : userList) {
            UserVO cvo = new UserVO();
            userVoList.add(cvo);

            cvo.setId(c.getId());

            cvo.setAddress(c.getAddress());
            cvo.setCountry(c.getCountry());
            cvo.setEmail(c.getEmail());
            cvo.setPhoneNumber(c.getPhoneNumber());
        }

        return userVoList;
    }

    @GET
    @Path("/find/{id:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public User lookupUserById(@PathParam("id") Integer id) {

        logger.debug(logId() + "GET: lookupUserById(" + id + ")");

        User user = userDao.getUserById(id);
        if (user == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
        return user;
    }

    /**
     * Creates a new user from the values provided. Performs validation, and will return a JAX-RS response with either
     * 200 ok, or with a map of fields, and related errors.
     */
    @POST
    @Path("/insert")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(User user) {

        logger.debug(logId() + "POST: createUser(" + user + ")");

        Response.ResponseBuilder builder = insert(user);

        return builder.build();
    }

    @POST
    @Path("/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response postDeleteUser(User user) {

        logger.debug(logId() + "POST: postDeleteUser(" + user + ")");

        Response.ResponseBuilder builder;
        try {
            userDao.delete(user);

            builder = Response.ok();
        } catch (Exception e) {
            logger.error("Remove User failed" + e);
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }

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
    public Response updateUser(User user) {

        logger.debug(logId() + "PUT: updateUser(" + user + ")");

        Response.ResponseBuilder builder = update(user);

        return builder.build();
    }

    /**
     * Removes a the received user from the persistent store. Return a JAX-RS response with either 200 ok, or with a map
     * of fields, and related errors.
     */
    @DELETE
    @Path("/delete/{id:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("id") Integer id) {

        logger.debug(logId() + "DELETE: deleteUser(" + id + ")");

        Response.ResponseBuilder builder;
        try {

            User user = userDao.getUserById(id);
            userDao.delete(user);

            // Create an "ok" response
            builder = Response.ok();

        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }
        return builder.build();
    }

    private Response.ResponseBuilder insert(User user) {

        logger.debug(logId() + "Entering insert()");

        Response.ResponseBuilder builder;
        try {

            userDao.insert(user);

            // Create an "ok" response
            builder = Response.ok();

        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }
        return builder;
    }

    private Response.ResponseBuilder update(User user) {

        logger.debug(logId() + "Entering update()");

        Response.ResponseBuilder builder;
        try {

            userDao.update(user);

            // Create an "ok" response
            builder = Response.ok();

        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }
        return builder;
    }
}
