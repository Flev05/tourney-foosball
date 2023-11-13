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
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Role_;
import it.lms.tourney.po.Session;
import it.lms.tourney.po.Session_;
import it.lms.tourney.po.Tourney;
import it.lms.tourney.po.Tourney_;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import it.lms.tourney.po.UserRoleClient_;
import it.lms.tourney.po.User_;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;

// The @Stateless annotation eliminates the need for manual transaction demarcation
@Slf4j
public class TourneyDao extends BaseJPACrudDao<Tourney, Integer> {

	public TourneyDao() {

		super(Tourney.class);
	}

	/**
	 * Finds all Tourneys by received its unique identifier
	 * 
	 * @param id
	 *            unique identifier
	 * @return the found Tourney
	 */
	public Tourney getById(Integer id) {

		return super.findById(id);
	}

	/**
	 * Finds all Tourneys associated to the received logged user id
	 * 
	 * @param loggedUserId
	 *            the user identifier
	 * @return the list of Tourneys related to the logged user id
	 */
	public List<Tourney> findTourneysByClientId(Integer clientId) {

		log.debug(logId() + "Entering findTourneysByClientId()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<Tourney> cq = cb.createQuery(Tourney.class);
		Root<Tourney> root = cq.from(Tourney.class);

		Join<Tourney, Client> tourneyClientJoin = root.join(Tourney_.client);

		Predicate p = cb.equal(tourneyClientJoin.get(Client_.id), clientId);

		cq = cq.select(root);
		cq = cq.where(p);
		cq = cq.orderBy(cb.desc(root.get(Tourney_.id)));

		TypedQuery<Tourney> tq = getEm().createQuery(cq);

		List<Tourney> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Tourneys]");

		return resultList;
	}

	/**
	 * Finds all Tourneys associated to the received client id and logged user id having Operator and Follower roles
	 * 
	 * @param clientId
	 *            the client identifier
	 * @param loggedUserId
	 *            the user identifier
	 * @return the list of Tourneys related to the logged user id
	 */
	public List<Tourney> findTourneysLesserThanAdmin(Integer clientId, Integer loggedUserId) {

		log.debug(logId() + "Entering findTourneysLesserThanAdmin()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<Tourney> cq = cb.createQuery(Tourney.class);
		Root<User> root = cq.from(User.class);

		Join<User, UserRoleClient> urcJoin = root.join(User_.urcSet);
		Join<UserRoleClient, Tourney> tourneyJoin = urcJoin.join(UserRoleClient_.tourney);
		Join<UserRoleClient, Client> clientJoin = urcJoin.join(UserRoleClient_.client);
		Join<UserRoleClient, Role> roleJoin = urcJoin.join(UserRoleClient_.role);

		Predicate p1 = cb.equal(root.get(User_.id), loggedUserId);
		Predicate p2 = cb.equal(clientJoin.get(Client_.id), clientId);
		Predicate p3 = roleJoin.get(Role_.name).in(Role.ROLES.OPERATOR.name(), Role.ROLES.FOLLOWER.name());

		cq = cq.select(tourneyJoin);
		cq = cq.where(p1, p2, p3);

		TypedQuery<Tourney> tq = getEm().createQuery(cq);

		List<Tourney> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Tourneys]");

		return resultList;
	}

	/**
	 * Finds all Tourneys associated to the received logged user id
	 * 
	 * @param loggedUserId
	 *            the user identifier
	 * @return the list of Tourneys related to the logged user id
	 */
	public List<Tourney> findTourneysBySessionId(String sessionId) {

		log.debug(logId() + "Entering findTourneysBySessionId()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<Tourney> cq = cb.createQuery(Tourney.class);
		Root<Tourney> root = cq.from(Tourney.class);

		Join<Tourney, Session> tourneySessionJoin = root.join(Tourney_.session);

		Predicate p = cb.equal(tourneySessionJoin.get(Session_.userSession), sessionId);

		cq = cq.select(root);
		cq = cq.where(p);

		TypedQuery<Tourney> tq = getEm().createQuery(cq);

		List<Tourney> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Tourneys]");

		return resultList;
	}

	public Tourney getTourneyByClient(Integer clientId, String tourneyName) {

		log.debug(logId() + "Entering getTourneyByClient()");

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

		log.debug(logId() + "[Found " + resultList.size() + " Tourneys]");

		if (resultList.isEmpty()) {
			return null;
		}

		return resultList.get(0);
	}

	public Tourney getTourneyBySession(String userSession, String tourneyName) {

		log.debug(logId() + "Entering getTourneyBySession()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<Tourney> cq = cb.createQuery(Tourney.class);
		Root<Tourney> root = cq.from(Tourney.class);

		Join<Tourney, Session> tourneySessionJoin = root.join(Tourney_.session);

		Predicate p = cb.equal(tourneySessionJoin.get(Session_.userSession), userSession);

		Predicate q = cb.equal(root.get(Tourney_.tourneyName), tourneyName);

		cq = cq.select(root);
		cq = cq.where(p, q);
		cq = cq.orderBy(cb.asc(root.get(Tourney_.tourneyName)));

		TypedQuery<Tourney> tq = getEm().createQuery(cq);

		List<Tourney> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Tourneys]");

		if (resultList.isEmpty()) {
			return null;
		}

		return resultList.get(0);
	}

	public Tourney getByFollower(String username) {

		log.debug(logId() + "Entering getByFollower()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<Tourney> cq = cb.createQuery(Tourney.class);
		Root<Tourney> root = cq.from(Tourney.class);

		Join<Tourney, UserRoleClient> urcJoin = root.join(Tourney_.urcs);
		Join<UserRoleClient, User> userJoin = urcJoin.join(UserRoleClient_.user);
		Join<UserRoleClient, Role> roleJoin = urcJoin.join(UserRoleClient_.role);

		Predicate p1 = cb.equal(userJoin.get(User_.username), username);
		Predicate p2 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.FOLLOWER.name());

		cq = cq.select(root);
		cq = cq.where(p1, p2);

		TypedQuery<Tourney> tq = getEm().createQuery(cq);

		List<Tourney> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Tourneys]");

		if (resultList.isEmpty()) {
			return null;
		}

		return resultList.get(0);
	}

	public void insert(Tourney t) {

		log.debug(logId() + "Entering insert(" + t.getJson() + ")");

		super.insertPo(t);
	}

	public void update(Tourney t) {

		log.debug(logId() + "Entering update(" + t.getId() + ")");

		super.updatePo(t);
	}

	public void delete(Tourney t) {

		log.debug(logId() + "Entering delete(" + t.getId() + ")");

		super.deletePo(t);
	}

}
