
package it.lms.tourney.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.cb.dao.DaoException;
import it.lms.tourney.po.Client;
import it.lms.tourney.po.Client_;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Role_;
import it.lms.tourney.po.Tourney;
import it.lms.tourney.po.Tourney_;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import it.lms.tourney.po.UserRoleClient_;
import it.lms.tourney.po.User_;
import jakarta.inject.Inject;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UserRoleClientDao extends BaseJPACrudDao<UserRoleClient, Integer> {

	@Inject
	ClientDao clientDao;

	@Inject
	RoleDao roleDao;

	public UserRoleClientDao() throws DaoException {

		super(UserRoleClient.class);
	}

	/**
	 * Only for developer users
	 * 
	 * @return all the clients in the system
	 */
	public List<UserRoleClient> findAllUrc() {

		log.debug(logId() + "Entering findAllUrc()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		cq = cq.select(root);

		TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

		List<UserRoleClient> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Entities]");

		return resultList;
	}

	public List<UserRoleClient> findAllUrcNotDev() {

		log.debug(logId() + "Entering findAllUrcNotDev()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, Role> urcRoleJoin = root.join(UserRoleClient_.role);

		Predicate p = urcRoleJoin.get(Role_.name).in(Role.ROLES.DEVELOPER.name());

		Predicate q = cb.not(p);

		cq = cq.select(root);
		cq = cq.where(q);

		TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

		List<UserRoleClient> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Entities]");

		return resultList;
	}

	/**
	 * First of all finds:
	 * 
	 * - the client list belonging to the received loggedUserId
	 * 
	 * - the max role among the selected clients
	 * 
	 * So finds all URC in the client list and roles <= of the max role
	 * 
	 * @param loggedUserId
	 *            the logged user identifier
	 * @return the list of URC
	 */
	public List<UserRoleClient> findUrcByUser(Integer loggedUserId) {

		log.debug(logId() + "Entering findUrcByUser()");

		List<Client> clientList = clientDao.findClientsByUser(loggedUserId);

		Role.ROLES maxRole = roleDao.findMaxRole(loggedUserId);

		List<Role.ROLES> roleList = new ArrayList<>();

		for (Role.ROLES r : Role.ROLES.values()) {

			int v = r.getValue();
			if (v <= maxRole.getValue() && v >= Role.ROLES.OPERATOR.getValue()) {
				roleList.add(r);
			}
		}

		List<UserRoleClient> urcList = findUsersBy(clientList, roleList);

		return urcList;
	}

	/**
	 * Finds all URC in the client list of OPERATOR role type
	 * 
	 * @param loggedUserId
	 *            the logged user identifier
	 * @return the list of URC
	 */
	public List<UserRoleClient> findOperatorsUrcByClientId(Integer clientId) {

		log.debug(logId() + "Entering findOperatorsUrcByClientId()");

		CriteriaBuilder cb = getCb();
		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);

		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, Client> clientJoin = root.join(UserRoleClient_.client);
		Join<UserRoleClient, Role> roleJoin = root.join(UserRoleClient_.role);

		Predicate p2 = cb.equal(clientJoin.get(Client_.id), clientId);
		Predicate p3 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.OPERATOR.name());

		cq = cq.select(root);
		cq = cq.where(p2, p3);
		cq = cq.distinct(true);

		TypedQuery<UserRoleClient> nq = getEm().createQuery(cq);

		List<UserRoleClient> urcList = nq.getResultList();
		String info = "[Found " + urcList.size() + " Entity(ies)] ";
		log.info(logId() + info);

		return urcList;
	}

	/**
	 * Finds all the URC operators in function of the received paramters
	 * 
	 * @param clientId
	 *            the logged user identifier
	 * @param tourneyId
	 *            the id of the tourney
	 * @param available
	 *            the boolean if the record is available or not
	 * @return the list of URC
	 */
	public List<UserRoleClient> findAllOperatorsOf(Integer clientId, Integer tourneyId) {

		log.debug(logId() + "Entering findAllOperatorsOf()");

		CriteriaBuilder cb = getCb();
		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);

		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, Tourney> tourneyJoin = root.join(UserRoleClient_.tourney);
		Join<UserRoleClient, Client> clientJoin = root.join(UserRoleClient_.client);
		Join<UserRoleClient, Role> roleJoin = root.join(UserRoleClient_.role);

		Predicate p2 = cb.equal(tourneyJoin.get(Tourney_.id), tourneyId);
		Predicate p3 = cb.equal(clientJoin.get(Client_.id), clientId);
		Predicate p4 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.OPERATOR.name());

		cq = cq.select(root);
		cq = cq.where(p2, p3, p4);

		TypedQuery<UserRoleClient> nq = getEm().createQuery(cq);

		List<UserRoleClient> urcList = nq.getResultList();
		String info = "[Found " + urcList.size() + " UserRoleClient(ies)] ";
		log.info(logId() + info);

		return urcList;
	}

	public List<User> findDistinctOperators(Integer clientId, Integer tourneyId) {
		log.debug(logId() + "Entering findDistinctOperators()");
		CriteriaBuilder cb = getCb();
		CriteriaQuery<User> cq = cb.createQuery(User.class);
		Root<User> root = cq.from(User.class);
		Join<User, UserRoleClient> urcJoin = root.join(User_.urcSet);
		Join<UserRoleClient, Tourney> tourneyJoin = urcJoin.join(UserRoleClient_.tourney);
		Join<UserRoleClient, Client> clientJoin = urcJoin.join(UserRoleClient_.client);
		Join<UserRoleClient, Role> roleJoin = urcJoin.join(UserRoleClient_.role);
		Predicate p2 = cb.equal(tourneyJoin.get(Tourney_.id), tourneyId);
		Predicate p3 = cb.equal(clientJoin.get(Client_.id), clientId);
		Predicate p4 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.OPERATOR.name());
		cq = cq.select(root);
		cq = cq.where(p2, p3, p4);
		cq = cq.distinct(true);
		TypedQuery<User> nq = getEm().createQuery(cq);
		List<User> urcList = nq.getResultList();
		String info = "[Found " + urcList.size() + " User(s)] ";
		log.info(logId() + info);
		return urcList;
	}

	/**
	 * Finds all the URC operators in function of the received parameters
	 * 
	 * @param clientId
	 *            the logged user identifier
	 * @param tourneyId
	 *            the id of the tourney
	 * @param available
	 *            the boolean if the record is available or not
	 * @return the list of URC
	 */
	public List<UserRoleClient> findAvailableOperatorsOf(Integer clientId, Integer tourneyId, Boolean available) {

		log.debug(logId() + "Entering findAvailableOperatorsOf()");

		CriteriaBuilder cb = getCb();
		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);

		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, Tourney> tourneyJoin = root.join(UserRoleClient_.tourney);
		Join<UserRoleClient, Client> clientJoin = root.join(UserRoleClient_.client);
		Join<UserRoleClient, Role> roleJoin = root.join(UserRoleClient_.role);

		Predicate p1 = cb.equal(root.get(UserRoleClient_.available), available);
		Predicate p2 = cb.equal(tourneyJoin.get(Tourney_.id), tourneyId);
		Predicate p3 = cb.equal(clientJoin.get(Client_.id), clientId);
		Predicate p4 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.OPERATOR.name());

		cq = cq.select(root);
		cq = cq.where(p1, p2, p3, p4);

		TypedQuery<UserRoleClient> nq = getEm().createQuery(cq);

		List<UserRoleClient> urcList = nq.getResultList();
		String info = "[Found " + urcList.size() + " UserRoleClient(ies)] ";
		log.info(logId() + info);

		return urcList;
	}

	/**
	 * Finds all URC in function of received parameters and of any roles
	 * 
	 * @param userId
	 *            the logged user identifier
	 * @param clientId
	 *            the logged user identifier
	 * @param userId
	 *            the logged user identifier
	 * @return the list of URC
	 */
	public List<UserRoleClient> findUrcBy(Integer userId, Integer clientId, Integer tourneyId) {

		log.debug(logId() + "Entering findUrcBy()");

		CriteriaQuery<UserRoleClient> cq = getCb().createQuery(UserRoleClient.class);

		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, Client> clientJoin = root.join(UserRoleClient_.client);
		Join<UserRoleClient, User> userJoin = root.join(UserRoleClient_.user);

		Predicate p2 = getCb().equal(clientJoin.get(Client_.id), clientId);
		Predicate p3 = getCb().equal(userJoin.get(User_.id), userId);

		Predicate p1;
		if (tourneyId == null) {
			p1 = getCb().isNull(root.get(UserRoleClient_.tourney));
		} else {
			Join<UserRoleClient, Tourney> tourneyJoin = root.join(UserRoleClient_.tourney);
			p1 = getCb().equal(tourneyJoin.get(Tourney_.id), tourneyId);
		}

		cq = cq.select(root);
		cq = cq.where(p1, p2, p3);

		TypedQuery<UserRoleClient> nq = getEm().createQuery(cq);

		List<UserRoleClient> urcList = nq.getResultList();
		String info = "[Found " + urcList.size() + " UserRoleClient(ies)] ";
		log.info(logId() + info);

		return urcList;
	}

	/**
	 * First finds all URC belonging to the received loggedUserId, so finds all remaining users, if any, of the found
	 * clients
	 * 
	 * @param loggedUserId
	 *            the logged user identifier
	 * @return the list of users
	 */
	private List<UserRoleClient> findUsersBy(List<Client> clientList, List<Role.ROLES> roleList) {

		log.debug(logId() + "Entering findUsersBy()");

		CriteriaQuery<UserRoleClient> cq = getCb().createQuery(UserRoleClient.class);

		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, Role> urcRoleJoin = root.join(UserRoleClient_.role);

		List<String> roles = roleList.stream().map(r -> r.name()).collect(Collectors.toList());
		Predicate p = urcRoleJoin.get(Role_.name).in(roles);
		Predicate q = root.get(UserRoleClient_.client).in(clientList);

		cq = cq.select(root);
		cq = cq.where(p, q);

		TypedQuery<UserRoleClient> nq = getEm().createQuery(cq);

		List<UserRoleClient> urcList = nq.getResultList();
		String info = "[Found " + urcList.size() + " Entity(ies)] ";
		log.info(logId() + info);

		return urcList;
	}

	public List<UserRoleClient> findByUserId(Integer userId) {

		log.debug(logId() + "Entering findByUserId()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, User> urcUserJoin = root.join(UserRoleClient_.user);

		Predicate p = cb.equal(urcUserJoin.get(User_.id), userId);

		cq = cq.select(root);
		cq = cq.where(p);

		TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

		List<UserRoleClient> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Entities]");

		return resultList;
	}

	public List<User> findFollowerByTourneyId(Integer tourneyId) {

		log.debug(logId() + "Entering findByTourneyId()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<User> cq = cb.createQuery(User.class);

		Root<UserRoleClient> root = cq.from(UserRoleClient.class);
		Join<UserRoleClient, Tourney> urcTourneyJoin = root.join(UserRoleClient_.tourney);
		Join<UserRoleClient, User> userJoin = root.join(UserRoleClient_.user);
		Join<UserRoleClient, Role> roleJoin = root.join(UserRoleClient_.role);

		Predicate p1 = cb.equal(urcTourneyJoin.get(Tourney_.id), tourneyId);
		Predicate p2 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.FOLLOWER.name());

		cq = cq.select(userJoin);
		cq = cq.where(p1, p2);

		TypedQuery<User> tq = getEm().createQuery(cq);

		List<User> poList = tq.getResultList();

		log.debug(logId() + "[Found " + poList.size() + " User(s)]");

		return poList;
	}

	/**
	 * Finds all the user of operator type found in the received user id list
	 * 
	 * @param userIdList
	 *            the id of the user to find
	 * @return the URC found list
	 */
	public List<UserRoleClient> findOperatorsUrcByUserIdList(Integer clientId, List<Integer> userIdList) {

		log.debug(logId() + "Entering findOperatorsUrcByUserIdList()");

		CriteriaBuilder cb = getCb();

		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, User> userJoin = root.join(UserRoleClient_.user);
		Join<UserRoleClient, Role> roleJoin = root.join(UserRoleClient_.role);
		Join<UserRoleClient, Client> clientJoin = root.join(UserRoleClient_.client);

		Predicate p1 = userJoin.get(User_.id).in(userIdList);
		Predicate p2 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.OPERATOR.name());
		Predicate p3 = cb.equal(clientJoin.get(Client_.id), clientId);

		cq = cq.select(root);
		cq = cq.where(p1, p2, p3);

		TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

		List<UserRoleClient> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " UserRoleClient]");

		return resultList;
	}

	/**
	 * Inserts the received UCR
	 * 
	 * @param bo
	 *            the BO to insert
	 * @throws DaoException
	 *             if a problem occurs during the insert operation
	 */
	public void insert(UserRoleClient po) {

		log.debug(logId() + "Entering insert(" + po + ")");

		super.insertPo(po);
	}

	/**
	 * Updates the URC received as parameter
	 * 
	 * @param bo
	 *            the BO to save
	 * @throws DaoException
	 *             if a problem occurs during the delete operation
	 */
	public void update(UserRoleClient po) {

		log.debug(logId() + "Entering update()");

		super.updatePo(po);
	}

	/**
	 * Deletes the user received as parameter
	 * 
	 * @param bo
	 *            the BO to save
	 * @throws DaoException
	 *             if a problem occurs during the delete operation
	 */
	public void delete(UserRoleClient po) {

		log.debug(logId() + "Entering delete()");

		super.deletePo(po);
	}

	/**
	 * Verify if exists at least a URC record NOT belonging to the received tourney neither client
	 * 
	 * @param tpo
	 *            the tourney to verify
	 * @return true if exists at least one URC, false otherwise
	 */
	public boolean existsOperator(Integer clientId, Tourney tpo) {

		CriteriaBuilder cb = getCb();

		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, Tourney> tourneyJoin = root.join(UserRoleClient_.tourney);
		Join<UserRoleClient, Client> clientJoin = root.join(UserRoleClient_.client);
		Join<UserRoleClient, Role> roleJoin = root.join(UserRoleClient_.role);

		Predicate p1 = cb.notEqual(tourneyJoin.get(Tourney_.id), tpo.getId());
		Predicate p2 = cb.notEqual(clientJoin.get(Client_.id), clientId);
		Predicate p3 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.OPERATOR.name());

		cq = cq.select(root);
		cq = cq.where(p1, p2, p3);

		TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

		List<UserRoleClient> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " Entities]");

		return resultList.size() >= 1;
	}

	/**
	 * Find the free operators of received company
	 * 
	 * @param clientId
	 *            the client bounded to the URC
	 * @return the list of URC selected
	 */
	public List<UserRoleClient> getFreeOperatorsOfCompany(Integer clientId) {

		CriteriaBuilder cb = getCb();

		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, Client> clientJoin = root.join(UserRoleClient_.client);
		Join<UserRoleClient, Role> roleJoin = root.join(UserRoleClient_.role);

		Predicate p2 = cb.equal(clientJoin.get(Client_.id), clientId);
		Predicate p3 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.OPERATOR.name());
		Predicate p4 = cb.isNull(root.get(UserRoleClient_.tourney));

		cq = cq.select(root);
		cq = cq.where(p2, p3, p4);

		TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

		List<UserRoleClient> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " UserRoleClient]");
		return resultList;
	}

	/**
	 * Find the URC of OPERATOR role and bounded to the incoming parameters
	 * 
	 * @param username
	 *            the user bounded to the URC
	 * @param clientId
	 *            the client bounded to the URC
	 * @return the list of URC selected
	 */
	public List<UserRoleClient> getOperatorsBy(String username, Integer clientId) {

		CriteriaBuilder cb = getCb();

		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, User> userJoin = root.join(UserRoleClient_.user);
		Join<UserRoleClient, Client> clientJoin = root.join(UserRoleClient_.client);
		Join<UserRoleClient, Role> roleJoin = root.join(UserRoleClient_.role);

		Predicate p1 = cb.equal(userJoin.get(User_.username), username);
		Predicate p2 = cb.equal(clientJoin.get(Client_.id), clientId);
		Predicate p3 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.OPERATOR.name());
		Predicate p4 = cb.isNull(root.get(UserRoleClient_.tourney));

		cq = cq.select(root);
		cq = cq.where(p1, p2, p3, p4);

		TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

		List<UserRoleClient> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " UserRoleClient]");
		return resultList;
	}

	/**
	 * Find the URC of OPERATOR role and bounded to the incoming parameters
	 * 
	 * @param userId
	 *            the user bounded to the URC
	 * @param clientId
	 *            the client bounded to the URC
	 * @param tourneyId
	 *            the tourney bounded to the URC
	 * @return the unique URC selected
	 */
	public UserRoleClient getOperator(String username, Integer clientId, Integer tourneyId) {

		CriteriaBuilder cb = getCb();

		CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
		Root<UserRoleClient> root = cq.from(UserRoleClient.class);

		Join<UserRoleClient, User> userJoin = root.join(UserRoleClient_.user);
		Join<UserRoleClient, Client> clientJoin = root.join(UserRoleClient_.client);
		Join<UserRoleClient, Role> roleJoin = root.join(UserRoleClient_.role);

		Predicate p1 = cb.equal(userJoin.get(User_.username), username);
		Predicate p2 = cb.equal(clientJoin.get(Client_.id), clientId);
		Predicate p3 = cb.equal(roleJoin.get(Role_.name), Role.ROLES.OPERATOR.name());

		Predicate p4;
		if (tourneyId == null) {
			p4 = cb.isNull(root.get(UserRoleClient_.tourney));
		} else {
			Join<UserRoleClient, Tourney> tourneyJoin = root.join(UserRoleClient_.tourney);
			p4 = cb.equal(tourneyJoin.get(Tourney_.id), tourneyId);
		}

		cq = cq.select(root);
		cq = cq.where(p1, p2, p3, p4);

		TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

		List<UserRoleClient> resultList = tq.getResultList();

		log.debug(logId() + "[Found " + resultList.size() + " UserRoleClient]");
		if (resultList.isEmpty()) {
			return null;
		}
		return resultList.get(0);
	}

	public UserRoleClient newFollowerUrc(User upo, Client cpo, Tourney tpo) {

		UserRoleClient urc = new UserRoleClient();
		urc.setUser(upo);
		urc.setClient(cpo);
		urc.setTourney(tpo);
		Role rpo = roleDao.getFollowerRole();
		urc.setRole(rpo);
		insert(urc);
		return urc;
	}

	public UserRoleClient newUrcAvailableOperator(User upo, Client cpo, Tourney tpo) {

		UserRoleClient urc = new UserRoleClient();
		urc.setAvailable(true);
		urc.setUser(upo);
		urc.setClient(cpo);
		urc.setTourney(tpo);
		Role rpo = roleDao.getOperatorRole();
		urc.setRole(rpo);
		insert(urc);
		return urc;
	}

	public void deleteAnyUrcUsersBy(Integer clientId, Integer roleId, Integer tourneyId) {

		Query query = getEm().createQuery(
				"DELETE FROM UserRoleClient urc WHERE urc.client.id = :clientId and urc.role.id = :roleId and urc.tourney.id = :tourneyId");

		query = query.setParameter("clientId", clientId);
		query = query.setParameter("roleId", roleId);
		query = query.setParameter("tourneyId", tourneyId);
		int deletedCount = query.executeUpdate();

		log.debug(logId() + "Deleted " + deletedCount + " UserRoleClient(s)");
	}

	public void deleteUrcByTourney(Integer tourneyId) {

		Query query = getEm().createQuery("DELETE FROM UserRoleClient urc WHERE urc.tourney.id = :tourneyId");
		query = query.setParameter("tourneyId", tourneyId);
		int deletedCount = query.executeUpdate();
		log.debug(logId() + "Deleted " + deletedCount + " UserRoleClient(s) where tourneyId=" + tourneyId);
	}
}
