
package it.lms.tourney.rest;

import java.util.List;

import it.lms.tourney.dao.DisciplineDao;
import it.lms.tourney.po.Discipline;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by DAOs.
 */
@Path("/disciplines")
@Stateless
@Slf4j
public class DisciplineRESTService extends AbstractRESTService {

	@Inject
	private DisciplineDao disciplineDao;

	@GET
	@Path("/loadAll")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Discipline> loadAll() {

		log.debug(logId() + "GET: loadAll()");
		List<Discipline> disciplineList = disciplineDao.findAllDisciplines();

		return disciplineList;
	}
}
