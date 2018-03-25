
package it.lms.cb.dao;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.AbstractRole;
import it.lms.cb.po.Company;
import it.lms.cb.po.Company_;
import it.lms.cb.po.Role;
import it.lms.cb.po.RoleType;
import it.lms.cb.po.RoleType_;
import it.lms.cb.po.Role_;
import it.lms.cb.po.User;
import it.lms.cb.po.User_;

@Stateless
public class UserDao extends BaseJPACrudDao<User, Integer> {

    private static Logger logger = LogManager.getLogger(UserDao.class);

    @Inject
    private PersonDao     pdao;
    @Inject
    private RoleDao       rdao;

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

    public List<User> findAgencyUsers(Company company, Role br) {

        logger.debug("Entering findAgencyUsers()");

        return findUsersBy(company, RoleType.ROLES.AGENCY, br);
    }

    private List<User> findUsersBy(Company company, RoleType.ROLES roleType, Role br) {

        logger.debug("Entering findUsersBy()");

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);
        Join<User, Role> roleJoin = root.join(User_.roles);
        Join<Role, RoleType> rtJoin = roleJoin.join(Role_.roleType);

        Predicate p1 = getCb().equal(roleJoin.get(Role_.id), br.getId());
        Predicate p2 = getCb().equal(roleJoin.get(Role_.company), company);
        Predicate p3 = getCb().equal(rtJoin.get(RoleType_.name), roleType);

        cq = cq.select(root);
        cq = cq.where(p1, p2, p3);
        cq = cq.orderBy(getCb().asc(root.get(User_.username)));

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        return poList;
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

    public User getDeveloperUser() throws DaoException {

        return findDeveloperUsers().get(0);
    }

    public List<User> findDeveloperUsers() throws DaoException {

        logger.debug("Entering findDeveloperUsers()");

        List<String> rtList = new ArrayList<String>();
        rtList.add(RoleType.ROLES.DEVELOPER.name());

        List<User> users = findUserByRoleType(rtList);

        return users;
    }

    public List<User> findAdminUsers() throws DaoException {

        logger.debug("Entering findAdminUsers()");

        List<String> adminRoles = new ArrayList<String>();
        adminRoles.add(RoleType.ROLES.ADMIN.name());

        List<User> users = findUserByRoleType(adminRoles);

        return users;
    }

    public List<User> findAgencyUsers(Company company) throws DaoException {

        logger.debug("Entering findAgencyUsers()");

        List<String> adminRoles = new ArrayList<String>();
        adminRoles.add(RoleType.ROLES.AGENCY.name());

        List<User> users = findUserByRoleType(adminRoles);

        return users;
    }

    private List<User> findOwnerUsersOf(Company company) throws DaoException {

        logger.debug("Entering findOwnerUsersOf()");

        List<String> roles = new ArrayList<String>();
        roles.add(RoleType.getOwnerRoleType());

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);
        Join<User, Role> roleJoin = root.join(User_.roles);
        Join<Role, RoleType> roleTypeJoin = roleJoin.join(Role_.roleType);

        Predicate p1 = roleTypeJoin.get(RoleType_.name).in(roles);
        Predicate p2 = getCb().equal(roleJoin.get(Role_.company), company);

