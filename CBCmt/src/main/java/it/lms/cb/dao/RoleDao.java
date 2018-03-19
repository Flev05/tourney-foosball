
package it.lms.cb.dao;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.Role;
import it.lms.cb.po.RoleType;

public class RoleDao extends AbstractRoleDao<Role> {

    private static Logger logger = LogManager.getLogger(RoleDao.class);

    public RoleDao() throws DaoException {

        super(Role.class);
    }

    public static List<Role> getOwnerRoleType() throws DaoException {

        logger.debug("Entering getOwnerRoleType()");

        RoleDao dao = new RoleDao();

        List<String> roleTypes = new ArrayList<>();
        roleTypes.add(RoleType.getOwnerRoleType());

        List<Role> roleList = dao.findRolesByRoleType(roleTypes);

        return roleList;
    }

    public static Role getRoleById(Integer id) throws DaoException {

        logger.debug("Entering getRoleById()");

        RoleDao dao = new RoleDao();

        Role role = dao.getById(id);

        return role;
    }
}
