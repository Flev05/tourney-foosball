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

import it.lms.cb.dao.DaoException;
import it.lms.cb.gui.vo.ClientVO;
import it.lms.tourney.dao.ClientDao;
import it.lms.tourney.dao.RoleDao;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.dao.UserRoleClientDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;

/**
 * JAX-RS Example
 * <p/>
 * This class produces a RESTful service to read/write the contents of the members table.
 */
@Path("/clients")
@RequestScoped
public class ClientRESTService extends AbstractRESTService {

    @Inject
    private ClientDao         clientDao;

    @Inject
    private UserDao           userDao;

    @Inject
    private RoleDao           roleDao;

    @Inject
    private UserRoleClientDao urcDao;

    @GET
    @Path("/findByUserId/{userId:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<ClientVO> findByUserId(@PathParam("userId") Integer userId) {

        logger.debug(logId() + "GET: findByUserId()");

        List<Client> clientList = urcDao.findClientByUserId(userId);

        List<ClientVO> clientVoList = prepareClientVoList(clientList);

        return clientVoList;
    }

    public List<ClientVO> prepareClientVoList(Set<Client> clientSet) {

        List<Client> clientList = new ArrayList<>();
        clientList.addAll(clientSet);

        List<ClientVO> clientVoList = prepareClientVoList(clientList);

        return clientVoList;
    }

    private List<ClientVO> prepareClientVoList(List<Client> clientList) {

        List<ClientVO> clientVoList = new ArrayList<>();

        for (Client c : clientList) {
            ClientVO cvo = new ClientVO();
            clientVoList.add(cvo);

            cvo.setId(c.getId());

            cvo.setAddress(c.getAddress());
            cvo.setBusinessName(c.getBusinessName());
            cvo.setCountry(c.getCountry());
            cvo.setEmail(c.getEmail());
            cvo.setPhoneNumber(c.getPhoneNumber());
            cvo.setSiteUrl(c.getSiteUrl());

            logger.debug(logId() + c);
        }

        return clientVoList;
    }

