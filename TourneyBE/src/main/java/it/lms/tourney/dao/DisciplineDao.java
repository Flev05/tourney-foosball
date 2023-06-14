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

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.tourney.po.Discipline;
import it.lms.tourney.po.Discipline_;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;

// The @Stateless annotation eliminates the need for manual transaction demarcation
@Slf4j
public class DisciplineDao extends BaseJPACrudDao<Discipline, Integer> {

	public DisciplineDao() {

		super(Discipline.class);
	}

	public Discipline getById(Integer id) {

		return super.findById(id);
	}

	public List<Discipline> findAllDisciplines() {

		log.debug(logId() + "Entering findAllDisciplines()");

		CriteriaBuilder cb = getCb();
		CriteriaQuery<Discipline> cq = cb.createQuery(Discipline.class);
		Root<Discipline> root = cq.from(Discipline.class);

		cq = cq.select(root);
		cq = cq.orderBy(cb.asc(root.get(Discipline_.name)));

		TypedQuery<Discipline> tq = getEm().createQuery(cq);

		List<Discipline> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Entities]");

		return resultList;
	}

	public void insert(Discipline discipline) throws Exception {

		log.debug(logId() + "Entering insert(" + discipline.getName() + ")");

		super.insertPo(discipline);
	}

	public void update(Discipline Discipline) throws Exception {

		log.debug(logId() + "Entering save(" + Discipline + ")");

		super.updatePo(Discipline);
	}

	public void delete(Discipline Discipline) throws Exception {

		log.debug(logId() + "Entering delete(" + Discipline + ")");

		super.deletePo(Discipline);
	}

}
