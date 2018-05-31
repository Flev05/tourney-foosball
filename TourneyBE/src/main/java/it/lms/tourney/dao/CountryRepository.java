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

import it.lms.tourney.po.Country;
import it.lms.tourney.po.Country_;

@ApplicationScoped
public class CountryRepository {

    @Inject
    private Logger        log;

    @Inject
    private EntityManager em;

    public Country getById(Integer id) {

        return em.find(Country.class, id);
    }

    public Country findByCity(String city) {

        log.debug("Entering findByCity(" + city + ")");

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Country> criteria = cb.createQuery(Country.class);
        Root<Country> root = criteria.from(Country.class);

        Predicate p = cb.equal(root.get(Country_.city), city);

        criteria = criteria.select(root);
        criteria = criteria.where(p);

        TypedQuery<Country> cq = em.createQuery(criteria);

        return cq.getSingleResult();
    }

    public List<Country> findAllOrderedByCity() {

        log.debug("Entering findAllOrderedByCity()");

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Country> cq = cb.createQuery(Country.class);
        Root<Country> root = cq.from(Country.class);

        cq = cq.select(root);
        cq = cq.orderBy(cb.asc(root.get(Country_.city)));

        TypedQuery<Country> tq = em.createQuery(cq);

        List<Country> resultList = tq.getResultList();

        log.debug("[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    // private Country getById(Integer id) {
    //
    // log.debug("Entering getById(" + id + ")");
    //
    // CriteriaBuilder cb = em.getCriteriaBuilder();
    // CriteriaQuery<Country> criteria = cb.createQuery(Country.class);
    // Root<Country> root = criteria.from(Country.class);
    //
    // Predicate p = cb.equal(root.get(Country_.id), id);
    //
    // criteria = criteria.select(root);
    // criteria = criteria.where(p);
    //
    // TypedQuery<Country> cq = em.createQuery(criteria);
    //
    // return cq.getSingleResult();
    // }
}
