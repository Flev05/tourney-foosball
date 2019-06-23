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

import javax.persistence.Query;
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
     * Finds all meetings associated to the received tourney and eliminatory not null
     * 
     * @param tourneyId the tourney identifier
     * @return the list of meetings related to the ids
     */
    public List<Meeting> findAllEliminatoryMeetingsBy(Integer tourneyId) {

        logger.debug(logId() + "Entering findAllEliminatoryMeetingsBy()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Meeting> cq = cb.createQuery(Meeting.class);
        Root<Meeting> root = cq.from(Meeting.class);

        Join<Meeting, Tourney> meetingTourneyJoin = root.join(Meeting_.tourney);

        Predicate p = cb.isNotNull(root.get(Meeting_.eliminatoryId));
        Predicate q = cb.equal(meetingTourneyJoin.get(Tourney_.id), tourneyId);

        cq = cq.select(root);
        cq = cq.where(p, q);

        TypedQuery<Meeting> tq = getEm().createQuery(cq);

        List<Meeting> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    /**
     * Finds all meetings associated to the received tourney and eliminatory id list
     * 
     * @param tourneyId the tourney identifier
     * @param idList the list of Eliminatory ids
     * @return the list of meetings related to the ids
     */
    public List<Meeting> findAllEliminatoryMeetingsByIdList(Integer tourneyId, List<Integer> idList) {

        logger.debug(logId() + "Entering findAllEliminatoryMeetingsByIdList()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Meeting> cq = cb.createQuery(Meeting.class);
        Root<Meeting> root = cq.from(Meeting.class);

        Join<Meeting, Tourney> meetingTourneyJoin = root.join(Meeting_.tourney);

        Predicate p2 = cb.equal(meetingTourneyJoin.get(Tourney_.id), tourneyId);
        Predicate p3 = root.get(Meeting_.eliminatoryId).in(idList);

        cq = cq.select(root);
        cq = cq.where(p2, p3);

        TypedQuery<Meeting> tq = getEm().createQuery(cq);

        List<Meeting> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    /**
     * Finds all meetings associated to the received tourney and eliminatory id
     * 
     * @param tourneyId the tourney identifier
     * @param eliminatoryId the eliminatory identifier
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

    public void insert(Meeting m) {

        logger.debug(logId() + "Entering insert(" + m.getJson() + ")");

        super.insertPo(m);
    }

    public void update(Meeting m) {

        logger.debug(logId() + "Entering update(" + m.getId() + ")");

        super.updatePo(m);
    }

    public void delete(Meeting m) {

        logger.debug(logId() + "Entering delete(" + m.getId() + ")");

        super.deletePo(m);
    }

    public void deleteAllMeetingsByTourneyId(Integer tourneyId) {

        Query query = getEm().createQuery("DELETE FROM Meeting m WHERE m.tourney.id = :tourneyId");

        int deletedCount = query.setParameter("tourneyId", tourneyId).executeUpdate();

        logger.debug(logId() + "Deleted " + deletedCount + " Meeting(s) where tourneyId=" + tourneyId);
    }

    public void deleteRoundMeetingsByTourneyId(Integer tourneyId) {

        Query query = getEm()
                .createQuery("DELETE FROM Meeting m WHERE m.tourney.id = :tourneyId and m.roundId is not null");

        int deletedCount = query.setParameter("tourneyId", tourneyId).executeUpdate();

        logger.debug(logId() + "Deleted " + deletedCount + " Meeting(s) where tourneyId=" + tourneyId);
    }

    public void deleteMeetingsByRoundId(Integer tourneyId, Integer roundId) {

        Query query = getEm()
                .createQuery("DELETE FROM Meeting m WHERE m.tourney.id = :tourneyId and m.roundId = :roundId");

        query = query.setParameter("tourneyId", tourneyId);
        query = query.setParameter("roundId", roundId);

        int deletedCount = query.executeUpdate();

        logger.debug(logId() + "[Deleted " + deletedCount + " Meeting(s) where tourneyId=" + tourneyId + " and roundId="
                + roundId + "]");
    }

    public void deletePlayoffMeetingsByTourneyId(Integer tourneyId) {

        Query query = getEm()
                .createQuery("DELETE FROM Meeting m WHERE m.tourney.id = :tourneyId and m.playoffId is not null");

        int deletedCount = query.setParameter("tourneyId", tourneyId).executeUpdate();

        logger.debug(logId() + "Deleted " + deletedCount + " Meeting(s)");
    }

    public void deleteEliminatoryMeetingsByTourneyId(Integer tourneyId) {

        Query query = getEm()
                .createQuery("DELETE FROM Meeting m WHERE m.tourney.id = :tourneyId and m.eliminatoryId is not null");

        int deletedCount = query.setParameter("tourneyId", tourneyId).executeUpdate();

        logger.debug(logId() + "Deleted " + deletedCount + " Meeting(s)");
    }
}
