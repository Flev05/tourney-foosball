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
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.codec.binary.Hex;
import org.apache.log4j.Logger;

import it.lms.cb.dao.UserDao;
import it.lms.tourney.dao.SessionDao;
import it.lms.tourney.po.Login;
import it.lms.tourney.po.Session;

/**
 * JAX-RS Example
 * <p/>
 * This class produces a RESTful service to read/write the contents of the members table.
 */
@Path("/login")
@RequestScoped
public class LoginResourceRESTService {

    private static final String LOGIN_OK       = "Login Succesfull";
    private static String       ALREADY_LOGGED = "already been authenticated";

    @Inject
    private Logger              logger;

    @Inject
    private SessionDao          sessionDao;

    @Inject
    private UserDao             userDao;

    @Context
    private HttpServletRequest  request;

    /**
     * Updates the received session found in the database. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response doLogin(Login login) {

        logger.debug("PUT: doLogin(" + login + ")");
        Response.ResponseBuilder builder;
        // String res = this.login(login);
        // if (res != null) {
        // builder = Response.ok();
        // return builder.build();
        // }

        Map<String, String> responseObj = new HashMap<String, String>();

        String username = login.getUsername();
        String password = login.getPassword();

        logger.debug("Entering login() [username=" + username + ", password=" + password + "]");

        printAuthentication(request);

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
            doLogin(username, md5Pssword);

            String message = "HttpServletRequest.login(" + username + ", " + password + ") successful";
            logger.debug(message);

            // prepareUserBean();

            builder = Response.ok();
        } catch (Exception e) {

            logger.error("Login failed", e);
            responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }

        return builder.build();
    }

    private void doLogin(String username, String md5Pssword) {

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

    private void printAuthentication(HttpServletRequest request) {

        String host = request.getRemoteHost();
        logger.debug("RemoteHost=" + host);

        String addr = request.getRemoteAddr();
        logger.debug("RemoteAddr=" + addr);

        String path = request.getContextPath();
        logger.debug("ContextPath=" + path);

        String uri = request.getRequestURI();
        logger.debug("URI=" + uri);

        String url = request.getRequestURI();
        logger.debug("URL=" + url);

        String authType = request.getAuthType();
        logger.debug("AuthType=" + authType);

        String remoteUser = request.getRemoteUser();
        logger.debug("RemoteUser=" + remoteUser);

        Principal principal = getPrincipal(request);
        logger.debug("Principal=" + principal);
        if (principal != null) {
            logger.debug("Principal.getName()=" + principal.getName());
        }
    }

    private Principal getPrincipal(HttpServletRequest request) {

        Principal principal = request.getUserPrincipal();
        return principal;
    }

    private Response.ResponseBuilder insert(Session session) {

        logger.debug("Entering insert()");

        Response.ResponseBuilder builder;
        try {

            sessionDao.insert(session);

            // Create an "ok" response
            builder = Response.ok();
        } catch (ConstraintViolationException ce) {
            // Handle bean validation issues
            builder = createViolationResponse(ce.getConstraintViolations());
        } catch (ValidationException e) {
            // Handle the unique constrain violation
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("email", "Email taken");
            builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }
        return builder;
    }

    private Response.ResponseBuilder update(Session session) {

        logger.debug("Entering update()");

        Response.ResponseBuilder builder;
        try {

            sessionDao.update(session);

            // Create an "ok" response
            builder = Response.ok();
        } catch (ConstraintViolationException ce) {
            // Handle bean validation issues
            builder = createViolationResponse(ce.getConstraintViolations());
        } catch (ValidationException e) {
            // Handle the unique constrain violation
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("email", "Email taken");
            builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }
        return builder;
    }

    /**
     * Creates a JAX-RS "Bad Request" response including a map of all violation fields, and their message. This can then
     * be used by countries to show violations.
     *
     * @param violations A set of violations that needs to be reported
     * @return JAX-RS response containing all violations
     */
    private Response.ResponseBuilder createViolationResponse(Set<ConstraintViolation<?>> violations) {

        logger.debug("Validation completed. violations found: " + violations.size());

        Map<String, String> responseObj = new HashMap<String, String>();

        for (ConstraintViolation<?> violation : violations) {
            responseObj.put(violation.getPropertyPath().toString(), violation.getMessage());
        }

        return Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
    }

}
