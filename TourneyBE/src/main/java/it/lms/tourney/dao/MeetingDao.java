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
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.tourney.po.Meeting;
import it.lms.tourney.po.Meeting_;
import it.lms.tourney.po.Tourney;
import it.lms.tourney.po.Tourney_;

// The @Stateless annotation eliminates the need for manual transaction demarcation
@Stateless
public class MeetingDao extends BaseJPACrudDao<Meeting, Integer> {

    public MeetingDao() {

        super(Meeting.class);
    }

    public Meeting getById(Integer id) {

        return super.findById(id);
    }

    /**
     * Finds all meetings associated to the received tourney and round id
     * 
     * @param tourneyId the tourney identifier
     * @param roundId the round identifier
     * @return the list of meetings related to the ids
     */
    public List<Meeting> findMeetingsByRoundId(Integer tourneyId, Integer roundId) {

        logger.debug(logId() + "Entering findMeetingsByRoundId()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Meeting> cq = cb.createQuery(Meeting.class);
        Root<Meeting> root = cq.from(Meeting.class);

        Join<Meeting, Tourney> meetingTourneyJoin = root.join(Meeting_.tourney);

        Predicate p = cb.equal(root.get(Meeting_.roundId), roundId);
        Predicate q = cb.equal(meetingTourneyJoin.get(Tourney_.id), tourneyId);

        cq = cq.select(root);
        cq = cq.where(p, q);

        TypedQuery<Meeting> tq = getEm().createQuery(cq);

        List<Meeting> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    /**
     * Finds all meetings associated to the received tourney and playoff id
     * 
     * @param tourneyId the tourney identifier
     * @param roundId the playoff identifier
     * @return the list of meetings related to the ids
     */
    public List<Meeting> findMeetingsByPlayoffId(Integer tourneyId, Integer playoffId) {

        logger.debug(logId() + "Entering findMeetingsByPlayoffId()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Meeting> cq = cb.createQuery(Meeting.class);
        Root<Meeting> root = cq.from(Meeting.class);

        Join<Meeting, Tourney> meetingTourneyJoin = root.join(Meeting_.tourney);

        Predicate p = cb.equal(root.get(Meeting_.playoffId), playoffId);
        Predicate q = cb.equal(meetingTourneyJoin.get(Tourney_.id), tourneyId);

        cq = cq.select(root);
        cq = cq.where(p, q);

        TypedQuery<Meeting> tq = getEm().createQuery(cq);

        List<Meeting> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    /**
     * Finds all meetings associated to the received tourney and eliminatory id
     * 
     * @param tourneyId the tourney identifier
     * @param roundId the eliminatory identifier
     * @return the list of meetings related to the ids
     */
    public List<Meeting> findMeetingsByEliminatoryId(Integer tourneyId, Integer eliminatoryId) {

        logger.debug(logId() + "Entering findMeetingsByEliminatoryId()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Meeting> cq = cb.createQuery(Meeting.class);
        Root<Meeting> root = cq.from(Meeting.class);

        Join<Meeting, Tourney> meetingTourneyJoin = root.join(Meeting_.tourney);

        Predicate p = cb.equal(root.get(Meeting_.eliminatoryId), eliminatoryId);
        Predicate q = cb.equal(meetingTourneyJoin.get(Tourney_.id), tourneyId);

        cq = cq.select(root);
        cq = cq.where(p, q);

        TypedQuery<Meeting> tq = getEm().createQuery(cq);

        List<Meeting> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    public void insert(Meeting client) {

        logger.debug(logId() + "Entering insert(" + client + ")");

        super.insertPo(client);
    }

    public void update(Meeting client) {

        logger.debug(logId() + "Entering update(" + client + ")");

        super.updatePo(client);
    }

    public void delete(Meeting client) {

        logger.debug(logId() + "Entering delete(" + client + ")");

        super.deletePo(client);
    }

}
