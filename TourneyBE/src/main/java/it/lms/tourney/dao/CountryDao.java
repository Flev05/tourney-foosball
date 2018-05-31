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

import it.lms.tourney.po.Country;

// The @Stateless annotation eliminates the need for manual transaction demarcation
@Stateless
public class CountryDao {

    @Inject
    private Logger            log;

    @Inject
    private EntityManager     em;

    @Inject
    private Event<Country>    countryEventSrc;

    @Inject
    private CountryRepository cr;

    public void insert(Country country) throws Exception {

        log.debug("Entering insert(" + country.getCity() + ")");

        em.persist(country);

        countryEventSrc.fire(country);
    }

    public void update(Country country) throws Exception {

        log.debug("Entering save(" + country.getCity() + ")");

        Country cpo = em.merge(country);
        em.persist(cpo);

        countryEventSrc.fire(country);
    }

    public void delete(Integer id) throws Exception {

        log.debug("Entering delete(" + id + ")");

        Country country = cr.getById(id);

        em.remove(country);

        countryEventSrc.fire(country);
    }
}
