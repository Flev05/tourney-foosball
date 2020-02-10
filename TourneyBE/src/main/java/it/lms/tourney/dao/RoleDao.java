
package it.lms.tourney.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.cb.dao.DaoException;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Role.ROLES;
import it.lms.tourney.po.Role_;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import it.lms.tourney.po.UserRoleClient_;
import it.lms.tourney.po.User_;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class RoleDao extends BaseJPACrudDao<Role, Integer> {

    public RoleDao() throws DaoException {

        super(Role.class);
    }

    public Role getRoleById(Integer id) {

        log.debug(logId() + "Entering getRoleById()");

        Role role = getById(id);

        return role;
    }

    /**
     * Finds all the roles associated to the received User
     * 
     * @param u the received User
     * @return the list of the roles associated to the User
     */
    public List<Role> findRoleByUser(User u) {

        CriteriaQuery<UserRoleClient> cq = getCb().createQuery(UserRoleClient.class);

        Root<UserRoleClient> root = cq.from(UserRoleClient.class);

        Predicate p = getCb().equal(root.get(UserRoleClient_.user), u);

        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<UserRoleClient> nq = getEm().createQuery(cq);

        List<UserRoleClient> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " Entity(ies)] ";
        log.info(logId() + info);

        List<Role> roleList = poList.stream().map(urc -> urc.getRole()).collect(Collectors.toList());

        return roleList;
    }

    /**
     * Selects all the records in the Role table, converts the got Role in their corresponding BO and returns a list of
     * that BO
     * 
     * @return the list of Role BO
     * @throws DaoException if a problem occurs during the find operation
     */
    public List<Role> findAllRoles() {

        log.debug(logId() + "Entering findAllRoles()");

        CriteriaQuery<Role> cq = getCb().createQuery(Role.class);

        Root<Role> root = cq.from(Role.class);

        cq = cq.select(root);
        cq = cq.orderBy(getCb().asc(root.get(Role_.name)));

        TypedQuery<Role> nq = getEm().createQuery(cq);

        List<Role> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " Role(s)] ";
        log.info(logId() + info);

        return poList;
    }

    public Role getDeveloperRole() {

        return getPoByName(Role.ROLES.DEVELOPER);
    }

    public Role getOwnerRole() {

        return getPoByName(Role.ROLES.OWNER);
    }

    public Role getAdminRole() {

        return getPoByName(Role.ROLES.ADMIN);
    }

    public Role getOperatorRole() {

        return getPoByName(Role.ROLES.OPERATOR);
    }

    public Role getFollowerRole() {

        return getPoByName(Role.ROLES.FOLLOWER);
    }

    private Role getPoByName(Role.ROLES role) {

        CriteriaQuery<Role> cq = getCb().createQuery(Role.class);

        Root<Role> root = cq.from(Role.class);

        Predicate p = getCb().equal(root.get(Role_.name), role.name());
        Predicate pAndQ = getCb().and(p);

        cq = cq.select(root);
        cq = cq.where(pAndQ);

        TypedQuery<Role> nq = getEm().createQuery(cq);

        List<Role> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " Role(s)] ";
        log.info(logId() + info);

        if (poList.isEmpty()) {
            return null;
        }

        Role po = poList.get(0);
        return po;
    }

    /**
     * Selects the Role corresponding to the received id, converts it in its corresponding BO and return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public Role getById(Integer id) {

        log.debug(logId() + "Entering RoleDao.getById(" + id + ")");

        Role po = getPoById(id);

        return po;
    }

    public Role getPoById(Integer id) {

        Role po = findById(id);
        return po;
    }

    public void save(Role po) throws DaoException {

        if (po.isNull()) {
            log.debug(logId() + "Inserting Role: " + po);

            insert(po);
            return;
        }

        log.debug(logId() + "Updating Role: " + po);

        Role mpo = merge(po);
        updatePo(mpo);
    }

    /**
     * Inserts the received new user
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the insert operation
     */
    public void insert(Role po) throws DaoException {

        log.debug(logId() + "Entering insertPo()");

        super.insertPo(po);
    }

    /**
     * Deleted the user received as parameter
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the delete operation
     */
    public void delete(Role po) throws DaoException {

        log.debug(logId() + "Entering deletePo()");

        super.deletePo(po);
    }

    /**
     * Finds the max role among the roles of each client belonging to the received logged user id
     * 
     * @param loggedUserId the logged user id
     * @return the max role of the received user id
     */
    public ROLES findMaxRole(Integer loggedUserId) {

        log.debug(logId() + "Entering findMaxRole()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
        Root<UserRoleClient> root = cq.from(UserRoleClient.class);

        Join<UserRoleClient, User> urcUserJoin = root.join(UserRoleClient_.user);

        Predicate p = cb.equal(urcUserJoin.get(User_.id), loggedUserId);

        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

        List<UserRoleClient> resultList = tq.getResultList();

        log.debug(logId() + "[Found " + resultList.size() + " Entities]");

        ROLES maxRole = ROLES.FOLLOWER;
        List<Role> roleList = resultList.stream().map(urc -> urc.getRole()).collect(Collectors.toList());

        for (Role r : roleList) {
            for (ROLES enumRole : ROLES.values()) {
                if (r.getName().equals(enumRole.name())) {
                    if (enumRole.getValue() > maxRole.getValue()) {
                        maxRole = enumRole;
                    }
                }
            }
        }

        return maxRole;
    }

    /**
     * Finds the role list among the roles lesser than the role of the logged user id
     * 
     * @param loggedUserId the logged user id
     * @return the max role of the received user id
     */
    public List<Role> findRoleLesserThan(Integer loggedUserId) {

        log.debug(logId() + "Entering findRoleLesserThan()");

        ROLES maxRole = findMaxRole(loggedUserId);

        List<Role> resultList = findAllRoles();

        log.debug(logId() + "[Found " + resultList.size() + " Entities]");

        List<Role> roleList = new ArrayList<>();
        for (Role r : resultList) {
            ROLES er = ROLES.resolve(r.getName());
            if (er.getValue() <= maxRole.getValue()) {
                roleList.add(r);
            }
        }

        return roleList;
    }

    /**
     * Finds all the roles where its role is lesser or equals of the role of the received user
     * 
     * @param loggedUserId
     * @return
     */
    public List<Role> findRolesLesserThan(Integer loggedUserId) {

        log.debug(logId() + "Entering findRolesLesserThan()");

        ROLES maxRole = findMaxRole(loggedUserId);

        List<Role> fullRoleList = findAllRoles();

        List<Role> realRoleList = fullRoleList.stream().filter(r -> lesserThan(r, maxRole))
                .collect(Collectors.toList());

        return realRoleList;
    }

    private boolean lesserThan(Role r, ROLES maxRole) {

        Role.ROLES rv = Role.ROLES.resolve(r.getName());
        if (rv != null) {
            if (rv.getValue() <= maxRole.getValue()) {
                return true;
            }
            return false;
        }

        return false;
    }
}
