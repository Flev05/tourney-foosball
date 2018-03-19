
package it.lms.cb.dao;

import java.io.Serializable;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

/**
 * BaseHibernateCrudDao Class. Root(base) class to manage data access using Hibernate to perform CRUD operations on only
 * one entity.
 */
public class BaseJPACrudDao<PO, ID extends Serializable> {

    private static Logger     logger = LogManager.getLogger(BaseJPACrudDao.class);

    protected Class<PO>       entityClass;

    @PersistenceContext
    protected EntityManager   em;

    protected CriteriaBuilder cb;

    public BaseJPACrudDao(Class<PO> entityClass) {

        this.entityClass = entityClass;
        cb = em.getCriteriaBuilder();
    }

    private void makePersistent(PO entity) {

        em.persist(entity);
    }

    protected void insert(PO entity) {

        makePersistent(entity);
        logger.debug("insert successful");
    }

    /**
     * Does nothing, the JPA automatically update the PO when the transaction commits
     * 
     * @param entity to update
     */
    protected void update(PO entity) {

        makePersistent(entity);
        logger.debug("update successful");
    }

    protected PO merge(PO entity) {

        PO po = em.merge(entity);
        logger.debug("merge successful");
        return po;
    }

    protected void detach(PO entity) {

        em.detach(entity);
        logger.debug("detach successful");
    }

    protected void delete(PO entity) {

        makeTransient(entity);
        logger.debug("delete successful");
    }

    private void makeTransient(PO entity) {

        em.remove(entity);
    }

    protected void refresh(PO entity) {

        em.refresh(entity);
    }

    protected List<PO> findAllOrderByAsc(String fieldName) {

        CriteriaQuery<PO> cq = cb.createQuery(entityClass);
        Root<PO> root = cq.from(entityClass);

        cq.select(root);
        cq.orderBy(cb.asc(root.get(fieldName)));

        TypedQuery<PO> nq = em.createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " of " + entityClass + " PO(s)] ";
        logger.info(info);

        return poList;
    }

    protected List<PO> findAllOrderByDesc(String fieldName) {

        CriteriaQuery<PO> cq = cb.createQuery(entityClass);
        Root<PO> root = cq.from(entityClass);

        cq.select(root);
        cq.orderBy(cb.desc(root.get(fieldName)));

        TypedQuery<PO> nq = em.createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " of " + entityClass + " PO(s)] ";
        logger.info(info);

        return poList;
    }

    /**
     * This method has only a package visibility to allow the invocation only from the same package to get the PO and
     * complete the DML operations
     * 
     * @param id the identifier to find the PO
     * @return the found PO
     * @throws DaoException if any error
     */
    protected PO getPoByPk(String pk, String name) throws DaoException {

        logger.debug("Entering getPoByPk(" + name + ")");

        CriteriaQuery<PO> cq = cb.createQuery(entityClass);

        Root<PO> root = cq.from(entityClass);

        Predicate p = cb.equal(root.get(pk), name);
        cq.select(root).where(p);

        TypedQuery<PO> nq = em.createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " PO(s)] ";
        logger.info(info);

        PO po = poList.get(0);
        return po;
    }

    protected PO findById(Object primaryKey) throws DaoException {

        return em.find(entityClass, primaryKey);
    }

    private Query getAllQuery() {

        return em.createQuery("select m from " + entityClass.getSimpleName() + " m");
    }

    @SuppressWarnings("unchecked")
    protected List<PO> findAll() {

        return (List<PO>) getAllQuery().getResultList();
    }
}