
package it.lms.tourney.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
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

        logger.debug(logId() + "Entering findDevUsers()");
        return findUsersByRole(Role.ROLES.DEVELOPER);
    }

    public List<User> findOwnerUsers() {

        logger.debug(logId() + "Entering findOwnerUsers()");
        return findUsersByRole(Role.ROLES.OWNER);
    }

    public List<User> findAdminUsers() {

        logger.debug(logId() + "Entering findAdminUsers()");
        return findUsersByRole(Role.ROLES.ADMIN);
    }

    private List<User> findUsersByRole(Role.ROLES role) {

        logger.debug(logId() + "Entering findUsersByRole()");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Join<User, UserRoleClient> urcJoin = root.join(User_.urcSet);

        Join<UserRoleClient, Role> roleJoin = urcJoin.join(UserRoleClient_.role);

        Predicate p = getCb().equal(roleJoin.get(Role_.name), role.name());

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
    public User findUserBy(String username) {

        logger.debug(logId() + "Entering findUserBy(" + username + ")");

        User po = getPoBy(username);

        return po;
    }

    public User getUserById(Integer userId) {

        logger.debug(logId() + "Entering getUserById(" + userId + ")");

        User po = super.findById(userId);

        return po;
    }

    public boolean isDeveloperUser(String username) {

        List<String> rtList = new ArrayList<>();
        rtList.add(Role.ROLES.DEVELOPER.name());
        return isUserBelongingTo(username, rtList);
    }

    public boolean isDeveloperUser(Integer userId) {

        User user = findById(userId);
        List<String> rtList = new ArrayList<>();
        rtList.add(Role.ROLES.DEVELOPER.name());
        return isUserBelongingTo(user.getUsername(), rtList);
    }

    public boolean isOwnerUser(Integer userId) {

        User user = findById(userId);
        List<String> rtList = new ArrayList<>();
        rtList.add(Role.ROLES.OWNER.name());
        return isUserBelongingTo(user.getUsername(), rtList);
    }

    public boolean isAdminUser(Integer userId) {

        User user = findById(userId);
        List<String> rtList = new ArrayList<>();
        rtList.add(Role.ROLES.ADMIN.name());
        return isUserBelongingTo(user.getUsername(), rtList);
    }

    private boolean isUserBelongingTo(String username, List<String> roles) {

        logger.debug(logId() + "Entering isUserBelongingTo()");

        String[] sa = new String[0];
        sa = roles.toArray(sa);

        return isUserBelongingTo(username, sa);
    }

    private boolean isUserBelongingTo(String username, String[] roles) {

        logger.debug(logId() + "Entering isUserBelongingTo()");

        List<String> roleList = Arrays.asList(roles);

        CriteriaQuery<UserRoleClient> cq = getCb().createQuery(UserRoleClient.class);

        Root<UserRoleClient> root = cq.from(UserRoleClient.class);

        Join<UserRoleClient, User> urcUserJoin = root.join(UserRoleClient_.user);
        Join<UserRoleClient, Role> urcRoleJoin = root.join(UserRoleClient_.role);

        Predicate p = getCb().equal(urcUserJoin.get(User_.username), username);
        Predicate q = urcRoleJoin.get(Role_.name).in(roleList);

        Predicate pAndQ = getCb().and(p, q);
        cq = cq.select(root);
        cq = cq.where(pAndQ);

        TypedQuery<UserRoleClient> nq = getEm().createQuery(cq);

        List<UserRoleClient> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " Entitys] ";
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

        CriteriaBuilder cb = getCb();
        CriteriaQuery<User> cq = cb.createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Predicate p = cb.equal(root.get(User_.username), username);
        Predicate q = cb.equal(root.get(User_.password), md5Password);

        cq = cq.select(root);
        cq = cq.where(p, q);

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

    public void insert(User po) {

        logger.debug(logId() + "Entering insert(" + po + ")");

        insertPo(po);
    }

    public void update(User po) {

        logger.debug(logId() + "Entering update(" + po + ")");

        updatePo(po);
    }

    public void delete(User po) {

        logger.debug(logId() + "Entering deletePo(" + po + ")");

        deletePo(po);
    }

}
