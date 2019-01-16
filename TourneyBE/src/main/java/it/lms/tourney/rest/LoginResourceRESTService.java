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

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.codec.binary.Hex;

import it.lms.tourney.dao.SessionDao;
import it.lms.tourney.dao.UserRepository;
import it.lms.tourney.po.Login;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.User;

/**
 * JAX-RS Example
 * <p/>
 * This class produces a RESTful service to read/write the contents of the members table.
 */
@Path("/logon")
@RequestScoped
public class LoginResourceRESTService extends AbstractRESTService {

    // private static final String LOGIN_OK = "Login Succesfull";
    // private static String ALREADY_LOGGED = "already been authenticated";

    @Inject
    private SessionDao     sessionDao;

    // @Inject
    // private UserDao userDao;

    @Inject
    private UserRepository userRepo;

    /**
     * Called to perform the system login
     */
    @PUT
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response doLogin(Login login) {

        logger.debug("PUT: doLogin(" + login + ")");
        Response.ResponseBuilder builder;

        Map<String, String> responseObj = new HashMap<String, String>();

        String username = login.getUsername();
        String password = login.getPassword();

        logger.debug("Entering login() [username=" + username + ", password=" + password + "]");

        printAuthentication();

        if (username == null || username.equals("")) {
            String errmsg = "Username is empty, re-logging";
            logger.debug(errmsg);

            responseObj = new HashMap<String, String>();
            responseObj.put("error", errmsg);
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }

        try {

            String md5Pssword = doMD5(password);

            logger.debug("Calling HttpServletRequest.login(" + username + ", " + md5Pssword + ")...");

            // request.login(username, md5Pssword);

            User u = userRepo.findUserBy(username, md5Pssword);
            if (u == null) {
                String message = "HttpServletRequest.login(" + username + ", " + password + ") failed";
                logger.error(message);
                responseObj = new HashMap<String, String>();
                responseObj.put("error", "Login failed");
                builder = Response.status(Response.Status.NOT_FOUND).entity(responseObj);
                return builder.build();
            }

            String sessionId = getSessionId();
            String userAgent = super.getUserAgent();

            Session s = sessionDao.findSessionBy(u);
            if (s == null) {
                String message = "User Session doesn't exist, create a new one";
                logger.error(message);

                sessionDao.insert(u, sessionId, userAgent);
            } else {
                sessionDao.update(s, sessionId, userAgent);
            }

            String message = "HttpServletRequest.login(" + username + ", " + password + ") successful";
            logger.debug(message);

            builder = Response.ok();

        } catch (Exception e) {

            logger.error("Login failed", e);
            responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }

        return builder.build();
    }

    private String doMD5(String password) throws UnsupportedEncodingException {

        byte[] md5Password = password.getBytes();

        MessageDigest md;
        try {
            md = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            logger.error("Unable to generate MD5 password", e);
            throw new UnsupportedEncodingException(e.getMessage());
        }

        byte[] thedigest = md.digest(md5Password);

        char[] md5Array = Hex.encodeHex(thedigest);
        String md5 = new String(md5Array).toUpperCase();

        logger.debug("MD5=" + md5);
        return md5;
    }

    /**
     * Called to perform the system logout
     */
    @PUT
    @Path("/logout")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response doLogout(Login login) {

        // Create an "ok" response
        Response.ResponseBuilder builder = Response.ok();
        try {
            super.invalidateSession();
        } catch (Exception e) {
            logger.error("Ignore logout Exception:" + e);
        }

        return builder.build();
    }
}
