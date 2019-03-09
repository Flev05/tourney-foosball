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

import java.util.List;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Client_;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.Session_;
import it.lms.tourney.po.Tourney;
import it.lms.tourney.po.Tourney_;

// The @Stateless annotation eliminates the need for manual transaction demarcation
//@Stateless
public class TourneyDao extends BaseJPACrudDao<Tourney, Integer> {

    public TourneyDao() {

        super(Tourney.class);
    }

    /**
     * Finds all Tourneys by received its unique identifier
     * 
     * @param id unique identifier
     * @return the found Tourney
     */
    public Tourney getById(Integer id) {

        return super.findById(id);
    }

    /**
     * Finds all Tourneys associated to the received logged user id
     * 
     * @param loggedUserId the user identifier
     * @return the list of Tourneys related to the logged user id
     */
    public List<Tourney> findTourneysByClientId(Integer clientId) {

        logger.debug(logId() + "Entering findTourneysByClientId()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Tourney> cq = cb.createQuery(Tourney.class);
        Root<Tourney> root = cq.from(Tourney.class);

        Join<Tourney, Client> tourneyClientJoin = root.join(Tourney_.client);

        Predicate p = cb.equal(tourneyClientJoin.get(Client_.id), clientId);

        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<Tourney> tq = getEm().createQuery(cq);

        List<Tourney> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    /**
     * Finds all Tourneys associated to the received logged user id
     * 
     * @param loggedUserId the user identifier
     * @return the list of Tourneys related to the logged user id
     */
    public List<Tourney> findTourneysBySessionId(String sessionId) {

        logger.debug(logId() + "Entering findTourneysBySessionId()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Tourney> cq = cb.createQuery(Tourney.class);
        Root<Tourney> root = cq.from(Tourney.class);

        Join<Tourney, Session> tourneySessionJoin = root.join(Tourney_.session);

        Predicate p = cb.equal(tourneySessionJoin.get(Session_.id), sessionId);

        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<Tourney> tq = getEm().createQuery(cq);

        List<Tourney> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    public Tourney getByTourneyName(Integer clientId, String tourneyName) {

        logger.debug(logId() + "Entering getByTourneyName()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Tourney> cq = cb.createQuery(Tourney.class);
        Root<Tourney> root = cq.from(Tourney.class);

        Join<Tourney, Client> tourneyClientJoin = root.join(Tourney_.client);

        Predicate p = cb.equal(tourneyClientJoin.get(Client_.id), clientId);

        Predicate q = cb.equal(root.get(Tourney_.tourneyName), tourneyName);

        cq = cq.select(root);
        cq = cq.where(p, q);
        cq = cq.orderBy(cb.asc(root.get(Tourney_.tourneyName)));

        TypedQuery<Tourney> tq = getEm().createQuery(cq);

        List<Tourney> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        if (resultList.isEmpty()) {
            return null;
        }

        return resultList.get(0);
    }

    public void insert(Tourney Tourney) {

        logger.debug(logId() + "Entering insert(" + Tourney + ")");

        super.insertPo(Tourney);
    }

    public void update(Tourney Tourney) {

        logger.debug(logId() + "Entering update(" + Tourney + ")");

        super.updatePo(Tourney);
    }

    public void delete(Tourney Tourney) {

        logger.debug(logId() + "Entering delete(" + Tourney + ")");

        super.deletePo(Tourney);
    }

}
