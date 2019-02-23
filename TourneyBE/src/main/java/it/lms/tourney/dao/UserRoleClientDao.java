
package it.lms.tourney.dao;

import java.util.List;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
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
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import it.lms.tourney.po.UserRoleClient_;
import it.lms.tourney.po.User_;

@Stateless
public class UserRoleClientDao extends BaseJPACrudDao<UserRoleClient, Integer> {

    public UserRoleClientDao() throws DaoException {

        super(UserRoleClient.class);
    }

    public List<Client> findClientByUserId(Integer userId) {

        logger.debug(logId() + "Entering findClientByUserId()");

        CriteriaBuilder cb = getCb();

        CriteriaQuery<Client> cq = cb.createQuery(Client.class);
        Root<Client> root = cq.from(Client.class);

        Join<Client, UserRoleClient> clientUrcJoin = root.join(Client_.urcSet);
        Join<UserRoleClient, User> urcUserJoin = clientUrcJoin.join(UserRoleClient_.user);

        Predicate p = cb.equal(urcUserJoin.get(User_.id), userId);

        cq = cq.select(root);
        cq = cq.where(p);

        cq = cq.orderBy(cb.asc(root.get(Client_.businessName)));

        TypedQuery<Client> tq = getEm().createQuery(cq);

        List<Client> resultList = tq.getResultList();

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
     * @throws DaoException if a problem occurs during the insert operation
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void insert(UserRoleClient po) {

        logger.debug(logId() + "Entering insertPo()");

        super.insertPo(po);
    }

    /**
     * Deleted the user received as parameter
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the delete operation
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void delete(UserRoleClient po) {

        logger.debug(logId() + "Entering deletePo()");

        super.deletePo(po);
    }
}
