
package it.lms.tourney.dao;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

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
import it.lms.tourney.po.Role;
import it.lms.tourney.po.Role_;
import it.lms.tourney.po.Tourney;
import it.lms.tourney.po.Tourney_;
import it.lms.tourney.po.User;
import it.lms.tourney.po.UserRoleClient;
import it.lms.tourney.po.UserRoleClient_;
import it.lms.tourney.po.User_;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UserDao extends BaseJPACrudDao<User, Integer> {

    private static final String MD5_DEFAULT_PASSWORD = "4A97D80A588D25719C729A43B51AA9FC"; // = torneionline

    public UserDao() throws DaoException {

        super(User.class);
    }

    public List<User> findDevUsers() {

        log.debug(logId() + "Entering findDevUsers()");
        return findUsersByRole(Role.ROLES.DEVELOPER);
    }

    public List<User> findOwnerUsers() {

        log.debug(logId() + "Entering findOwnerUsers()");
        return findUsersByRole(Role.ROLES.OWNER);
    }

    public List<User> findAdminUsers() {

        log.debug(logId() + "Entering findAdminUsers()");
        return findUsersByRole(Role.ROLES.ADMIN);
    }

    private List<User> findUsersByRole(Role.ROLES role) {

        log.debug(logId() + "Entering findUsersByRole()");

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
        log.info(logId() + info);

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
        log.info(logId() + info);

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

        log.debug(logId() + "Entering findUserBy(" + username + ")");

        User po = getPoBy(username);

        return po;
    }

    public User getUserById(Integer userId) {

        log.debug(logId() + "Entering getUserById(" + userId + ")");

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

        log.debug(logId() + "Entering isUserBelongingTo()");

        String[] sa = new String[0];
        sa = roles.toArray(sa);

        return isUserBelongingTo(username, sa);
    }

    private boolean isUserBelongingTo(String username, String[] roles) {

        log.debug(logId() + "Entering isUserBelongingTo()");

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
        String info = "[Found " + poList.size() + " User(s)] ";
        log.info(logId() + info);

        if (poList.isEmpty()) {
            return false;
        }

        return true;
    }

    /**
     * Verifies if the received user has ad least the ADMIN role for the recevied client id
     * 
     * @param clientId the client owner of the user
     * @param loggedUserId the logged user id
     * @return true if the user is at lead ADMIN for the client id
     */
    public boolean isAtLeastAdmin(Integer clientId, Integer loggedUserId) {

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Join<User, UserRoleClient> urcJoin = root.join(User_.urcSet);
        Join<UserRoleClient, Client> clientJoin = urcJoin.join(UserRoleClient_.client);
        Join<UserRoleClient, Role> roleJoin = urcJoin.join(UserRoleClient_.role);

        Predicate p1 = getCb().equal(root.get(User_.id), loggedUserId);
        Predicate p2 = getCb().equal(clientJoin.get(Client_.id), clientId);
        Predicate p3 = roleJoin.get(Role_.name).in(Role.ROLES.DEVELOPER.name(), Role.ROLES.OWNER.name(),
                Role.ROLES.ADMIN.name());

        Predicate pAndQ = getCb().and(p1, p2, p3);
        cq = cq.select(root);
        cq = cq.where(pAndQ);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        log.info(logId() + info);

        if (poList.isEmpty()) {
            return false;
        }
        return true;
    }

    public List<User> findAllUsersAtLeastOperator() {

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Join<User, UserRoleClient> urcJoin = root.join(User_.urcSet);
        Join<UserRoleClient, Role> roleJoin = urcJoin.join(UserRoleClient_.role);

        Predicate p1 = roleJoin.get(Role_.name).in(Role.ROLES.DEVELOPER.name(), Role.ROLES.OWNER.name(),
                Role.ROLES.ADMIN.name(), Role.ROLES.OPERATOR.name());

        Predicate pAndQ = getCb().and(p1);
        cq = cq.select(root);
        cq = cq.where(pAndQ);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        log.info(logId() + info);

        return poList;
    }

    /**
     * Selects all users having ADMIN and USER role type and role name not SYS admin
     * 
     * @return the selected list
     * @throws DaoException if any error
     */
    public List<User> findAllUsers() {

        log.debug(logId() + "Entering findAllUsers()");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);
        cq = cq.orderBy(getCb().asc(root.get(User_.username)));

        TypedQuery<User> tq = getEm().createQuery(cq);

        List<User> poList = tq.getResultList();
        log.debug(logId() + "Found " + poList.size() + " User record(s)");

        return poList;
    }

    public User findUserBy(String username, String md5Password) {

        log.debug(logId() + "Entering findUserBy(" + username + "," + md5Password + ")");

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
        log.info(logId() + info);

        if (poList.isEmpty()) {
            return null;
        }

        User po = poList.get(0);
        return po;
    }

    public User findByEmail(String email) {

        log.debug(logId() + "Entering findByEmail(" + email + ")");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Predicate p = getCb().equal(root.get(User_.email), email);
        Predicate pAndQ = getCb().and(p);
        cq.select(root).where(pAndQ);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        log.info(logId() + info);

        if (poList.isEmpty()) {
            return null;
        }

        User po = poList.get(0);
        return po;
    }

    public void insert(User po) {

        log.debug(logId() + "Entering insert(" + po + ")");

        insertPo(po);
    }

    public void update(User po) {

        log.debug(logId() + "Entering update(" + po + ")");

        updatePo(po);
    }

    public void delete(User po) throws DaoException {

        log.debug(logId() + "Entering delete(" + po + ")");
        // UserRoleClientDao dao = new UserRoleClientDao();
        // for (UserRoleClient urc : po.getUrcSet()) {
        // dao.delete(urc);
        // }

        deletePo(po);
    }

    public User getFollowerLike(String followerUseName, Integer clientId) {

        log.debug(logId() + "Entering getFollowerLike(" + followerUseName + ")");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);

        Join<User, UserRoleClient> urcJoin = root.join(User_.urcSet);
        Join<UserRoleClient, Role> roleJoin = urcJoin.join(UserRoleClient_.role);
        Join<UserRoleClient, Client> clientJoin = urcJoin.join(UserRoleClient_.client);

        Predicate p1 = getCb().like(root.get(User_.username), followerUseName);
        Predicate p2 = getCb().equal(roleJoin.get(Role_.name), Role.ROLES.FOLLOWER.name());
        Predicate p3 = getCb().notEqual(clientJoin.get(Client_.id), clientId);

        cq = cq.select(root);
        cq = cq.where(p1, p2, p3);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        log.info(logId() + info);

        if (poList.isEmpty()) {
            return null;
        }

        User po = poList.get(0);
        return po;
    }

    public User getFollowerByTourneyID(Integer tourneyId, Integer clientId) {

        log.debug(logId() + "Entering getFollowerByTourneyID() [{}] [{}]", tourneyId, clientId);

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<Tourney> root = cq.from(Tourney.class);
        Join<Tourney, UserRoleClient> urcJoin = root.join(Tourney_.urcs);
        Join<UserRoleClient, User> userJoin = urcJoin.join(UserRoleClient_.user);
        Join<UserRoleClient, Role> roleJoin = urcJoin.join(UserRoleClient_.role);
        Join<UserRoleClient, Client> clientJoin = urcJoin.join(UserRoleClient_.client);

        Predicate p1 = getCb().equal(root.get(Tourney_.id), tourneyId);
        Predicate p2 = getCb().equal(roleJoin.get(Role_.name), Role.ROLES.FOLLOWER.name());
        Predicate p3 = getCb().equal(clientJoin.get(Client_.id), clientId);

        cq = cq.select(userJoin);
        cq = cq.where(p1, p2, p3);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        log.info(logId() + info);

        if (poList.isEmpty()) {
            return null;
        }

        User po = poList.get(0);
        return po;
    }

    /**
     * Creates a new default follower user for the new tourney and recevied client
     * 
     * @param followerUserName the user name for the new follower user
     * @param cpo the client owner of the tourney
     * @return the new follower user
     * @throws NoSuchAlgorithmException if any run time error
     */
    public User newFollowerUser(String followerUserName, Client cpo) {

        User upo = new User();
        upo.setUrcSet(new HashSet<>());
        upo.setUsername(followerUserName);

        String md5 = MD5_DEFAULT_PASSWORD.toUpperCase();
        upo.setPassword(md5);

        upo.setCountry(cpo.getCountry());
        upo.setDescription("Follower user");
        upo.setAddress(cpo.getAddress());
        upo.setEmail(cpo.getEmail());
        upo.setLastname(Role.ROLES.FOLLOWER.name());
        upo.setFirstname(followerUserName);
        upo.setPhoneNumber(cpo.getPhoneNumber());

        insert(upo);
        return upo;
    }

}
