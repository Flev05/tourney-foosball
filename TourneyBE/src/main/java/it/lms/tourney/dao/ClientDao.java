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

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Client_;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Role_;
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
public class ClientDao extends BaseJPACrudDao<Client, Integer> {

	public ClientDao() {

		super(Client.class);
	}

	public Client getById(Integer id) {

		return super.findById(id);
	}

	/**
	 * Finds all clients belonging to the same user loggedUserId and having OWNER role
	 * 
	 * @param loggedUserId
	 *            the logged user identifier
	 * @return the list of urc
	 */
	public List<Client> findOwnerClients(Integer loggedUserId) {

		log.debug(logId() + "Entering findOwnerClients()");

		List<Role.ROLES> roleList = Arrays.asList(Role.ROLES.OWNER);

		List<UserRoleClient> urcList = findClientsByRole(loggedUserId, roleList);

		List<Client> clientList = urcList.stream().map(urc -> urc.getClient()).collect(Collectors.toList());

		return clientList;
	}

	public List<UserRoleClient> findClientsByRole(Integer loggedUserId, List<Role.ROLES> roleList) {

		log.debug(logId() + "Entering findClientsByRole()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, Role> urcRoleJoin = root.join(UserRoleClient_.role);
		Join<UserRoleClient, User> urcUserJoin = root.join(UserRoleClient_.user);

		Predicate p = cb.equal(urcUserJoin.get(User_.id), loggedUserId);

		List<String> roles = roleList.stream().map(r -> r.name()).collect(Collectors.toList());
		Predicate q = urcRoleJoin.get(Role_.name).in(roles);

		cq = cq.select(root);
		cq = cq.where(p, q);

		TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

		List<UserRoleClient> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Clients]");

		return resultList;
	}

	/**
	 * Finds all clients associated to the received logged user id
	 * 
	 * @param loggedUserId
	 *            the user identifier
	 * @return the list of clients related to the logged user id
	 */
	public List<Client> findClientsByUser(Integer loggedUserId) {

		log.debug(logId() + "Entering findClientsByUser({})", loggedUserId);

		CriteriaBuilder cb = getCb();

		CriteriaQuery<Client> cq = cb.createQuery(Client.class);
		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, User> urcUserJoin = root.join(UserRoleClient_.user);
		Join<UserRoleClient, Client> clientJoin = root.join(UserRoleClient_.client);

		Predicate p = cb.equal(urcUserJoin.get(User_.id), loggedUserId);

		cq = cq.select(clientJoin);
		cq = cq.where(p);
		cq = cq.distinct(true);

		TypedQuery<Client> tq = getEm().createQuery(cq);

		List<Client> poList = tq.getResultList();

		log.debug(logId() + "[Found " + poList.size() + " Clients]");

		// List<Client> clientList = resultList.stream().map(urc -> urc.getClient()).collect(Collectors.toList());

		return poList;
	}

	public List<Client> findAllClients() {

		log.debug(logId() + "Entering findByEmail()");

		CriteriaBuilder cb = getCb();
		CriteriaQuery<Client> criteria = cb.createQuery(Client.class);
		Root<Client> root = criteria.from(Client.class);

		criteria = criteria.select(root);

		TypedQuery<Client> tq = getEm().createQuery(criteria);

		List<Client> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Clients]");

		return resultList;
	}

	public Client findByEmail(String email) {

		log.debug(logId() + "Entering findByEmail(" + email + ")");

		CriteriaBuilder cb = getCb();
		CriteriaQuery<Client> criteria = cb.createQuery(Client.class);
		Root<Client> root = criteria.from(Client.class);

		Predicate p = cb.equal(root.get(Client_.email), email);

		criteria = criteria.select(root);
		criteria = criteria.where(p);

		TypedQuery<Client> tq = getEm().createQuery(criteria);

		List<Client> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Clients]");
		if (resultList.isEmpty()) {
			return null;
		}

		return resultList.get(0);
	}

	public Client getByBusinssName(String businessName) {

		log.debug(logId() + "Entering getByBusinssName(" + businessName + ")");

		CriteriaBuilder cb = getCb();
		CriteriaQuery<Client> criteria = cb.createQuery(Client.class);
		Root<Client> root = criteria.from(Client.class);

		Predicate p = cb.equal(root.get(Client_.businessName), businessName);

		criteria = criteria.select(root);
		criteria = criteria.where(p);

		TypedQuery<Client> tq = getEm().createQuery(criteria);

		List<Client> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Clients]");
		if (resultList.isEmpty()) {
			return null;
		}

		return resultList.get(0);
	}

	public void insert(Client client) {

		log.debug(logId() + "Entering insert(" + client + ")");

		super.insertPo(client);
	}

	public void update(Client client) {

		log.debug(logId() + "Entering update(" + client + ")");

		super.updatePo(client);
	}

	public void delete(Client client) {

		log.debug(logId() + "Entering delete(" + client + ")");

		super.deletePo(client);
	}

}
