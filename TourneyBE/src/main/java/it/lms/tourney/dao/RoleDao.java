
package it.lms.tourney.dao;

import java.util.List;
import java.util.stream.Collectors;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.cb.dao.DaoException;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Role_;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import it.lms.tourney.po.UserRoleClient_;

@Stateless
public class RoleDao extends BaseJPACrudDao<Role, Integer> {

    public RoleDao() throws DaoException {

        super(Role.class);
    }

    public Role getRoleById(Integer id) {

        logger.debug(logId() + "Entering getRoleById()");

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
        logger.info(logId() + info);

        List<Role> roleList = poList.stream().map(urc -> urc.getRole()).collect(Collectors.toList());

        return roleList;
    }

    /**
     * Selects all the records in the Role table, converts the got Role in their corresponding BO and returns a list of
     * that BO
     * 
     * @return the list of Role BO
     * @throws DaoException if a   problem occurs during the find operation
     */
    public List<Role> findAllRoles() {

        logger.debug(logId() + "Entering findAllRoles()");

        CriteriaQuery<Role> cq = getCb().createQuery(Role.class);

        Root<Role> root = cq.from(Role.class);

        cq = cq.select(root);
        cq = cq.orderBy(getCb().asc(root.get(Role_.name)));

        TypedQuery<Role> nq = getEm().createQuery(cq);

        List<Role> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " Role(s)] ";
        logger.info(logId() + info);

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
        logger.info(logId() + info);

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

        logger.debug(logId() + "Entering RoleDao.getById(" + id + ")");

        Role po = getPoById(id);

        return po;
    }

    public Role getPoById(Integer id) {

        Role po = findById(id);
        return po;
    }

    public void save(Role po) throws DaoException {

        if (po.isNull()) {
            logger.debug(logId() + "Inserting Role: " + po);

            insert(po);
            return;
        }

        logger.debug(logId() + "Updating Role: " + po);

        Role mpo = merge(po);
        updatePo(mpo);
    }

    /**
     * Inserts the received new user
     * 
     * @param bo the BO to save
     * @throws DaoException if a   problem occurs during the insert operation
     */
    public void insert(Role po) throws DaoException {

        logger.debug(logId() + "Entering insertPo()");

        super.insertPo(po);
    }

    /**
     * Deleted the user received as parameter
     * 
     * @param bo the BO to save
     * @throws DaoException if a   problem occurs during the delete operation
     */
    public void delete(Role po) throws DaoException {

        logger.debug(logId() + "Entering deletePo()");

        super.deletePo(po);
    }

}
