
package it.lms.tourney.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import it.lms.tourney.dao.CountryDao;
import it.lms.tourney.po.Country;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/countries")
@Stateless
@Slf4j
public class CountryRESTService extends AbstractRESTService {

    @Inject
    private CountryDao countryDao;

    @GET
    @Path("/loadAll")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Country> loadAll() {

        log.debug(logId() + "GET: loadAll()");

        return countryDao.findAllOrderedByCity();
    }

    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Country lookupCountryById(@PathParam("id") Integer id) {

        log.debug(logId() + "GET: lookupCountryById(" + id + ")");

        Country country = countryDao.getById(id);
        if (country == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
        return country;
    }

    /**
     * Creates a new country from the values provided. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createCountry(Country country) {

        log.debug(logId() + "POST: createCountry(" + country.getId() + ")");

        Response.ResponseBuilder builder = insert(country);

        return builder.build();
    }

    /**
     * Updates the received country found in the database. Performs validation, and will return a JAX-RS response with
     * either 200 ok, or with a map of fields, and related errors.
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCountry(Country country) {

        log.debug(logId() + "PUT: updateCountry(" + country.getId() + ")");

        Response.ResponseBuilder builder = update(country);

        return builder.build();
    }

    private Response.ResponseBuilder insert(Country country) {

        log.debug(logId() + "Entering insert()");

        Response.ResponseBuilder builder;
        try {

            countryDao.insert(country);

            // Create an "ok" response
            builder = Response.ok();
        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }
        return builder;
    }

    private Response.ResponseBuilder update(Country country) {

        log.debug(logId() + "Entering update()");

        Response.ResponseBuilder builder;
        try {

            countryDao.update(country);

            // Create an "ok" response
            builder = Response.ok();
        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<String, String>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }
        return builder;
    }

}
