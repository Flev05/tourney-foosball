
package it.lms.cb.dao;

import java.util.ArrayList;
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

import it.lms.cb.po.Person;
import it.lms.cb.po.Person_;

@Stateless
public class PersonDao extends BaseJPACrudDao<Person, Integer> {

    private static Logger logger = LogManager.getLogger(PersonDao.class);

    public PersonDao() throws DaoException {

        super(Person.class);
    }

    /**
     * Selects the record from the DC corresponding to the received cf, converts the got PO in its corresponding BO and
     * return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public Person getById(Integer id) throws DaoException {

        logger.debug("Entering getById(" + id + ")");

        Person po = getPerson(id);

        return po;
    }

    /**
     * Selects all the records in the Person table, converts the got PO in their corresponding BO and returns a list of
     * that BO
     * 
     * @return the list of Person BO
     * @throws DaoException if a problem occurs during the delete operation
     */
    public List<Person> findAllPerson() throws DaoException {

        logger.debug("Entering findAllPerson()");

        List<Person> poList = findAllPo();

        return poList;
    }

    /**
     * Selects the record from the Person using the receives parameter, converts the got PO in its corresponding BO and
     * return the BO
     * 
     * @param cf the customer identifier
     * @return the BO found
     * @throws DaoException id the select fails
     */
    public Person getByPk(String name) throws DaoException {

        logger.debug("Entering getByPk(" + name + ")");

        Person po = getPoByPk(Person_.lastName.getName(), name);
        if (po == null) {
            String err = "findByName(" + name + ") failed";
            logger.error(err);
            throw new NoDataFoundException(err);
        }

        return po;
    }

    public Person getBy(String firstname, String lastname) throws DaoException {

        logger.debug("Entering getBy(" + firstname + ", " + lastname + ")");
        return doGetBy(firstname, lastname);
    }

    private Person doGetBy(String firstname, String lastname) {

        CriteriaQuery<Person> cq = getCb().createQuery(Person.class);
        Root<Person> root = cq.from(Person.class);

        Predicate p1 = getCb().equal(root.get(Person_.firstName), firstname);
        Predicate p2 = getCb().equal(root.get(Person_.lastName), lastname);

        cq = cq.select(root);

        cq.where(p1, p2);

        TypedQuery<Person> nq = getEm().createQuery(cq);

        List<Person> poList = nq.getResultList();
        String info = "[Found " + poList.size() + " Person(s)] ";
        logger.info(info);

        if (poList.isEmpty()) {
            return null;
        }

        return poList.get(0);
    }

    /**
     * Deleted the Person entity selected by the received parameter
     * 
     * @param id
     * @throws DaoException if any error
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void deletePo(Person po) throws DaoException {

        Person mpo = merge(po);
        delete(mpo);
    }

    /**
     * Inserts the Person entity received as parameter
     * 
     * @param po the entity to insert
     * @throws DaoException if any error
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void save(Person ppo) throws DaoException {

        if (ppo.getId() == null || ppo.getId() == 0) {
            insert(ppo);
        } else {
            Person mpo = merge(ppo);
            update(mpo);
        }
    }

    private Person getPerson(Integer id) throws DaoException {

        Person po;
        try {
            po = getPoById(id);
        } catch (NoDataFoundException e) {
            logger.error("No data found, return null");
            return null;
        }

        return po;
    }

    private Person getPoById(Integer id) throws DaoException {

        Person po = findById(id);
        return po;
    }

    private List<Person> findAllPo() throws DaoException {

        List<Person> poList = findAllOrderByAsc(Person_.lastName.getName());

        if (poList == null || poList.size() == 0) {
            logger.error("Unable to find a Person in the DB");
            return new ArrayList<Person>();
        }

        logger.debug(poList.size() + " Person found(s)");

        return poList;
    }
}
