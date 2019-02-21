
package it.lms.tourney.dao;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import it.lms.cb.dao.BaseJPACrudDao;
import it.lms.cb.dao.DaoException;
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Role_;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import it.lms.tourney.po.UserRoleClient_;
import it.lms.tourney.po.User_;

@Stateless
public class UserDao extends BaseJPACrudDao<User, Integer> {

    public UserDao() throws DaoException {

        super(User.class);
    }

    public List<User> findDevUsers() {

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Join<User, UserRoleClient> urcJoin = root.join(User_.urcSet);

        Join<UserRoleClient, Role> roleJoin = urcJoin.join(UserRoleClient_.role);

        Predicate p = getCb().equal(roleJoin.get(Role_.name), Role.ROLES.DEVELOPER.name());

        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(logId() + info);

        return poList;
    }

    public User getPoBy(String username) {

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Predicate p = getCb().equal(root.get(User_.username), username);
        Predicate pAndQ = getCb().and(p);

        cq = cq.select(root);
        cq = cq.where(pAndQ);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(logId() + info);

        if (poList.isEmpty()) {
            return null;
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

        logger.debug(logId() + "Entering findUserBy(" + username + ")");

        User po = getPoBy(username);

        return po;
    }

    public User getUserById(Integer userId) {

        logger.debug(logId() + "Entering getUserById(" + userId + ")");

        User po = super.findById(userId);

        return po;
    }

    public boolean isDeveloperUser(String username) throws DaoException {

        List<String> rtList = new ArrayList<>();
        rtList.add(Role.ROLES.DEVELOPER.name());
        return isUserBelongingTo(username, rtList);
    }

    private boolean isUserBelongingTo(String username, List<String> roles) throws DaoException {

        logger.debug(logId() + "Entering isUserBelongingTo()");

        String[] sa = new String[0];
        sa = roles.toArray(sa);

        return isUserBelongingTo(username, sa);
    }

    private boolean isUserBelongingTo(String username, String[] roles) throws DaoException {

        logger.debug(logId() + "Entering isUserBelongingTo()");

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
        logger.info(logId() + info);

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
    public List<User> findAllUsers() {

        logger.debug(logId() + "Entering findAllUsers()");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);
        cq = cq.orderBy(getCb().asc(root.get(User_.username)));

        TypedQuery<User> tq = getEm().createQuery(cq);

        List<User> poList = tq.getResultList();
        logger.debug(logId() + "Found " + poList.size() + " User record(s)");

        return poList;
    }

    public User findUserBy(String username, String md5Password) {

        logger.debug(logId() + "Entering findUserBy(" + username + "," + md5Password + ")");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Predicate p = getCb().equal(root.get(User_.username), username);
        Predicate q = getCb().equal(root.get(User_.password), md5Password);
        Predicate pAndQ = getCb().and(p, q);
        cq.select(root).where(pAndQ);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(logId() + info);

        if (poList.isEmpty()) {
            return null;
        }

        User po = poList.get(0);
        return po;
    }

    public User findByEmail(String email) {

        logger.debug(logId() + "Entering findByEmail(" + email + ")");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Predicate p = getCb().equal(root.get(User_.email), email);
        Predicate pAndQ = getCb().and(p);
        cq.select(root).where(pAndQ);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(logId() + info);

        if (poList.isEmpty()) {
            return null;
        }

        User po = poList.get(0);
        return po;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void insert(User po) throws DaoException {

        insertPo(po);
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void update(User po) throws DaoException {

        updatePo(po);
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void delete(User po) throws DaoException {

        logger.debug(logId() + "Entering deletePo(" + po + ")");

        deletePo(po);
    }

}
