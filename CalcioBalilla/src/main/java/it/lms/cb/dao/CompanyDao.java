
package it.lms.cb.dao;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.Company;

@Stateless
public class CompanyDao extends AbstractCompanyDao<Company> {

    private static Logger logger = LogManager.getLogger(CompanyDao.class);

    public CompanyDao() throws DaoException {

        super(Company.class);
    }

    /**
     * Saves the BO received as parameter. If the BO is already stored in the DB, calls the update method, else calls
     * the insert method
     * 
     * @param line
     * @param bo the BO to save
     * @throws DaoException if a problem occurs during the insert operation
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void save(Company po) throws DaoException {

        logger.debug("Entering save()");

        if (po.isNull()) {
            insert(po);
            return;
        }

        Company mpo = merge(po);
        update(mpo);
    }

    /**
     * Deleted the Company entity selected by the received parameter
     * 
     * @param id
     * @throws DaoException if any error
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void deletePo(Company po) throws DaoException {

        Company mpo = merge(po);
        delete(mpo);
    }

    public static Company getCompanyById(Integer id) throws DaoException {

        CompanyDao dao = new CompanyDao();
        Company cpo = dao.getById(id);

        return cpo;
    }

}
