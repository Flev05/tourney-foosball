
package it.lms.cb.gui.um;

import java.io.Serializable;

import it.lms.cb.po.User;

public interface LoginInterface extends Serializable {

    public void onUserLogin(User upo, String companyCode) throws Exception;

    public void onUserLogout(User upo) throws Exception;
}