    @GET
    @Path("/find/{id:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Client lookupClientById(@PathParam("id") Integer id) {

        logger.debug(logId() + "GET: lookupClientById(" + id + ")");

        Client client = clientDao.getById(id);
        if (client == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
        return client;
    }

    /**
     * Creates a new client from the values provided. Performs validation, and will return a JAX-RS response with either
     * 200 ok, or with a map of fields, and related errors.
     */
    @POST
    @Path("/insert")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createClient(ClientVO clientVo) {

        logger.debug(logId() + "POST: createClient(" + clientVo + ")");

        try {
            Map<String, String> responseObj = new HashMap<String, String>();
            Client foundClient = clientDao.getByBusinssName(clientVo.getBusinessName());
            if (foundClient != null) {

                logger.error("Client found");
                responseObj.put("errorCode", "ClientAlreadyExists");
                responseObj.put("message", "Client " + clientVo.getBusinessName() + " already exists");
                responseObj.put("email", foundClient.getEmail());
                responseObj.put("phoneNumber", foundClient.getPhoneNumber());
                responseObj.put("address", foundClient.getAddress());

                Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
                return builder.build();
            }

            if (clientVo.isUserRegistered()) {
                String username = clientVo.getCuvo().getUsername();
                String md5Pssword = clientVo.getCuvo().getPassword().toUpperCase();

                User u = userDao.findUserBy(username, md5Pssword);

                if (u == null) {
                    String message = logId() + "UserDao.findUserBy(" + username + ", " + md5Pssword + ") failed";
                    logger.error(message);
                    responseObj = new HashMap<String, String>();
                    responseObj.put("errorCode", "LoginFailed");

                    Response.ResponseBuilder builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
                    return builder.build();
                }
            } else {

                User user = userDao.getPoBy(clientVo.getCuvo().getUsername());
                if (user != null) {
                    responseObj.put("errorCode", "UserAlreadyExists");
                    responseObj.put("message", "User " + clientVo.getCuvo().getUsername() + " already exist");
                    Response.ResponseBuilder builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
                    return builder.build();
                }
            }

            Client client = newClient(clientVo);

            User user = newUser(clientVo);

            Role role = roleDao.getOwnerRole();

            newUrc(client, user, role);

            Response.ResponseBuilder builder = Response.ok();

            return builder.build();
        } catch (Exception e) {
            logger.error(logId() + "createClient operation failed", e);
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("errorCode", "CreateFailed");
            responseObj.put("message", e.getMessage());
            Response.ResponseBuilder builder = Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(responseObj);
            return builder.build();
        }
    }

    private void newUrc(Client client, User user, Role role) {

        UserRoleClient urc = new UserRoleClient();

        urc.setUser(user);
        user.getUrcSet().add(urc);

        urc.setClient(client);
        client.getUrcSet().add(urc);

        urc.setRole(role);
        // role.getUrcSet().add(urc);

        urcDao.insert(urc);
    }

    private User newUser(ClientVO clientVo) throws DaoException {

        User user = new User();

        user.setUsername(clientVo.getCuvo().getUsername().trim());
        user.setPassword(clientVo.getCuvo().getPassword().trim().toUpperCase());
        user.setAddress(clientVo.getCuvo().getAddress().trim());
        user.setEmail(clientVo.getCuvo().getEmail().trim());
        user.setPhoneNumber(clientVo.getCuvo().getPhoneNumber());
        user.setCountry(clientVo.getCuvo().getCountry());
        user.setFirstname(clientVo.getCuvo().getFirstname().trim());
        user.setLastname(clientVo.getCuvo().getLastname().trim());

        userDao.insert(user);
        return user;
    }

    private Client newClient(ClientVO clientVo) throws Exception {

        Client client = new Client();
        client.setAddress(clientVo.getAddress().trim());
        client.setBusinessName(clientVo.getBusinessName().trim());
        client.setCountry(clientVo.getCountry());
        client.setEmail(clientVo.getEmail().trim());
        client.setPhoneNumber(clientVo.getPhoneNumber().trim());
        client.setSiteUrl(clientVo.getSiteUrl().trim());
        clientDao.insert(client);
        return client;
    }

    /**
     * Updates the received client found in the database. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateClient(ClientVO cvo) {

        logger.debug(logId() + "PUT: updateClient(" + cvo + ")");

        Client cpo = new Client();

        cpo.setId(cvo.getId());
        cpo.setAddress(cvo.getAddress().trim());
        cpo.setBusinessName(cvo.getBusinessName().trim());
        cpo.setCountry(cvo.getCountry());
        cpo.setEmail(cvo.getEmail().trim());
        cpo.setPhoneNumber(cvo.getPhoneNumber().trim());
        cpo.setSiteUrl(cvo.getSiteUrl().trim());

        Response.ResponseBuilder builder = update(cpo);

        return builder.build();
    }

    // private Response.ResponseBuilder insert(Client client) {
    //
    // logger.debug(logId() + "Entering insert()");
    //
    // Response.ResponseBuilder builder;
    // try {
    //
    // clientDao.insert(client);
    // builder = Response.ok();
    // } catch (Exception e) {
    // Map<String, String> responseObj = new HashMap<String, String>();
    // responseObj.put("errorCode", "InsertFailed");
    // responseObj.put("message", e.getMessage());
    // builder = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(responseObj);
    // }
    // return builder;
    // }

    private Response.ResponseBuilder update(Client client) {

        logger.debug(logId() + "Entering update()");

        Response.ResponseBuilder builder;
        try {

            clientDao.update(client);

            builder = Response.ok();
        } catch (Exception e) {
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("errorCode", "UpdateFailed");
            responseObj.put("message", e.getMessage());
            builder = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(responseObj);
        }
        return builder;
    }

    /**
     * Removes a the received client from the persistent store. Return a JAX-RS response with either 200 ok, or with a
     * map of fields, and related errors.
     */
    @DELETE
    @Path("/delete/{id:[0-9][0-9]*}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteClient(@PathParam("id") Integer id) {

        logger.debug(logId() + "DELETE: deleteClient(" + id + ")");

        Response.ResponseBuilder builder;
        try {

            Client client = clientDao.getById(id);
            clientDao.delete(client);

            // Create an "ok" response
            builder = Response.ok();

        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("errorCode", "DeleteFailed");
            responseObj.put("message", e.getMessage());
            builder = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(responseObj);
        }
        return builder.build();
    }
}
