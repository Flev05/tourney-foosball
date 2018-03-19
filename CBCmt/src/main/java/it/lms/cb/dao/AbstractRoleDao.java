
package it.lms.cb.dao;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.AbstractRole;
import it.lms.cb.po.AbstractRole_;
import it.lms.cb.po.Company;
import it.lms.cb.po.Company_;
import it.lms.cb.po.Role;
import it.lms.cb.po.RoleType;
import it.lms.cb.po.RoleType_;

public abstract class AbstractRoleDao<PO extends AbstractRole> extends BaseJPACrudDao<PO, Integer> {

    private static Logger logger = LogManager.getLogger(AbstractRoleDao.class);
    private Class<PO>     po;

    public AbstractRoleDao(Class<PO> po) throws DaoException {

        super(po);
        this.po = po;
    }

    /**
     * Selects all the records in the PO table, converts the got PO in their corresponding BO and returns a list of that
     * BO
     * 
     * @return the list of PO BO
     * @throws DaoException if a problem occurs during the find operation
     */
    public List<PO> findAllRoles() throws DaoException {

        logger.debug("Entering findAllRoles()");

        CriteriaQuery<PO> cq = cb.createQuery(this.po);

        Root<PO> root = cq.from(this.po);
        Join<PO, Company> companyJoin = root.join(AbstractRole_.company);
        Join<PO, RoleType> rtJoin = root.join(AbstractRole_.roleType);

        cq = cq.select(root);
        cq = cq.orderBy(cb.asc(companyJoin.get(Company_.name)), cb.asc(rtJoin.get(RoleType_.name)));

        TypedQuery<PO> nq = em.createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " PO(s)] ";
        logger.info(info);

        return poList;
    }

    public boolean findBy(RoleType roleId, Company companyId) throws DaoException {

        logger.debug("Entering findBy()");

        CriteriaQuery<PO> cq = cb.createQuery(this.po);

        Root<PO> root = cq.from(this.po);

        Predicate p1 = cb.equal(root.get(AbstractRole_.roleType), roleId);
        Predicate p2 = cb.equal(root.get(AbstractRole_.company), companyId);

        cq = cq.select(root);
        cq = cq.where(p1, p2);

        TypedQuery<PO> nq = em.createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " PO(s)] ";
        logger.info(info);

        return !poList.isEmpty();
    }

    public List<PO> findRoleNotDeveloper(Company company) throws DaoException {

        logger.debug("Entering findRoleNotDeveloper()");

        CriteriaQuery<PO> cq = cb.createQuery(this.po);

        Root<PO> root = cq.from(this.po);
        Join<PO, RoleType> rtJoin = root.join(AbstractRole_.roleType);

        Predicate p1 = cb.equal(root.get(AbstractRole_.company), company);
        Predicate p2 = cb.notEqual(rtJoin.get(RoleType_.name), RoleType.ROLES.DEVELOPER.name());

        cq = cq.select(root);
        cq = cq.where(p1, p2);
        cq = cq.orderBy(cb.asc(root.get(AbstractRole_.name)));

        TypedQuery<PO> nq = em.createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " PO(s)] ";
        logger.info(info);

        return poList;
    }

    /**
     * Selects the PO corresponding to the received id, converts it in its corresponding BO and return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public PO getById(Integer id) throws DaoException {

        logger.debug("Entering RoleDao.getById(" + id + ")");

        PO po = getPoById(id);

        return po;
    }

    public PO getPoById(Integer id) throws DaoException {

        PO po = findById(id);
        return po;
    }

    public List<PO> findRolesByRoleType(List<String> roleTypes) throws DaoException {

        logger.debug("Entering findRolesByRoleType()");

        CriteriaQuery<PO> cq = cb.createQuery(this.po);

        Root<PO> root = cq.from(this.po);
        Join<PO, RoleType> roleTypeJoin = root.join(AbstractRole_.roleType);

        List<Predicate> predicates = new ArrayList<Predicate>();
        for (String key : roleTypes) {
            predicates.add(cb.equal(roleTypeJoin.get(RoleType_.name), key));
        }

        cq = cq.select(root);

        cq.where(cb.or(predicates.toArray(new Predicate[0])));

        TypedQuery<PO> nq = em.createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " User(s)] ";
        logger.info(info);

        return poList;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void save(PO po) throws DaoException {

        if (po.isNull()) {
            logger.debug("Inserting PO: " + po);

            insert(po);
            return;
        }

        logger.debug("Updating PO: " + po);

        PO mpo = merge(po);
        update(mpo);
    }

    /**
     * Inserts the received new user
     * 
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the insert operation
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void insertPo(PO po) throws DaoException {

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
    public void deletePo(PO po) throws DaoException {

        logger.debug("Entering deletePo()");

        try {
            super.delete(po);
            logger.debug("Delete of " + po + " successful");
        } catch (Exception e) {
            String msg = "Delete of " + po + " failed";
            logger.error(msg, e);
            throw new DaoException(msg);
        }
    }

    /**
     * Prepares and saves the initial roles for the received company
     * 
     * @param po the company the roles created with
     * @throws DaoException if runtime error
     */
    public static void addInitialRoles(Company po) throws DaoException {

        List<RoleType> rtList = RoleTypeDao.findInitialRoleTypes();

        for (RoleType rt : rtList) {
            Role rpo = new Role();
            rpo.setCompany(po);
            rpo.setRoleType(rt);
            rpo.setName(rt.getName());
            rpo.setDescription("Role for: " + rt.getName());
            RoleTypeDao.staticSave(rt);
        }
    }

}
