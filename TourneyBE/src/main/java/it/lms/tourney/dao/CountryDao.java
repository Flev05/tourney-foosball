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
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.tourney.po.Country;
import it.lms.tourney.po.Country_;

// The @Stateless annotation eliminates the need for manual transaction demarcation
public class CountryDao extends BaseJPACrudDao<Country, Integer> {

    public CountryDao() {

        super(Country.class);
    }

    public Country getById(Integer id) {

        return super.findById(id);
    }

    public Country findByCity(String city) {

        logger.debug(logId() + "Entering findByCity(" + city + ")");

        CriteriaBuilder cb = getCb();
        CriteriaQuery<Country> criteria = cb.createQuery(Country.class);
        Root<Country> root = criteria.from(Country.class);

        Predicate p = cb.equal(root.get(Country_.city), city);

        criteria = criteria.select(root);
        criteria = criteria.where(p);

        TypedQuery<Country> cq = getEm().createQuery(criteria);

        return cq.getSingleResult();
    }

    public List<Country> findAllOrderedByCity() {

        logger.debug(logId() + "Entering findAllOrderedByCity()");

        CriteriaBuilder cb = getCb();
        CriteriaQuery<Country> cq = cb.createQuery(Country.class);
        Root<Country> root = cq.from(Country.class);

        cq = cq.select(root);
        cq = cq.orderBy(cb.asc(root.get(Country_.city)));

        TypedQuery<Country> tq = getEm().createQuery(cq);

        List<Country> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    public void insert(Country country) throws Exception {

        logger.debug(logId() + "Entering insert(" + country.getCity() + ")");

        super.insertPo(country);
    }

    public void update(Country country) throws Exception {

        logger.debug(logId() + "Entering save(" + country + ")");

        super.updatePo(country);
    }

    public void delete(Country country) throws Exception {

        logger.debug(logId() + "Entering delete(" + country + ")");

        super.deletePo(country);
    }

}
