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
import it.lms.tourney.po.Player;
import it.lms.tourney.po.Player_;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.Session_;

// The @Stateless annotation eliminates the need for manual transaction demarcation
public class PlayerDao extends BaseJPACrudDao<Player, Integer> {

    public PlayerDao() {

        super(Player.class);
    }

    public Player getById(Integer id) {

        return super.findById(id);
    }

    /**
     * Finds all players associated to the received logged user id
     * 
     * @param clientId the player unique identifier
     * @return the list of players related to the received client id
     */
    public List<Player> findPlayersByClientId(Integer clientId) {

        logger.debug(logId() + "Entering findPlayersByClientId()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Player> cq = cb.createQuery(Player.class);
        Root<Player> root = cq.from(Player.class);

        Join<Player, Client> playerClientJoin = root.join(Player_.client);

        Predicate p = cb.equal(playerClientJoin.get(Client_.id), clientId);

        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<Player> tq = getEm().createQuery(cq);

        List<Player> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    /**
     * Loads the players bounded to the receives session id
     * 
     * @param sessionId the session the player belongs to
     * @return the list of the players belonging to the session
     */
    public List<Player> findPlayersBySessionId(String sessionId) {

        logger.debug(logId() + "Entering findPlayersBySessionId()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Player> cq = cb.createQuery(Player.class);
        Root<Player> root = cq.from(Player.class);

        Join<Player, Session> playerSessionJoin = root.join(Player_.session);

        Predicate p = cb.equal(playerSessionJoin.get(Session_.userSession), sessionId);

        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<Player> tq = getEm().createQuery(cq);

        List<Player> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    public Player getPlayerByClientId(Integer clientId, String playerName) {

        logger.debug(logId() + "Entering getPlayerByClientId(" + playerName + ")");

        CriteriaBuilder cb = getCb();
        CriteriaQuery<Player> cq = cb.createQuery(Player.class);
        Root<Player> root = cq.from(Player.class);
        Join<Player, Client> playerClientJoin = root.join(Player_.client);

        Predicate p = cb.equal(root.get(Player_.playerName), playerName);
        Predicate q = cb.equal(playerClientJoin.get(Client_.id), clientId);

        cq = cq.select(root);
        cq = cq.where(p, q);
        cq = cq.orderBy(cb.asc(root.get(Player_.playerName)));

        TypedQuery<Player> tq = getEm().createQuery(cq);

        List<Player> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");
        if (resultList.isEmpty()) {
            return null;
        }

        return resultList.get(0);
    }

    public Player getPlayerBySessionId(String userSession, String playerName) {

        logger.debug(logId() + "Entering getPlayerBySessionId(" + userSession + "," + playerName + ")");

        CriteriaBuilder cb = getCb();
        CriteriaQuery<Player> cq = cb.createQuery(Player.class);
        Root<Player> root = cq.from(Player.class);
        Join<Player, Session> playerSessionJoin = root.join(Player_.session);

        Predicate p = cb.equal(root.get(Player_.playerName), playerName);
        Predicate q = cb.equal(playerSessionJoin.get(Session_.userSession), userSession);

        cq = cq.select(root);
        cq = cq.where(p, q);
        cq = cq.orderBy(cb.asc(root.get(Player_.playerName)));

        TypedQuery<Player> tq = getEm().createQuery(cq);

        List<Player> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");
        if (resultList.isEmpty()) {
            return null;
        }

        return resultList.get(0);
    }

    public void insert(Player player) {

        logger.debug(logId() + "Entering insert(" + player + ")");

        super.insertPo(player);
    }

    public void update(Player player) {

        logger.debug(logId() + "Entering update(" + player + ")");

        super.updatePo(player);
    }

    public void delete(Player player) {

        logger.debug(logId() + "Entering delete(" + player + ")");

        super.deletePo(player);
    }

}
