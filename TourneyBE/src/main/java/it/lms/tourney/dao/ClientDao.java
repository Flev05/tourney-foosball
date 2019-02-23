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

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Client_;

// The @Stateless annotation eliminates the need for manual transaction demarcation
@Stateless
public class ClientDao extends BaseJPACrudDao<Client, Integer> {

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public Client getById(Integer id) {

        return super.findById(id);
    }

    public Client findByEmail(String email) {

        logger.debug(logId() + "Entering findByEmail(" + email + ")");

        CriteriaBuilder cb = getCb();
        CriteriaQuery<Client> criteria = cb.createQuery(Client.class);
        Root<Client> root = criteria.from(Client.class);

        Predicate p = cb.equal(root.get(Client_.email), email);

        criteria = criteria.select(root);
        criteria = criteria.where(p);

        TypedQuery<Client> tq = getEm().createQuery(criteria);

        List<Client> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");
        if (resultList.isEmpty()) {
            return null;
        }

        return resultList.get(0);
    }

    public Client getByBusinssName(String businessName) {

        logger.debug(logId() + "Entering getByBusinssName(" + businessName + ")");

        CriteriaBuilder cb = getCb();
        CriteriaQuery<Client> criteria = cb.createQuery(Client.class);
        Root<Client> root = criteria.from(Client.class);

        Predicate p = cb.equal(root.get(Client_.businessName), businessName);

        criteria = criteria.select(root);
        criteria = criteria.where(p);

        TypedQuery<Client> tq = getEm().createQuery(criteria);

        List<Client> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");
        if (resultList.isEmpty()) {
            return null;
        }

        return resultList.get(0);
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void insert(Client client) throws Exception {

        logger.debug(logId() + "Entering insert(" + client + ")");

        super.insertPo(client);

    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void update(Client client) throws Exception {

        logger.debug(logId() + "Entering update(" + client + ")");

        super.updatePo(client);
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void delete(Client client) throws Exception {

        logger.debug(logId() + "Entering delete(" + client + ")");

        super.deletePo(client);
    }

}
