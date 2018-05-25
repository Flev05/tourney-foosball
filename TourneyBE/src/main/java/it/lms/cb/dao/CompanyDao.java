
package it.lms.cb.dao;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.tourney.po.Client;

@Stateless
public class CompanyDao extends AbstractCompanyDao<Client> {

    private static Logger logger = LogManager.getLogger(CompanyDao.class);

    public CompanyDao() throws DaoException {

        super(Client.class);
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
    public void save(Client po) throws DaoException {

        logger.debug("Entering save()");

        if (po.isNull()) {
            insert(po);
            return;
        }

        Client mpo = merge(po);
        update(mpo);
    }

    /**
     * Deleted the Company entity selected by the received parameter
     * 
     * @param id
     * @throws DaoException if any error
     */
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void deletePo(Client po) throws DaoException {

        Client mpo = merge(po);
        delete(mpo);
    }

    public static Client getCompanyById(Integer id) throws DaoException {

        CompanyDao dao = new CompanyDao();
        Client cpo = dao.getById(id);

        return cpo;
    }

}