        cq = cq.select(root);
        cq = cq.where(p1, p2);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        return poList;
    }

    private List<User> findUserByRoleType(List<String> roleList) throws DaoException {

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);
        Join<User, Role> roleJoin = root.join(User_.roles);
        Join<Role, RoleType> roleTypeJoin = roleJoin.join(Role_.roleType);

        Predicate p = roleTypeJoin.get(RoleType_.name).in(roleList);

        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<User> nq = getEm().createQuery(cq);

        List<User> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        return poList;
    }

    public boolean isOperator(User upo) throws DaoException {

        logger.debug("Entering isOperator(" + upo + ")");

        List<String> rtList = new ArrayList<String>();
        rtList.add(RoleType.ROLES.OPERATOR.name());

        List<Role> poList = getRolesBy(upo, rtList);

        if (poList.isEmpty()) {
            return false;
        }

        return true;
    }

    public boolean isPassenger(User upo) throws DaoException {

        logger.debug("Entering isPassenger(" + upo + ")");

        List<String> rtList = new ArrayList<String>();
        rtList.add(RoleType.ROLES.PASSENGER.name());

        List<Role> poList = getRolesBy(upo, rtList);

        if (poList.isEmpty()) {
            return false;
        }

        return true;
    }

    public boolean isDeveloperUser(String username) throws DaoException {

        List<String> rtList = new ArrayList<>();
        rtList.add(RoleType.ROLES.DEVELOPER.name());
        return isUserBelongingTo(username, rtList);
    }

    public boolean isAgencyUser(String username) throws DaoException {

        List<String> rtList = new ArrayList<>();
        rtList.add(RoleType.ROLES.AGENCY.name());

        List<String> adminRoles = new ArrayList<>();
        adminRoles.add(RoleType.ROLES.DEVELOPER.name());
        adminRoles.add(RoleType.ROLES.OWNER.name());
        adminRoles.add(RoleType.ROLES.ADMIN.name());

        List<User> users = findUserByRoleType(adminRoles);
        Set<Integer> userIdSet = new HashSet<>();
        users.forEach(po -> {
            userIdSet.add(po.getId());
        });

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);
        Join<User, Role> roleJoin = root.join(User_.roles);
        Join<Role, RoleType> roleTypeJoin = roleJoin.join(Role_.roleType);

        Predicate p1 = getCb().equal(root.get(User_.username), username);

        Predicate p2 = roleTypeJoin.get(RoleType_.name).in(rtList);

        Predicate in = root.get(User_.id).in(userIdSet);
        Predicate notIn = getCb().not(in);

        cq = cq.select(root);
        cq = cq.where(p1, p2, notIn);

        TypedQuery<User> tq = getEm().createQuery(cq);

        List<User> poList = tq.getResultList();
        logger.debug("Found " + poList.size() + " User record(s)");

        return !poList.isEmpty();
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
        Join<User, Role> roleJoin = root.join(User_.roles);
        Join<Role, RoleType> roleTypeJoin = roleJoin.join(Role_.roleType);

        Predicate p = getCb().equal(root.get(User_.username), username);

        Predicate q = roleTypeJoin.get(RoleType_.name).in(roleList);

        Predicate pAndQ = getCb().and(p, q);
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

    public Company getCompanyBy(String username) {

        logger.debug("Entering getCompanyBy()");

        CriteriaQuery<Company> cq = getCb().createQuery(Company.class);
        Root<Company> root = cq.from(Company.class);

        Join<Company, Role> roleJoin = root.join(Company_.roles);

        Join<Role, User> userJoin = roleJoin.join(Role_.users);

        Predicate p = getCb().equal(userJoin.get(User_.username), username);
        cq = cq.select(root);
        cq = cq.where(p);

        TypedQuery<Company> tq = getEm().createQuery(cq);

        List<Company> poList = tq.getResultList();
        logger.debug("Found " + poList.size() + " Company record(s)");
        if (poList.isEmpty()) {
            return null;
        }

        return poList.get(0);
    }

    public List<User> findUsersBy(Company company) throws DaoException {

        logger.debug("Entering findUsersBy()");

        List<User> devUserList = findDeveloperUsers();
        List<Integer> userIdList = new ArrayList<>();
        devUserList.forEach(po -> {
            userIdList.add(po.getId());
        });

        CriteriaQuery<User> cq = getCb().createQuery(User.class);

        Root<User> root = cq.from(User.class);
        Join<User, Role> roleJoin = root.join(User_.roles);
        Join<Role, RoleType> roleTypeJoin = roleJoin.join(Role_.roleType);
        Join<Role, Company> companyJoin = roleJoin.join(Role_.company);

        Predicate in = root.get(User_.id).in(userIdList);
        Predicate p1 = getCb().not(in);

        Predicate p2 = getCb().equal(companyJoin.get(Company_.id), company.getId());
        Predicate p3 = getCb().notEqual(roleTypeJoin.get(RoleType_.name), RoleType.ROLES.DEVELOPER.name());

        cq = cq.select(root);
        cq = cq.where(p1, p2, p3);
        cq = cq.orderBy(getCb().asc(root.get(User_.username)));

        TypedQuery<User> tq = getEm().createQuery(cq);

        List<User> poList = tq.getResultList();
        logger.debug("Found " + poList.size() + " User record(s)");

        return poList;
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

    /**
     * Saves the received user and its roles
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the insert operation
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void save(User po, Set<Role> roleSet) throws DaoException {

        pdao.save(po.getPerson());

        po.setRoles(roleSet);

        if (po.getId() == null || po.getId() == 0) {
            insert(po);
        } else {
            updatePo(po);
        }
    }

    public void addToDefaultUsers(AbstractRole rpo) throws DaoException {

        logger.debug("Entering addToDefaultUsers()");

        Company company = rpo.getCompany();

        List<User> devUsers = findDeveloperUsers();
        List<User> ownerUsers = findOwnerUsersOf(company);

        List<User> allUsers = new ArrayList<>();
        allUsers.addAll(devUsers);
        allUsers.addAll(ownerUsers);

        Role role = rdao.getRoleById(rpo.getId());

        for (User upo : allUsers) {
            upo.getRoles().add(role);
            updatePo(upo);
        }
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

    private List<Role> getRolesBy(User upo, List<String> rtList) throws DaoException {

        CriteriaQuery<Role> cq = getCb().createQuery(Role.class);

        Root<User> root = cq.from(User.class);
        Join<User, Role> roleJoin = root.join(User_.roles);
        Join<Role, RoleType> roleTypeJoin = roleJoin.join(Role_.roleType);

        Predicate p = getCb().equal(root.get(User_.id), upo == null ? null : upo.getId());
        Predicate q = roleTypeJoin.get(RoleType_.name).in(rtList);

        Predicate pAndQ = getCb().and(p, q);
        cq = cq.select(roleJoin);
        cq = cq.where(pAndQ);

        TypedQuery<Role> nq = getEm().createQuery(cq);

        List<Role> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        return poList;
    }
}
