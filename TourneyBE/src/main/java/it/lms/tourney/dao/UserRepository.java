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
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.Logger;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.cb.dao.DaoException;
import it.lms.tourney.po.User;
import it.lms.tourney.po.User_;

@ApplicationScoped
public class UserRepository extends BaseJPACrudDao<User, Integer> {

    @Inject
    private Logger logger;

    public User findUserBy(String username, String md5Password) throws DaoException {

        logger.debug("Entering findUserBy(" + username + "," + md5Password + ")");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Predicate p = getCb().equal(root.get(User_.username), username);
        Predicate q = getCb().equal(root.get(User_.password), md5Password);
        Predicate pAndQ = getCb().and(p, q);
        cq.select(root).where(pAndQ);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        if (poList.isEmpty()) {
            return null;
        }

        User po = poList.get(0);
        return po;
    }

}
