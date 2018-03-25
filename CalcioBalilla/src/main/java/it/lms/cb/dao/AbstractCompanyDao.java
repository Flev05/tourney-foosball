
package it.lms.cb.dao;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.AbstractCompany;
import it.lms.cb.po.AbstractCompany_;
import it.lms.cb.po.Company_;
import it.lms.cb.po.Role;
import it.lms.cb.po.Role_;
import it.lms.cb.po.User;
import it.lms.cb.po.User_;

public abstract class AbstractCompanyDao<PO extends AbstractCompany> extends BaseJPACrudDao<PO, Integer> {

    private static Logger logger = LogManager.getLogger(AbstractCompanyDao.class);
    private Class<PO>     po;

    public AbstractCompanyDao(Class<PO> po) throws DaoException {

        super(po);
        this.po = po;
    }

    /**
     * Selects the entity corresponding to the received id, converts the got PO in its corresponding BO and return the
     * BO
     * 
     * @param id the entity identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public PO findCompanyById(Integer id) throws DaoException {

        logger.debug("Entering findCompanyById(" + id + ")");

        PO po = getPoById(id);

        return po;
    }

    public PO findByEmail(String email) {

        logger.debug("Entering findByEmail()");

        CriteriaQuery<PO> cq = getCb().createQuery(this.po);

        Root<PO> root = cq.from(this.po);

        Predicate emailWhereClause = getCb().equal(root.get(Company_.companyEmail), email);

        cq.select(root).where(emailWhereClause);

        TypedQuery<PO> nq = getEm().createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " PO(s)] ";
        logger.info(info);

        if (poList.isEmpty()) {
            return null;
        }

        return poList.get(0);
    }

    public PO getByCompanyCode(String companyCode) {

        CriteriaQuery<PO> cq = getCb().createQuery(this.po);

        Root<PO> root = cq.from(this.po);

        Predicate p = getCb().equal(root.get(AbstractCompany_.companyCode), companyCode);
        cq.select(root).where(p);

        TypedQuery<PO> nq = getEm().createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " Link(s)] ";
        logger.info(info);

        if (poList == null || poList.isEmpty()) {
            logger.debug("PO " + companyCode + "  not found, returning null. ");
            return null;
        }

        logger.debug("Found " + poList.size() + " PO record(s)");

        PO po = poList.get(0);
        return po;
    }

    /**
     * Selects the PO corresponding to the received id, converts it in its corresponding BO and return the BO
     * 
     * @param id the entity identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public PO getById(Integer id) throws DaoException {

        logger.debug("Entering getById(" + id + ")");

        PO po = findById(id);

        return po;
    }

    /**
     * Selects all the records in the PO table, converts the got PO in their corresponding BO and returns a list of that
     * BO
     * 
     * @return the list of PO BO
     * @throws DaoException if a problem occurs during the delete operation
     */
    public List<PO> findAllCompany() throws DaoException {

        logger.debug("Entering findAllCompany()");

        List<PO> poList = findAllPo();

        return poList;
    }

    public List<PO> getAllCompanyBy(String username) {

        logger.debug("Entering getAllCompanyBy()");

        CriteriaQuery<PO> cq = getCb().createQuery(this.po);
        Root<PO> root = cq.from(this.po);

        Join<PO, Role> roleJoin = root.join(Company_.roles);

        Join<Role, User> userJoin = roleJoin.join(Role_.users);

        Predicate p = getCb().equal(userJoin.get(User_.username), username);
        cq = cq.select(root);
        cq = cq.distinct(true);
        cq = cq.where(p);

        TypedQuery<PO> tq = getEm().createQuery(cq);

        List<PO> poList = tq.getResultList();
        logger.debug("Found " + poList.size() + " record(s)");

        return poList;
    }

    /**
     * Selects the record from the PO using the received parameter, converts the got PO in its corresponding BO and
     * return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public PO getByPk(String name) throws DaoException {

        logger.debug("Entering getByPk(" + name + ")");

        PO po = getPoByPk(name);
        if (po == null) {
            String err = "findByName(" + name + ") failed";
            logger.error(err);
            throw new NoDataFoundException(err);
        }

        return po;
    }

    private PO getPoById(Integer id) throws DaoException {

        PO po = findById(id);
        return po;
    }

    /**
     * This method has only a package visibility to allow the invocation only from the same package to get the PO and
     * complete the DML operations
     * 
     * @param id the identifier to find the PO
     * @return the found PO
     * @throws DaoException if any error
     */
    private PO getPoByPk(String name) throws DaoException {

        logger.debug("Entering getPoByPk(" + name + ")");

        CriteriaQuery<PO> cq = getCb().createQuery(this.po);

        Root<PO> root = cq.from(this.po);

        Predicate p = getCb().equal(root.get(Company_.name), name);
        cq.select(root).where(p);

        TypedQuery<PO> nq = getEm().createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " Link(s)] ";
        logger.info(info);

        if (poList == null || poList.isEmpty()) {
            logger.debug("PO " + name + "  not found, returning null. ");
            return null;
        }

        logger.debug("Found " + poList.size() + " PO record(s)");

        PO po = poList.get(0);
        return po;
    }

    private List<PO> findAllPo() throws DaoException {

        List<PO> poList = findAllOrderByAsc(Company_.companyEmail.getName());

        if (poList == null || poList.isEmpty()) {
            logger.error("Unable to find a Booking in the DB");
            return new ArrayList<PO>();
        }

        logger.debug(poList.size() + " Booking found(s)");

        return poList;
    }

}
