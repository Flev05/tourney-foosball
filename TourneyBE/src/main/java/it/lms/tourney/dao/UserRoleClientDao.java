
package it.lms.tourney.dao;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.cb.dao.DaoException;
import it.lms.tourney.po.UserRoleClient;
import it.lms.tourney.po.UserRoleClient_;

@Stateless
public class UserRoleClientDao extends BaseJPACrudDao<UserRoleClient, Integer> {

    public UserRoleClientDao() throws DaoException {

        super(UserRoleClient.class);
    }

    /**
     * Only for developer users
     * 
     * @return all the clients in the system
     */
    public List<UserRoleClient> findAllClients() {

        logger.debug(logId() + "Entering findAllClients()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
        Root<UserRoleClient> root = cq.from(UserRoleClient.class);

        cq = cq.distinct(true);
        cq = cq.select(root);

        TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

        List<UserRoleClient> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    public List<UserRoleClient> findByUserId(Integer userId) {

        logger.debug(logId() + "Entering findByUserId()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<UserRoleClient> cq = cb.createQuery(UserRoleClient.class);
        Root<UserRoleClient> root = cq.from(UserRoleClient.class);

        Predicate p = getCb().equal(root.get(UserRoleClient_.id), userId);

        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<UserRoleClient> tq = getEm().createQuery(cq);

        List<UserRoleClient> resultList = tq.getResultList();

        logger.debug(logId() + "[Found " + resultList.size() + " Entities]");

        return resultList;
    }

    public void update(UserRoleClient po) {

        logger.debug(logId() + "Updating Role: " + po);

        super.updatePo(po);
    }

    /**
     * Inserts the received new user
     * 
     * @param bo the BO to save
     * @throws DaoException if a   problem occurs during the insert operation
     */
    public void insert(UserRoleClient po) {

        logger.debug(logId() + "Entering insertPo()");

        super.insertPo(po);
    }

    /**
     * Deleted the user received as parameter
     * 
     * @param bo the BO to save
     * @throws DaoException if a   problem occurs during the delete operation
     */
    public void delete(UserRoleClient po) {

        logger.debug(logId() + "Entering deletePo()");

        super.deletePo(po);
    }

}
