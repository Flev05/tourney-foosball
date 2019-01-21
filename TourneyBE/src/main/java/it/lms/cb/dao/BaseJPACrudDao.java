
package it.lms.cb.dao;

import java.io.Serializable;
import java.util.List;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.log4j.Logger;

import it.lms.tourney.cdi.AbstractLogger;

/**
 * BaseHibernateCrudDao Class. Root(base) class to manage data access using Hibernate to perform CRUD operations on only
 * one entity.
 */
public abstract class BaseJPACrudDao<PO, ID extends Serializable> extends AbstractLogger {

    @Inject
    protected Logger        logger;

    @PersistenceContext
    private EntityManager   em;

    @Inject
    private Event<PO>       clientEventSrc;

    private Class<PO>       entityClass;
    private CriteriaBuilder cb = null;

    public BaseJPACrudDao() {

    }

    protected BaseJPACrudDao(Class<PO> entityClass) {

        this.entityClass = entityClass;
    }

    protected CriteriaBuilder getCb() {

        cb = em.getCriteriaBuilder();
        return cb;
    }

    protected EntityManager getEm() {

        return em;
    }

    private void makePersistent(PO entity) {

        em.persist(entity);
        clientEventSrc.fire(entity);
    }

    protected void insertPo(PO entity) {

        makePersistent(entity);

        logger.debug(logId() + "insert successful");
    }

    /**
     * Does nothing, the JPA automatically update the PO when the transaction commits
     * 
     * @param entity to update
     */
    protected void updatePo(PO entity) {

        PO mpo = this.merge(entity);

        makePersistent(mpo);
        logger.debug(logId() + "update successful");
    }

    protected PO merge(PO entity) {

        PO po = em.merge(entity);
        logger.debug(logId() + "merge successful");
        return po;
    }

    protected void detach(PO entity) {

        em.detach(entity);
        logger.debug(logId() + "detach successful");
    }

    protected void deletePo(PO entity) {

        PO mpo = this.merge(entity);

        makePersistent(mpo);
        logger.debug(logId() + "delete successful");
    }

    protected void refresh(PO entity) {

        em.refresh(entity);
    }

    protected List<PO> findAllOrderByAsc(String fieldName) {

        CriteriaQuery<PO> cq = getCb().createQuery(entityClass);
        Root<PO> root = cq.from(entityClass);

        cq.select(root);
        cq.orderBy(getCb().asc(root.get(fieldName)));

        TypedQuery<PO> nq = em.createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " of " + entityClass + " PO(s)] ";
        logger.info(logId() + info);

        return poList;
    }

    protected List<PO> findAllOrderByDesc(String fieldName) {

        CriteriaQuery<PO> cq = getCb().createQuery(entityClass);
        Root<PO> root = cq.from(entityClass);

        cq.select(root);
        cq.orderBy(getCb().desc(root.get(fieldName)));

        TypedQuery<PO> nq = em.createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " of " + entityClass + " PO(s)] ";
        logger.info(logId() + info);

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

        logger.debug(logId() + "Entering getPoByPk(" + name + ")");

        CriteriaQuery<PO> cq = getCb().createQuery(entityClass);

        Root<PO> root = cq.from(entityClass);

        Predicate p = getCb().equal(root.get(pk), name);
        cq.select(root).where(p);

        TypedQuery<PO> nq = em.createQuery(cq);

        List<PO> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " PO(s)] ";
        logger.info(logId() + info);

        PO po = poList.get(0);
        return po;
    }

    protected PO findById(ID id) {

        return em.find(entityClass, id);
    }

    private Query getAllQuery() {

        return em.createQuery("select m from " + entityClass.getSimpleName() + " m");
    }

    @SuppressWarnings("unchecked")
    protected List<PO> findAll() {

        return (List<PO>) getAllQuery().getResultList();
    }
}