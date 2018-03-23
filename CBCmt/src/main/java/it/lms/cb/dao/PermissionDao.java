
package it.lms.cb.dao;

import java.util.List;

import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.Permission;
import it.lms.cb.po.Permission_;
import it.lms.cb.po.Resource;
import it.lms.cb.po.Resource_;
import it.lms.cb.po.Role;
import it.lms.cb.po.RoleType;
import it.lms.cb.po.RoleType_;
import it.lms.cb.po.Role_;
import it.lms.cb.po.User;
import it.lms.cb.po.User_;

public class PermissionDao extends BaseJPACrudDao<Permission, Integer> {

    private static Logger logger = LogManager.getLogger(PermissionDao.class);

    public PermissionDao() throws DaoException {

        super(Permission.class);
    }

    /**
     * Selects all the records in the Permission table, converts the got PO in their corresponding BO and returns a list
     * of that BO
     * 
     * @return the list of Permission BO
     * @throws DaoException if a problem occurs during the find operation
     */
    public List<Permission> findAllPermission() throws DaoException {

        logger.debug("Entering findAllPermission()");

        CriteriaQuery<Permission> cq = getCb().createQuery(Permission.class);

        Root<Permission> root = cq.from(Permission.class);
        Join<Permission, RoleType> roleTypeJoin = root.join(Permission_.roleType);

        cq = cq.select(root);
        cq = cq.orderBy(getCb().asc(roleTypeJoin.get(RoleType_.name)));

        TypedQuery<Permission> nq = getEm().createQuery(cq);

        List<Permission> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        return poList;
    }

    /**
     * Selects the PO corresponding to the received id, converts it in its corresponding BO and return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public Permission getById(Integer id) throws DaoException {

        logger.debug("Entering RoleTypeDao.getById(" + id + ")");

        Permission po = getPoById(id);

        return po;
    }

    public Permission getPoById(Integer id) throws DaoException {

        Permission po = findById(id);
        return po;
    }

    public Permission findBy(String resourceId, User u) {

        CriteriaQuery<Permission> cq = getCb().createQuery(Permission.class);

        Root<Resource> root = cq.from(Resource.class);
        Join<Resource, Permission> permissionJoin = root.join(Resource_.permissions);
        Join<Permission, RoleType> roleTypeJoin = permissionJoin.join(Permission_.roleType);
        Join<RoleType, Role> roleJoin = roleTypeJoin.join(RoleType_.roles);
        Join<Role, User> userJoin = roleJoin.join(Role_.users);

        Predicate p = getCb().equal(root.get(Resource_.name), resourceId);
        Predicate q = getCb().equal(userJoin.get(User_.id), u.getId());
        Predicate pAndQ = getCb().and(p, q);

        cq = cq.select(permissionJoin);
        cq = cq.where(pAndQ);

        TypedQuery<Permission> nq = getEm().createQuery(cq);

        List<Permission> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        if (poList.isEmpty()) {
            return null;
        }

        Permission po = poList.get(0);
        return po;
    }

    protected Permission getPoByName(String name) throws NoDataFoundException {

        logger.debug("Entering getPoByName(" + name + ")");

        String nq = "Permission.findByName";

        TypedQuery<Permission> q = getEm().createNamedQuery(nq, Permission.class);
        q.setParameter("name", name);

        List<Permission> poList = q.getResultList();

        int size = 0;
        if (poList != null && poList.size() != 0) {
            size = poList.size();
        }

        String msg = "[createNamedQuery(" + nq + ") found " + size + " record(s)]";
        logger.info(msg);

        if (size == 0) {
            msg = "find successful, but no data found.";
            logger.warn(msg);
            throw new NoDataFoundException(msg);
        }

        Permission po = poList.get(0);
        return po;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void save(Permission po) throws DaoException {

        if (po.isNull()) {
            logger.debug("Inserting PO: " + po);

            insert(po);
            return;
        }

        logger.debug("Updating PO: " + po);

        Permission mpo = merge(po);
        update(mpo);
    }

    /**
     * Inserts the received new user
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the insert operation
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void insertPo(Permission po) throws DaoException {

        logger.debug("Entering insertPo()");

        try {
            super.insert(po);
            logger.debug("Insert of " + po + " successful");
        } catch (Exception e) {
            String msg = "Insert of " + po + " failed";
            logger.error(msg, e);
            throw new DaoException(msg);
        }
    }

    /**
     * Deleted the user received as parameter
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the delete operation
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void deletePo(Permission po) throws DaoException {

        logger.debug("Entering deletePo()");

        try {
            super.delete(po);
            logger.debug("Delete of " + po.getId() + " successful");
        } catch (Exception e) {
            String msg = "Delete of " + po.getId() + " failed";
            logger.error(msg, e);
            throw new DaoException(msg);
        }
    }
}
