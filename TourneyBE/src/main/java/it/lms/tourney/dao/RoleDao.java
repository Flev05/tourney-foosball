
package it.lms.tourney.dao;

import java.util.List;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.cb.dao.DaoException;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Role_;

@Stateless
public class RoleDao extends BaseJPACrudDao<Role, Integer> {

    private static Logger logger = LogManager.getLogger(RoleDao.class);

    public RoleDao() throws DaoException {

        super(Role.class);
    }

    public Role getRoleById(Integer id) throws DaoException {

        logger.debug("Entering getRoleById()");

        Role role = getById(id);

        return role;
    }

    /**
     * Selects all the records in the Role table, converts the got Role in their corresponding BO and returns a list of
     * that BO
     * 
     * @return the list of Role BO
     * @throws DaoException if a problem occurs during the find operation
     */
    public List<Role> findAllRoles() throws DaoException {

        logger.debug("Entering findAllRoles()");

        CriteriaQuery<Role> cq = getCb().createQuery(Role.class);

        Root<Role> root = cq.from(Role.class);

        cq = cq.select(root);
        cq = cq.orderBy(getCb().asc(root.get(Role_.name)));

        TypedQuery<Role> nq = getEm().createQuery(cq);

        List<Role> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " Role(s)] ";
        logger.info(info);

        return poList;
    }

    /**
     * Selects the Role corresponding to the received id, converts it in its corresponding BO and return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public Role getById(Integer id) throws DaoException {

        logger.debug("Entering RoleDao.getById(" + id + ")");

        Role po = getPoById(id);

        return po;
    }

    public Role getPoById(Integer id) throws DaoException {

        Role po = findById(id);
        return po;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void save(Role po) throws DaoException {

        if (po.isNull()) {
            logger.debug("Inserting Role: " + po);

            insert(po);
            return;
        }

        logger.debug("Updating Role: " + po);

        Role mpo = merge(po);
        updatePo(mpo);
    }

    /**
     * Inserts the received new user
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the insert operation
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void insert(Role po) throws DaoException {

        logger.debug("Entering insertPo()");

        try {
            super.insertPo(po);
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
    public void delete(Role po) throws DaoException {

        logger.debug("Entering deletePo()");

        try {
            super.deletePo(po);
            logger.debug("Delete of " + po + " successful");
        } catch (Exception e) {
            String msg = "Delete of " + po + " failed";
            logger.error(msg, e);
            throw new DaoException(msg);
        }
    }
}
