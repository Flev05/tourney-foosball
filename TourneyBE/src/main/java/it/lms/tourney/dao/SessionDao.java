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

import it.lms.tourney.po.Session;

@Stateless
public class SessionDao {

    @Inject
    private Logger         log;

    @Inject
    private EntityManager  em;

    @Inject
    private Event<Session> sessionEventSrc;

    public void insert(Session session) throws Exception {

        log.debug("Entering insert(" + session + ")");

        em.persist(session);

        sessionEventSrc.fire(session);
    }

    public void update(Session session) throws Exception {

        log.debug("Entering save(" + session + ")");

        Session cpo = em.merge(session);
        em.persist(cpo);

        sessionEventSrc.fire(session);
    }
}
