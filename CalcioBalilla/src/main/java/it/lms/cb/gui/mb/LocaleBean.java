/*
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations under
 * the License.
 *
 * The Original Code is ICEfaces 1.5 open source software code, released
 * November 5, 2006. The Initial Developer of the Original Code is ICEsoft
 * Technologies Canada, Corp. Portions created by ICEsoft are Copyright (C)
 * 2004-2011 ICEsoft Technologies Canada, Corp. All Rights Reserved.
 *
 * Contributor(s): _____________________.
 */

package it.lms.cb.gui.mb;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

/**
 * @author Luciano Martino
 */
public class LocaleBean implements Serializable {

    private static final long             serialVersionUID  = 1L;
    private static final Logger           logger            = LogManager.getLogger(LocaleBean.class);

    // current language selection
    private String                        currentLanguage;
    // current local
    private Locale                        usedLocale;

    // available locals to choose from.
    private static final List<SelectItem> AVAILABLE_LOCALES = new ArrayList<SelectItem>(4);
    static {
        // setup our list of supported languages.
        AVAILABLE_LOCALES.add(new SelectItem("en", "EN"));
        // AVAILABLE_LOCALES.add(new SelectItem("de","German"));
        // AVAILABLE_LOCALES.add(new SelectItem("es","Spanish"));
        AVAILABLE_LOCALES.add(new SelectItem("it", "IT"));
    }

    /**
     * Creates an instance of the LocalBean. The default language type is specified by the initial request. The
     * availableLocales is
     */
    public LocaleBean() {
        // get default language type.
        currentLanguage = FacesContext.getCurrentInstance().getViewRoot().getLocale().getLanguage();
        usedLocale = FacesContext.getCurrentInstance().getViewRoot().getLocale();
    }

    /**
     * ATTENZIONE: Non funziona, � da allineare alle API Primefaces...
     */
    public void changeLanguage() {

        FacesContext ctx = FacesContext.getCurrentInstance();
        // find out view roots current local
        Locale locale = ctx.getViewRoot().getLocale();
        String newLanguage = "it";

        logger.debug("[changeLanguage()=" + newLanguage + "]");

        // see if matches any of our translations.
        if ("en".equals(newLanguage)) {
            currentLanguage = "en";
        } else if ("es".equals(newLanguage)) {
            currentLanguage = "es";
        } else if ("de".equals(newLanguage)) {
            currentLanguage = "de";
        } else if ("it".equals(newLanguage)) {
            currentLanguage = "it";
        }

        // finally change the local for the view root.
        if (!currentLanguage.equals(locale.getLanguage())) {
            usedLocale = new Locale(currentLanguage);
            ctx.getViewRoot().setLocale(usedLocale);
        }
    }

    public String getCurrentLanguage() {

        return currentLanguage;
    }

    public void setCurrentLanguage(String currentLanguage) {

        this.currentLanguage = currentLanguage;
    }

    public List<SelectItem> getAvailableLocales() {

        return AVAILABLE_LOCALES;
    }

    public Locale getUsedLocale() {

        return usedLocale;
    }
}
