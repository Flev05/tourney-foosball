
package it.lms.cb.dao;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.Role;
import it.lms.cb.po.RoleType;

@Stateless
public class RoleDao extends AbstractRoleDao<Role> {

    private static Logger logger = LogManager.getLogger(RoleDao.class);

    public RoleDao() throws DaoException {

        super(Role.class);
    }

    public List<Role> getOwnerRoleType() throws DaoException {

        logger.debug("Entering getOwnerRoleType()");

        List<String> roleTypes = new ArrayList<>();
        roleTypes.add(RoleType.getOwnerRoleType());

        List<Role> roleList = findRolesByRoleType(roleTypes);

        return roleList;
    }

    public Role getRoleById(Integer id) throws DaoException {

        logger.debug("Entering getRoleById()");

        Role role = getById(id);

        return role;
    }

    @Override
    public void staticSave(RoleType rt) {

        // TODO Auto-generated method stub

    }

    @Override
    public List<RoleType> findInitialRoleTypes() throws DaoException {

        // TODO Auto-generated method stub
        return null;
    }
}
