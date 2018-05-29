
package it.lms.cb.dao;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.tourney.po.Role;
import it.lms.tourney.po.User;
import it.lms.tourney.po.User_;

@Stateless
public class UserDao extends BaseJPACrudDao<User, Integer> {

    private static Logger logger = LogManager.getLogger(UserDao.class);

    public UserDao() throws DaoException {

        super(User.class);
    }

    public User getPoBy(String username) throws DaoException {

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Predicate p = getCb().equal(root.get(User_.username), username);
        Predicate pAndQ = getCb().and(p);

        cq = cq.select(root);
        cq = cq.where(pAndQ);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        if (poList.isEmpty()) {
            throw new NoDataFoundException(info);
        }

        User po = poList.get(0);
        return po;
    }

    /**
     * Selects the record from the User using the receives parameter, converts the got User in its corresponding BO and
     * return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public User findUserBy(String username) throws DaoException {

        logger.debug("Entering findUserBy(" + username + ")");

        User po = getPoBy(username);

        return po;
    }

    public User findUserBy(String username, String md5Password) throws DaoException {

        logger.debug("Entering findUserBy(" + username + "," + md5Password + ")");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Predicate p = getCb().equal(root.get(User_.username), username);
        Predicate q = getCb().equal(root.get(User_.password), md5Password);
        Predicate pAndQ = getCb().and(p, q);
        cq.select(root).where(pAndQ);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        if (poList.isEmpty()) {
            throw new NoDataFoundException(info);
        }

        User po = poList.get(0);
        return po;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public User getUserById(Integer userId) throws DaoException {

        logger.debug("Entering getUserById(" + userId + ")");

        User po = super.findById(userId);

        return po;
    }

    public boolean isDeveloperUser(String username) throws DaoException {

        List<String> rtList = new ArrayList<>();
        rtList.add(Role.ROLES.DEVELOPER.name());
        return isUserBelongingTo(username, rtList);
    }

    private boolean isUserBelongingTo(String username, List<String> roles) throws DaoException {

        logger.debug("Entering isUserBelongingTo()");

        String[] sa = new String[0];
        sa = roles.toArray(sa);

        return isUserBelongingTo(username, sa);
    }

    private boolean isUserBelongingTo(String username, String[] roles) throws DaoException {

        logger.debug("Entering isUserBelongingTo()");

        List<String> roleList = new ArrayList<>();
        for (String s : roles) {
            roleList.add(s);
        }

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Predicate p = getCb().equal(root.get(User_.username), username);

        Predicate pAndQ = getCb().and(p);
        cq = cq.select(root);
        cq = cq.where(pAndQ);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        if (poList.isEmpty()) {
            return false;
        }

        return true;
    }

    /**
     * Selects all users having ADMIN and USER role type and role name not SYS admin
     * 
     * @return the selected list
     * @throws DaoException if any error
     */
    public List<User> findAllUsers() throws DaoException {

        logger.debug("Entering findAllUsers()");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);
        cq = cq.orderBy(getCb().asc(root.get(User_.username)));

        TypedQuery<User> tq = getEm().createQuery(cq);

        List<User> poList = tq.getResultList();
        logger.debug("Found " + poList.size() + " User record(s)");

        return poList;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public User insertPo(User po) throws DaoException {

        insert(po);

        return po;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public User updatePo(User po) throws DaoException {

        User mpo = merge(po);
        update(mpo);

        return po;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void deletePo(User po) throws DaoException {

        logger.debug("Entering deletePo(" + po + ")");

        Iterator<Role> it = po.getRoles().iterator();
        while (it.hasNext()) {
            it.next();
            it.remove();
        }

        User mpo = merge(po);
        delete(mpo);
    }

}
