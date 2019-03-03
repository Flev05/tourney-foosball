
package it.lms.tourney.rest;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import it.lms.tourney.dao.DisciplineDao;
import it.lms.tourney.po.Discipline;

/**
 * JAX-RS to produces a RESTful service to read/write by DAOs.
 */
@Path("/disciplines")
@RequestScoped
public class DisciplineRESTService extends AbstractRESTService {

    @Inject
    private DisciplineDao disciplineDao;

    @GET
    @Path("/loadAll")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Discipline> loadAll() {

        logger.debug(logId() + "GET: loadAll()");
        List<Discipline> disciplineList = disciplineDao.findAllDisciplines();

        return disciplineList;
    }
}
