
package it.lms.tourney.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

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
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UserRoleClientDao extends BaseJPACrudDao<UserRoleClient, Integer> {

    @Inject
    ClientDao clientDao;

    @Inject
    RoleDao   roleDao;

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
     * @param loggedUserId the logged user identifier
     * @return the list of URC
     */
    public List<UserRoleClient> findUrcByUser(Integer loggedUserId) {

        log.debug(logId() + "Entering findOwnerUsers()");

        List<Client> clientList = clientDao.findClientsByUser(loggedUserId);

        Role.ROLES maxRole = roleDao.findMaxRole(loggedUserId);

        List<Role.ROLES> roleList = new ArrayList<>();

        for (Role.ROLES r : Role.ROLES.values()) {

            int v = r.getValue();
            if (v <= maxRole.getValue()) {
                roleList.add(r);
            }
        }

        List<UserRoleClient> urcList = findUsersBy(clientList, roleList);

        return urcList;
    }

    /**
     * Finds all URC in the client list of OPERATOR role type
     * 
     * @param loggedUserId the logged user identifier
     * @return the list of URC
     */
    public List<UserRoleClient> findOperatorsUrcByClientId(Integer clientId) {

        log.debug(logId() + "Entering findOperatorsUrcByClientId()");

        Client c = clientDao.findById(clientId);

        List<Client> clientList = new ArrayList<>();
        clientList.add(c);

        List<Role.ROLES> roleList = new ArrayList<>();
        roleList.add(Role.ROLES.OPERATOR);

        List<UserRoleClient> urcList = findUsersBy(clientList, roleList);

        return urcList;
    }

    /**
     * Finds all URC in the client list of OPERATOR role type
     * 
     * @param loggedUserId the logged user identifier
     * @return the list of URC
     */
    public List<UserRoleClient> findOperatorsUrcBy(Integer clientId, Integer tourneyId) {

        log.debug(logId() + "Entering findOperatorsUrcBy()");

        CriteriaQuery<UserRoleClient> cq = getCb().createQuery(UserRoleClient.class);

        Root<Tourney> root = cq.from(Tourney.class);

        Join<Tourney, UserRoleClient> tourneyUrcJoin = root.join(Tourney_.urcs);
        Join<UserRoleClient, Client> clientJoin = tourneyUrcJoin.join(UserRoleClient_.client);
        Join<UserRoleClient, Role> roleJoin = tourneyUrcJoin.join(UserRoleClient_.role);

        Predicate p1 = getCb().equal(root.get(Tourney_.id), tourneyId);
        Predicate p2 = getCb().equal(clientJoin.get(Client_.id), clientId);
        Predicate p3 = getCb().equal(roleJoin.get(Role_.name), Role.ROLES.OPERATOR.name());

        cq = cq.select(tourneyUrcJoin);
        cq = cq.where(p1, p2, p3);

        TypedQuery<UserRoleClient> nq = getEm().createQuery(cq);

        List<UserRoleClient> urcList = nq.getResultList();
        String info = "[Found " + urcList.size() + " Entity(ies)] ";
        log.info(logId() + info);

        return urcList;
    }

    /**
     * First finds all URC belonging to the received loggedUserId, so finds all remaining users, if any, of the found
     * clients
     * 
     * @param loggedUserId the logged user identifier
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

        Predicate p = getCb().equal(urcUserJoin.get(User_.id), userId);

        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

        List<UserRoleClient> resultList = tq.getResultList();

        log.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    /**
     * Inserts the received UCR
     * 
     * @param bo the BO to insert
     * @throws DaoException if a problem occurs during the insert operation
     */
    public void insert(UserRoleClient po) {

        log.debug(logId() + "Entering insert(" + po + ")");

        super.insertPo(po);
    }

    /**
     * Updates the URC received as parameter
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the delete operation
     */
    public void update(UserRoleClient po) {

        log.debug(logId() + "Entering update()");

        super.updatePo(po);
    }

    /**
     * Deletes the user received as parameter
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the delete operation
     */
    public void delete(UserRoleClient po) {

        log.debug(logId() + "Entering delete()");

        super.deletePo(po);
    }

}
