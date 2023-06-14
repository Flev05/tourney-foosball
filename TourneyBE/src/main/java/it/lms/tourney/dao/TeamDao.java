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

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Client_;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.Session_;
import it.lms.tourney.po.Team;
import it.lms.tourney.po.Team_;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;

// The @Stateless annotation eliminates the need for manual transaction demarcation
@Slf4j
public class TeamDao extends BaseJPACrudDao<Team, Integer> {

	public TeamDao() {

		super(Team.class);
	}

	public Team getById(Integer id) {

		return super.findById(id);
	}

	/**
	 * Finds all teams associated to the received logged user id
	 * 
	 * @param clientId
	 *            the team unique identifier
	 * @return the list of teams related to the received client id
	 */
	public List<Team> findTeamsByClientId(Integer clientId) {

		log.debug(logId() + "Entering findTeamsByClientId()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<Team> cq = cb.createQuery(Team.class);
		Root<Team> root = cq.from(Team.class);

		Join<Team, Client> teamClientJoin = root.join(Team_.client);

		Predicate p = cb.equal(teamClientJoin.get(Client_.id), clientId);

		cq = cq.select(root);
		cq = cq.where(p);

		TypedQuery<Team> tq = getEm().createQuery(cq);

		List<Team> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Entities]");

		return resultList;
	}

	/**
	 * Finds all teams associated to the received session id
	 * 
	 * @param clientId
	 *            the team unique identifier
	 * @return the list of teams related to the received session id
	 */
	public List<Team> findPlayersBySessionId(String sessionId) {

		log.debug(logId() + "Entering findPlayersBySessionId()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<Team> cq = cb.createQuery(Team.class);
		Root<Team> root = cq.from(Team.class);

		Join<Team, Session> teamSessionJoin = root.join(Team_.session);

		Predicate p = cb.equal(teamSessionJoin.get(Session_.userSession), sessionId);

		cq = cq.select(root);
		cq = cq.where(p);
		cq = cq.orderBy(cb.asc(root.get(Team_.teamName)));

		TypedQuery<Team> tq = getEm().createQuery(cq);

		List<Team> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Entities]");

		return resultList;
	}

	public Team getTeamClientId(Integer clientId, String teamName) {

		log.debug(logId() + "Entering getTeamClientId(" + teamName + ")");

		CriteriaBuilder cb = getCb();
		CriteriaQuery<Team> criteria = cb.createQuery(Team.class);
		Root<Team> root = criteria.from(Team.class);

		Join<Team, Client> teamClientJoin = root.join(Team_.client);

		Predicate p = cb.equal(root.get(Team_.teamName), teamName);

		Predicate q = cb.equal(teamClientJoin.get(Client_.id), clientId);

		criteria = criteria.select(root);
		criteria = criteria.where(p, q);

		TypedQuery<Team> tq = getEm().createQuery(criteria);

		List<Team> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Entities]");
		if (resultList.isEmpty()) {
			return null;
		}

		return resultList.get(0);
	}

	public Team getTeamSessionId(String userSession, String teamName) {

		log.debug(logId() + "Entering getTeamSessionId(" + userSession + ")");

		CriteriaBuilder cb = getCb();
		CriteriaQuery<Team> criteria = cb.createQuery(Team.class);
		Root<Team> root = criteria.from(Team.class);

		Join<Team, Session> teamSessionJoin = root.join(Team_.session);

		Predicate p = cb.equal(root.get(Team_.teamName), teamName);

		Predicate q = cb.equal(teamSessionJoin.get(Session_.userSession), userSession);

		criteria = criteria.select(root);
		criteria = criteria.where(p, q);

		TypedQuery<Team> tq = getEm().createQuery(criteria);

		List<Team> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Entities]");
		if (resultList.isEmpty()) {
			return null;
		}

		return resultList.get(0);
	}

	public void insert(Team team) {

		log.debug(logId() + "Entering insert(" + team + ")");

		super.insertPo(team);
	}

	public void update(Team team) {

		log.debug(logId() + "Entering update(" + team.getId() + ")");

		super.updatePo(team);
	}

	public void delete(Team team) {

		log.debug(logId() + "Entering delete(" + team.getId() + ")");

		super.deletePo(team);
	}

}
