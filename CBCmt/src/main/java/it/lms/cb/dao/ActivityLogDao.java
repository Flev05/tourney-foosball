
package it.lms.cb.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.ActivityLog;
import it.lms.cb.po.ActivityLog_;
import it.lms.cb.po.User;

public class ActivityLogDao extends BaseJPACrudDao<ActivityLog, Integer> {

    private static Logger logger = LogManager.getLogger(ActivityLogDao.class);

    public ActivityLogDao() throws DaoException {

        super(ActivityLog.class);
    }

    /**
     * Selects the record from the DC corresponding to the received cf, converts the got PO in its corresponding BO and
     * return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public ActivityLog getById(Integer id) throws DaoException {

        logger.debug("Entering getById(" + id + ")");

        ActivityLog po = getActivityLog(id);

        return po;
    }

    /**
     * Selects all the records in the ActivityLog table, converts the got PO in their corresponding BO and returns a
     * list of that BO
     * 
     * @return the list of ActivityLog BO
     * @throws DaoException if a problem occurs during the delete operation
     */
    public List<ActivityLog> findAllActivityLog() throws DaoException {

        logger.debug("Entering findAllActivityLog()");

        List<ActivityLog> poList = findAllPo();

        return poList;
    }

    /**
     * Selects the activity log in the range of the received dates
     * 
     * @param beginDate the begin date
     * @param endDate the end date
     * @return the list of the found activity log
     */
    public List<ActivityLog> findActivityLog(Date beginDate, Date endDate) {

        logger.debug("Entering findActivityLog()");

        CriteriaQuery<ActivityLog> cq = cb.createQuery(ActivityLog.class);

        Root<ActivityLog> root = cq.from(ActivityLog.class);

        Predicate p1 = cb.between(root.get(ActivityLog_.creationDate), beginDate, endDate);

        cq = cq.select(root);

        cq.where(p1);

        TypedQuery<ActivityLog> nq = em.createQuery(cq);

        List<ActivityLog> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " ActivityLog(s)] ";
        logger.info(info);

        return poList;
    }

    /**
     * Deleted the ActivityLog entity selected by the received parameter
     * 
     * @param id
     * @throws DaoException if any error
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void deletePo(ActivityLog po) throws DaoException {

        ActivityLog mpo = merge(po);
        delete(mpo);
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void deleteByUser(User upo) throws DaoException {

        logger.debug("Entering deleteByUser()");

        TypedQuery<ActivityLog> q = em.createNamedQuery("User.deleteByUser", ActivityLog.class);
        q.setParameter("user", upo);

        int recs = q.executeUpdate();
        logger.info("Deleted " + recs + " objects");
    }

    /**
     * Inserts the ActivityLog entity received as parameter
     * 
     * @param po the entity to insert
     * @throws DaoException if any error
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void save(ActivityLog ppo) throws DaoException {

        if (ppo.getId() == null || ppo.getId() == 0) {
            insert(ppo);
        } else {
            ActivityLog mpo = merge(ppo);
            update(mpo);
        }
    }

    private ActivityLog getActivityLog(Integer id) throws DaoException {

        ActivityLog po;
        try {
            po = getPoById(id);
        } catch (NoDataFoundException e) {
            logger.error("No data found, return null");
            return null;
        }

        return po;
    }

    private ActivityLog getPoById(Integer id) throws DaoException {

        ActivityLog po = findById(id);
        return po;
    }

    private List<ActivityLog> findAllPo() throws DaoException {

        List<ActivityLog> poList = findAllOrderByDesc(ActivityLog_.creationDate.getName());

        if (poList == null || poList.size() == 0) {
            logger.error("Unable to find a ActivityLog in the DB");
            return new ArrayList<ActivityLog>();
        }

        logger.debug(poList.size() + " ActivityLog found(s)");

        return poList;
    }
}
