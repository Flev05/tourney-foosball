
package it.lms.cb.gui.vo;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.po.User;

/**
 * The View Object to represent a row in the table on the GUI
 * 
 * @author Luciano Martino
 */
public class UserVO extends GenericVO<User> {

    private static final long   serialVersionUID = 1L;

    private static final Logger logger           = LogManager.getLogger(UserVO.class);

    private String              rolesNo;
    private String              retypePassword   = "";
    private String              newPassword      = "";
    private String              confirmPassword  = "";

    private boolean             cellValue        = false;
    private Integer             roleId;

    public UserVO(User bo) {

        super(bo);
    }

    public UserVO() {

        this(new User());
    }

    /**
     * Called from the ice:dataTable. This method uses the columnDataModel and rowDataModel with the CellStatusKeyBO
     * utility class to display the correct cell value.
     *
     * @return data which should be displayed for the given model state.
     */
    public boolean getCellValue() {

        logger.debug("Enterting getCellValue()=" + cellValue);
        logger.debug(toString());
        return cellValue;
    }

    public void setCellValue(boolean c) {

        logger.debug("Enterting setCellValue()=" + c);
        logger.debug(toString());
        cellValue = c;
    }

    public String getRolesNo() {

        return rolesNo;
    }

    public void setRolesNo(String rolesNo) {

        this.rolesNo = rolesNo;
    }

    public String getRetypePassword() {

        return retypePassword.trim();
    }

    public void setRetypePassword(String retypePassword) {

        this.retypePassword = retypePassword;
    }

    public String getNewPassword() {

        return newPassword.trim();
    }

    public void setNewPassword(String newPassword) {

        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {

        return confirmPassword.trim();
    }

    public void setConfirmPassword(String confirmPassword) {

        this.confirmPassword = confirmPassword;
    }

    public String getUsername() {

        return getPo().getUsername();
    }

    public void setUsername(String username) {

        this.getPo().setUsername(username);
    }

    public String getPassword() {

        return getPo().getPassword();
    }

    public void setPassword(String username) {

        this.getPo().setPassword(username);
    }

    public Boolean getRoleAdmin() {

        return getPo().getRoleAdmin();
    }

    public void setRoleAdmin(Boolean ra) {

        this.getPo().setRoleAdmin(ra);
    }

    public String getFirstname() {

        return getPo().getPerson().getFirstName();
    }

    public void setFirstname(String firstName) {

        this.getPo().getPerson().setFirstName(firstName);
    }

    public String getLastname() {

        return getPo().getPerson().getLastName();
    }

    public void setLastname(String lastName) {

        this.getPo().getPerson().setLastName(lastName);
    }

    public String getGecos() {

        return getPo().getGecos();
    }

    public void setGecos(String gecos) {

        this.getPo().setGecos(gecos);
    }

    public Integer getRoleId() {

        return roleId;
    }

    public void setRoleId(Integer roleId) {

        this.roleId = roleId;
    }

    public String getGuide() {

        return getPo().getGuide();
    }

    public void setGuide(String guide) {

        this.getPo().setGuide(guide);
    }
}
