
package it.lms.cb.gui.vo;

import it.lms.cb.gui.exc.ConversionException;

public enum EColor {

    Red("#FF0000", "i18n.color.Red"), White("#FFFFFF", "i18n.color.White"), Black("#000000",
            "i18n.color.Black"), Orange("#FFA500", "i18n.color.Orange"), Green("#008000",
                    "i18n.color.Green"), Blue("#0000ff", "i18n.color.Blue"), Yellow("#ffff00", "i18n.color.Yellow"),

    AliceBlue("#F0F8FF", "i18n.color.AliceBlue"), Beige("#F5F5DC", "i18n.color.Beige"), Cornsilk("#FFF8DC",
            "i18n.color.Cornsilk"), Gainsboro("#DCDCDC", "i18n.color.Gainsboro"), Khaki("#F0E68C",
                    "i18n.color.Khaki"), Lavender("#E6E6FA", "i18n.color.Lavender"), LavenderBlush("#FFF0F5",
                            "i18n.color.LavenderBlush"), LemonChiffon("#FFFACD", "i18n.color.LemonChiffon"), MistyRose(
                                    "#FFE4E1",
                                    "i18n.color.MistyRose"), MintCream("#F5FFFA", "i18n.color.MintCream"), PaleGreen(
                                            "#98FB98", "i18n.color.PaleGreen"), PapayaWhip("#FFEFD5",
                                                    "i18n.color.PapayaWhip"), SeaShell("#FFF5EE",
                                                            "i18n.color.SeaShell"), WhiteSmoke("#F5F5F5",
                                                                    "i18n.color.WhiteSmoke"),

    Aquamarine("#7FFFD4", "i18n.color.Aquamarine"), BurlyWood("#DEB887", "i18n.color.BurlyWood"), CadetBlue("#5F9EA0",
            "i18n.color.CadetBlue"), Coral("#FF7F50", "i18n.color.Coral"), Crimson("#DC143C",
                    "i18n.color.Crimson"), FireBrick("#B22222", "i18n.color.FireBrick"), GoldenRod("#DAA520",
                            "i18n.color.GoldenRod"), GreenYellow("#ADFF2F", "i18n.color.GreenYellow"), Indigo("#4B0082",
                                    "i18n.color.Indigo"), MediumOrchid("#BA55D3",
                                            "i18n.color.MediumOrchid"), MidnightBlue("#191970",
                                                    "i18n.color.MidnightBlue"), OliveDrab("#6B8E23",
                                                            "i18n.color.OliveDrab"), PaleVioletRed("#DB7093",
                                                                    "i18n.color.PaleVioletRed"), SandyBrown("#F4A460",
                                                                            "i18n.color.SandyBrown"), SlateBlue(
                                                                                    "#6A5ACD", "i18n.color.SlateBlue");

    private String colorCode;
    private String i18nColor;

    private EColor(String cc, String i18n) {

        colorCode = cc;
        i18nColor = i18n;
    }

    public static EColor fromValue(String hexValue) throws ConversionException {

        for (EColor ec : EColor.values()) {
            if (ec.getColorCode().equals(hexValue)) {
                return ec;
            }
        }
        throw new ConversionException(hexValue);
    }

    public String getColorCode() {

        return colorCode;
    }

    public void setColorCode(String colorCode) {

        this.colorCode = colorCode;
    }

    public String getI18nColor() {

        return i18nColor;
    }

    public void setI18nColor(String i18nColor) {

        this.i18nColor = i18nColor;
    }

}
