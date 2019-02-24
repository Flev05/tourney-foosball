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

import java.util.Date;
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
import it.lms.tourney.po.Session;
import it.lms.tourney.po.Session_;
import it.lms.tourney.po.User;

@Stateless
public class SessionDao extends BaseJPACrudDao<Session, Integer> {

    public SessionDao() {

        super(Session.class);
    }

    public Session findSessionBy(User u) {

        logger.debug(logId() + "Entering findSessionBy(" + u + ")");

        CriteriaBuilder cb = getEm().getCriteriaBuilder();
        CriteriaQuery<Session> criteria = cb.createQuery(Session.class);
        Root<Session> root = criteria.from(Session.class);

        Predicate p = cb.equal(root.get(Session_.user), u);

        criteria = criteria.select(root);
        criteria = criteria.where(p);

        TypedQuery<Session> cq = getEm().createQuery(criteria);

        List<Session> poList = cq.getResultList();
        String info = "[Found " + poList.size() + " Session(s)] ";
        logger.info(logId() + info);

        if (poList.isEmpty()) {
            return null;
        }

        Session po = poList.get(0);
        return po;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void insert(User u, String requestedSessionId, String userInfo) {

        Session s = new Session();
        s.setUser(u);
        s.setUserSession(requestedSessionId);
        s.setUserInfo(userInfo);
        s.setCreationDate(new Date());

        super.insertPo(s);
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void update(Session s, String requestedSessionId, String userInfo) {

        s.setUserSession(requestedSessionId);
        s.setUserInfo(userInfo);
        s.setCreationDate(new Date());

        super.updatePo(s);
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void insert(Session session) throws Exception {

        logger.debug(logId() + "Entering insert(" + session + ")");

        insertPo(session);
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void update(Session session) throws Exception {

        logger.debug(logId() + "Entering save(" + session + ")");

        super.updatePo(session);
    }

}
