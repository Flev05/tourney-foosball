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

package it.lms.tourney.dao;

import javax.ejb.Stateless;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.apache.log4j.Logger;

import it.lms.tourney.po.Client;

// The @Stateless annotation eliminates the need for manual transaction demarcation
@Stateless
public class ClientDao {

    @Inject
    private Logger           log;

    @Inject
    private EntityManager    em;

    @Inject
    private Event<Client>    clientEventSrc;

    @Inject
    private ClientRepository cr;

    public void insert(Client client) throws Exception {

        log.debug("Entering insert(" + client.getFirstname() + " " + client.getLastname() + " "
                + client.getBusinessName() + ")");

        em.persist(client);

        clientEventSrc.fire(client);
    }

    public void update(Client client) throws Exception {

        log.debug("Entering save(" + client.getFirstname() + " " + client.getLastname() + " " + client.getBusinessName()
                + ")");

        Client cpo = em.merge(client);
        em.persist(cpo);

        clientEventSrc.fire(client);
    }

    public void delete(Integer id) throws Exception {

        log.debug("Entering delete(" + id + ")");

        Client client = cr.getById(id);

        em.remove(client);

        clientEventSrc.fire(client);
    }
}
