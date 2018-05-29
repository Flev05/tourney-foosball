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

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.Logger;

import it.lms.tourney.po.Client;
import it.lms.tourney.po.Client_;

@ApplicationScoped
public class ClientRepository {

    @Inject
    private Logger        log;

    @Inject
    private EntityManager em;

    public Client findById(Integer id) {

        return em.find(Client.class, id);
    }

    public Client findByEmail(String email) {

        log.debug("Entering findByEmail(" + email + ")");

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Client> criteria = cb.createQuery(Client.class);
        Root<Client> root = criteria.from(Client.class);

        Predicate p = cb.equal(root.get(Client_.email), email);

        criteria = criteria.select(root);
        criteria = criteria.where(p);

        TypedQuery<Client> cq = em.createQuery(criteria);

        return cq.getSingleResult();
    }

    public List<Client> findAllOrderedByName() {

        log.debug("Entering findAllOrderedByName()");

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Client> cq = cb.createQuery(Client.class);
        Root<Client> member = cq.from(Client.class);

        cq = cq.select(member);
        cq = cq.orderBy(cb.asc(member.get(Client_.firstname)), cb.asc(member.get(Client_.lastname)));

        TypedQuery<Client> tq = em.createQuery(cq);

        List<Client> resultList = tq.getResultList();

        log.debug("[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    public Client getById(Integer id) {

        log.debug("Entering getById(" + id + ")");

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Client> criteria = cb.createQuery(Client.class);
        Root<Client> root = criteria.from(Client.class);

        Predicate p = cb.equal(root.get(Client_.id), id);

        criteria = criteria.select(root);
        criteria = criteria.where(p);

        TypedQuery<Client> cq = em.createQuery(criteria);

        return cq.getSingleResult();
    }
}
