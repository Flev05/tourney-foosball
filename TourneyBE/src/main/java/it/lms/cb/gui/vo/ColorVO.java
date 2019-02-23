
package it.lms.cb.gui.vo;

public class ColorVO extends CommonUserVO {

    private static final long serialVersionUID = 1L;

    private String            name             = "";
    private String            hexValue         = "";

    public ColorVO(EColor ec) {

        this.name = ec.getI18nColor();
        this.hexValue = ec.getColorCode();
    }

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public String getHexValue() {

        return hexValue;
    }

    public void setHexValue(String hexValue) {

        this.hexValue = hexValue;
    }
}