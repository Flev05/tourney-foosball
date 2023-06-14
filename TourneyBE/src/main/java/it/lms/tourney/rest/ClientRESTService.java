
package it.lms.tourney.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import it.lms.cb.gui.vo.ClientVO;
import it.lms.tourney.cdi.Converter;
import it.lms.tourney.cdi.ConverterObject;
import it.lms.tourney.dao.ClientDao;
import it.lms.tourney.dao.UserDao;
import it.lms.tourney.po.Client;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * JAX-RS to produces a RESTful service to read/write by HTTP clients.
 */
@Path("/clients")
@Stateless
@Slf4j
public class ClientRESTService extends AbstractRESTService {

	@Inject
	private ClientDao clientDao;

	@Inject
	private UserDao userDao;

	@Inject
	@ConverterObject
	private Converter converter;

	@GET
	@Path("/loadByUserId/{userId:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ClientVO> loadByUserId(@PathParam("userId") Integer userId) {

		log.debug(logId() + "GET: loadByUserId()");

		List<ClientVO> clientVoList = new ArrayList<>();
		if (userDao.isDeveloperUser(userId)) {
			List<Client> clientList = clientDao.findAllClients();
			for (Client cpo : clientList) {
				clientVoList.add(converter.convertClientPoVo(cpo));
			}
		} else {
			List<Client> urcList = clientDao.findClientsByUser(userId);
			clientVoList.addAll(prepareClientVoList(urcList));
		}

		return clientVoList;
	}

	private List<ClientVO> prepareClientVoList(List<Client> clientList) {

		List<ClientVO> clientVoList = new ArrayList<>();

		for (Client cpo : clientList) {

			ClientVO cvo = converter.convertClientPoVo(cpo);

			clientVoList.add(cvo);

			log.debug(logId() + cvo);
		}

		return clientVoList;
	}

	@GET
	@Path("/find/{id:[0-9][0-9]*}")
	@Produces(MediaType.APPLICATION_JSON)
	public Client lookupClientById(@PathParam("id") Integer id) {

		log.debug(logId() + "GET: lookupClientById(" + id + ")");

		Client client = clientDao.getById(id);
		if (client == null) {
			throw new WebApplicationException(Response.Status.NOT_FOUND);
		}
		return client;
	}

	/**
	 * Creates a new client from the values provided. Performs validation, and will return a JAX-RS response with either
	 * 200 ok, or with a map of fields, and related errors.
	 */
	@POST
	@Path("/insert")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createClient(ClientVO clientVo) {

		log.debug(logId() + "POST: createClient(" + clientVo + ")");

		Map<String, String> responseObj = new HashMap<String, String>();
		Client foundClient = clientDao.getByBusinssName(clientVo.getBusinessName());
		if (foundClient != null) {

			log.error("Client found");
			responseObj.put("errorCode", "ClientAlreadyExists");
			responseObj.put("message", "Client " + clientVo.getBusinessName() + " already exists");
			responseObj.put("email", foundClient.getEmail());
			responseObj.put("phoneNumber", foundClient.getPhoneNumber());
			responseObj.put("address", foundClient.getAddress());

			Response.ResponseBuilder builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
			return builder.build();
		}

		Client client = newClient(clientVo);

		ClientVO cvo = converter.convertClientPoVo(client);

		log.debug("{}", cvo);

		Response.ResponseBuilder builder = Response.ok().entity(cvo);

		return builder.build();
	}

	private Client newClient(ClientVO cvo) {

		Client cpo = prepareClientPo(cvo);

		clientDao.insert(cpo);
		return cpo;
	}

	/**
	 * Updates the received client found in the database. Performs validation, and will return a JAX-RS response with
	 * either 200 ok, or with a map of fields, and related errors.
	 */
	@PUT
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateClient(ClientVO cvo) {

		log.debug(logId() + "PUT: updateClient(" + cvo + ")");

		Client cpo = prepareClientPo(cvo);

		clientDao.update(cpo);

		Response.ResponseBuilder builder = Response.ok().entity(cvo);

		return builder.build();
	}

	private Client prepareClientPo(ClientVO cvo) {

		log.debug(logId() + "Entering prepareClientPo()");

		Client cpo = new Client();

		cpo.setId(cvo.getId());
		cpo.setAddress(cvo.getAddress().trim());
		cpo.setBusinessName(cvo.getBusinessName().trim());
		cpo.setCountry(cvo.getCountry());
		cpo.setEmail(cvo.getEmail().trim());
		cpo.setPhoneNumber(cvo.getPhoneNumber().trim());
		cpo.setSiteUrl(cvo.getSiteUrl().trim());
		return cpo;
	}

	/**
	 * Removes a the received client from the persistent store. Return a JAX-RS response with either 200 ok, or with a
	 * map of fields, and related errors.
	 */
	@DELETE
	@Path("/delete/{id:[0-9][0-9]*}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteClient(@PathParam("id") Integer id) {

		log.debug(logId() + "DELETE: deleteClient(" + id + ")");

		Client client = clientDao.getById(id);
		clientDao.delete(client);

		Response.ResponseBuilder builder = Response.ok();

		return builder.build();
	}
}
