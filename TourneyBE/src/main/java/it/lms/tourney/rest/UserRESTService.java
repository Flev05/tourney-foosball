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
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

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
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.dao.UserRoleClientDao;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;

/**
 * JAX-RS Example
 * <p/>
 * This class produces a RESTful service to read/write the contents of the members table.
 */
@Path("/users")
@RequestScoped
public class UserRESTService extends AbstractRESTService {

    @Inject
    private UserDao           userDao;

    @Inject
    private UserRoleClientDao urcDao;

    @Inject
    private Converter         converter;

    @GET
    @Path("/findByUserId/{loggedUserId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserVO> findByUserId(@PathParam("loggedUserId") Integer loggedUserId) {

        logger.debug(logId() + "GET: findByUserId(" + loggedUserId + ")");

        List<UserRoleClient> urcList = new ArrayList<>();

        if (userDao.isDeveloperUser(loggedUserId)) {
            urcList = urcDao.findAllUrc();
        }

        urcList = urcDao.findUrcByUser(loggedUserId);

        List<User> userList = urcList.stream().map(urc -> urc.getUser()).collect(Collectors.toList());

        List<User> distinctElements = userList.stream().filter(distinctByKey(upo -> upo.getId()))
                .collect(Collectors.toList());

        List<UserVO> userVoList = distinctElements.stream().map(upo -> converter.convertUserPoVo(upo))
                .collect(Collectors.toList());

        return userVoList;
    }

    private static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {

        Map<Object, Boolean> map = new ConcurrentHashMap<>();
        return t -> map.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }

    public List<UserVO> prepareUserVoList(Set<User> userSet) {

        List<User> userList = new ArrayList<>();
        userList.addAll(userSet);

        List<UserVO> userVoList = userList.stream().map(upo -> converter.convertUserPoVo(upo))
                .collect(Collectors.toList());

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
    public Response createUser(UserVO uvo) {

        logger.debug(logId() + "POST: createUser()");

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
