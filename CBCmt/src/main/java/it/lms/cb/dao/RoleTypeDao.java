
package it.lms.cb.dao;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.RoleType;
import it.lms.cb.po.RoleType_;

public class RoleTypeDao extends BaseJPACrudDao<RoleType, Integer> {

    private static Logger logger = LogManager.getLogger(RoleTypeDao.class);

    public RoleTypeDao() throws DaoException {

        super(RoleType.class);
    }

    /**
     * Selects all the records in the RoleType table, converts the got PO in their corresponding BO and returns a list
     * of that BO
     * 
     * @return the list of RoleType BO
     * @throws DaoException if a problem occurs during the find operation
     */
    public List<RoleType> findAllRoleTypes() throws DaoException {

        logger.debug("Entering findAllRoleTypes()");

        List<RoleType> poList = findAllPo();

        return poList;
    }

    public static List<RoleType> findInitialRoleTypes() throws DaoException {

        RoleTypeDao dao = new RoleTypeDao();

        List<String> irt = RoleType.initialRoleTypes();

        return dao.findRoleTypes(irt);
    }

    /**
     * Selects the PO corresponding to the received id, converts it in its corresponding BO and return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public RoleType getById(Integer id) throws DaoException {

        logger.debug("Entering RoleTypeDao.getById(" + id + ")");

        RoleType po = getPoById(id);

        return po;
    }

    public RoleType getPoById(Integer id) throws DaoException {

        RoleType po = findById(id);
        return po;
    }

    public RoleType getRoleTypeBy(String roleTypeName) throws DaoException {

        List<String> roleNames = new ArrayList<>();

        roleNames.add(roleTypeName);

        List<RoleType> rtList = findRoleTypes(roleNames);
        if (rtList.isEmpty()) {
            return null;
        }

        return rtList.get(0);
    }

    public List<RoleType> findRoleTypes(List<String> roleTypeNames) throws DaoException {

        CriteriaQuery<RoleType> cq = cb.createQuery(RoleType.class);

        Root<RoleType> root = cq.from(RoleType.class);

        List<Predicate> predicates = new ArrayList<Predicate>();
        for (String key : roleTypeNames) {
            predicates.add(cb.equal(root.get(RoleType_.name), key));
        }

        cq = cq.select(root);

        cq.where(cb.or(predicates.toArray(new Predicate[0])));

        TypedQuery<RoleType> nq = em.createQuery(cq);

        List<RoleType> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        return poList;
    }

    public static void staticSave(RoleType po) throws DaoException {

        RoleTypeDao dao = new RoleTypeDao();
        dao.save(po);
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void save(RoleType po) throws DaoException {

        if (po.isNull()) {
            logger.debug("Inserting PO: " + po.getName());

            insert(po);
            return;
        }

        logger.debug("Updating PO: " + po.getName());

        RoleType mpo = merge(po);
        update(mpo);
    }

    /**
     * Inserts the received new user
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the insert operation
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void insertPo(RoleType po) throws DaoException {

        logger.debug("Entering insertPo()");

        try {
            super.insert(po);
            logger.debug("Insert of " + po.getName() + " successful");
        } catch (Exception e) {
            String msg = "Insert of " + po.getName() + " failed";
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
    public void deletePo(RoleType po) throws DaoException {

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

    private List<RoleType> findAllPo() throws DaoException {

        List<RoleType> poList = findAllOrderByAsc(RoleType_.name.getName());

        if (poList == null || poList.size() == 0) {
            logger.error("Unable to find a RoleType in the DB");
            return new ArrayList<RoleType>();
        }

        logger.debug(poList.size() + " RoleType found(s)");

        return poList;
    }

}
