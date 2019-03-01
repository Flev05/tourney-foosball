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

import java.util.HashMap;
import java.util.Map;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import it.lms.cb.gui.vo.RoleVO;
import it.lms.cb.gui.vo.UserVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.dao.SessionDao;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.po.Login;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;

/**
 * JAX-RS Example
 * <p/>
 * This class produces a RESTful service to read/write the contents of the members table.
 */
@Path("/logon")
@RequestScoped
@Transactional
public class LoginRESTService extends AbstractRESTService {

    @Inject
    private SessionDao sessionDao;

    @Inject
    private UserDao    userDao;

    @Inject
    private Converter  converter;

    public LoginRESTService() {

        super();
    }

    /**
     * Called to perform the system logout
     */
    @PUT
    @Path("/logout/{loggedUserId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response doLogout(@PathParam("loggedUserId") Integer loggedUserId) {

        logger.debug(logId() + "PUT: doLogout(" + loggedUserId + ")");

        try {
            super.invalidateSession();
        } catch (Exception e) {
            logger.error(logId() + "Ignore logout Exception:" + e);
        }

        Response.ResponseBuilder builder = Response.ok();
        return builder.build();
    }

    /**
     * Called to perform the system login
     */
    @PUT
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response doLogin(Login login) {

        logger.debug(logId() + "PUT: doLogin(" + login + ")");
        Response.ResponseBuilder builder;

        Map<String, String> responseObj = new HashMap<String, String>();

        String username = login.getUsername();
        String md5Pssword = login.getPassword().toUpperCase();

        logger.debug(logId() + "Entering login() [username=" + username + ", password=" + md5Pssword + "]");

        printAuthentication();

        if (username == null || username.equals("")) {
            String errmsg = logId() + "Username is empty, re-logging";
            logger.debug(errmsg);

            responseObj = new HashMap<String, String>();
            responseObj.put("error", errmsg);
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }

        try {

            User u = userDao.findUserBy(username, md5Pssword);

            if (u == null) {
                String message = logId() + "UserDao.findUserBy(" + username + ", " + md5Pssword + ") failed";
                logger.error(message);
                responseObj = new HashMap<String, String>();
                responseObj.put("error", "Login failed");
                builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
                return builder.build();
            }

            String sessionId = getSessionId();
            String userAgent = super.getUserAgent();

            Session s = sessionDao.findSessionBy(u);
            if (s == null) {
                String message = logId() + "User Session doesn't exist, create a new one";
                logger.error(message);

                sessionDao.insert(u, sessionId, userAgent);
            } else {
                sessionDao.update(s, sessionId, userAgent);
            }

            String message = logId() + "UserDao.findUserBy(" + username + ", " + md5Pssword + ") successful";
            logger.debug(message);

            UserVO uvo = prepareResponse(u);

            builder = Response.status(Response.Status.OK).entity(uvo);
        } catch (Exception e) {

            logger.error(logId() + "Login failed", e);
            responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }

        return builder.build();
    }

    private UserVO prepareResponse(User u) {

        UserVO uvo = converter.convertUserPoVo(u);
        for (UserRoleClient urc : u.getUrcSet()) {

            Role r = urc.getRole();

            RoleVO rvo = converter.convertRolePoVo(r);
            uvo.getRoles().add(rvo);
        }

        logger.debug(logId() + uvo);

        return uvo;
    }
}
