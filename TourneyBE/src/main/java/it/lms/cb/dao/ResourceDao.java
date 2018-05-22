
package it.lms.cb.dao;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.TypedQuery;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.Resource;
import it.lms.cb.po.RoleType_;

@Stateless
public class ResourceDao extends BaseJPACrudDao<Resource, Integer> {

    private static Logger logger = LogManager.getLogger(ResourceDao.class);

    public ResourceDao() throws DaoException {

        super(Resource.class);
    }

    /**
     * Selects all the records in the Resource table, converts the got PO in their corresponding BO and returns a list
     * of that BO
     * 
     * @return the list of Resource BO
     * @throws DaoException if a problem occurs during the find operation
     */
    public List<Resource> findAllRoles() throws DaoException {

        logger.debug("Entering findAllRoles()");

        List<Resource> poList = findAllPo();

        return poList;
    }

    /**
     * Selects the PO corresponding to the received id, converts it in its corresponding BO and return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public Resource getById(Integer id) throws DaoException {

        logger.debug("Entering RoleTypeDao.getById(" + id + ")");

        Resource po = getPoById(id);

        return po;
    }

    public Resource getPoById(Integer id) throws DaoException {

        Resource po = findById(id);
        return po;
    }

    public List<Resource> findRoleTypes(String[] names) throws DaoException {

        logger.debug("Entering findRoleTypes()");

        List<Resource> roleList = new ArrayList<Resource>();

        for (int i = 0; i < names.length; i++) {
            String name = names[i];
            Resource po = getPoByName(name);
            roleList.add(po);
        }
        return roleList;
    }

    protected Resource getPoByName(String name) throws NoDataFoundException {

        logger.debug("Entering getPoByName(" + name + ")");

        String nq = "Resource.findByName";

        TypedQuery<Resource> q = getEm().createNamedQuery(nq, Resource.class);
        q.setParameter("name", name);

        List<Resource> poList = q.getResultList();

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

        Resource po = poList.get(0);
        return po;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void save(Resource po) throws DaoException {

        if (po.isNull()) {
            logger.debug("Inserting PO: " + po);

            insert(po);
            return;
        }

        logger.debug("Updating PO: " + po);

        Resource mpo = merge(po);
        update(mpo);
    }

    /**
     * Inserts the received new user
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the insert operation
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void insertPo(Resource po) throws DaoException {

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
    public void deletePo(Resource po) throws DaoException {

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

    private List<Resource> findAllPo() throws DaoException {

        List<Resource> poList = findAllOrderByAsc(RoleType_.name.getName());

        if (poList == null || poList.size() == 0) {
            logger.error("Unable to find a Resource in the DB");
            return new ArrayList<Resource>();
        }

        logger.debug(poList.size() + " Resource found(s)");

        return poList;
    }

}
