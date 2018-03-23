
package it.lms.cb.gui.mb;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Locale;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import it.lms.cb.gui.um.resources.CommonMessages;

public class CommonUtil {

    private static final Logger   logger            = LogManager.getLogger(CommonUtil.class);

    private static final String   YYYY_MM_DD_FORMAT = "yyyyMMdd";
    protected static final String DATE_FORMAT       = CommonMessages.I18N_FORMAT_DATE;
    protected static final String TIME_FORMAT       = CommonMessages.I18N_FORMAT_TIME;
    public static final String    FULL_DATE_FORMAT  = CommonMessages.I18N_FORMAT_DATETIME;   // "dd-MM-yyyy HH:mm:ss";
    private static final String   P_HH_MM           = CommonMessages.I18N_FORMAT_TIME_HHMM;

    public static final long      DAY_IN_MILLI      = 86400000L;                             // = 24*3600*1000 = one day
                                                                                             // in milliseconds;
    public static final long      MONTH_IN_MILLI    = 2592000000L;                           // = 30*24*3600*1000 = one
                                                                                             // day in milliseconds;

    private static final String   UM_BOUNDLE        = "it.lms.cb.gui.um.resources.messages";
    private static final int      MAX_MESSAGE_LEN   = 4096;

    private static final int      M                 = 24;
    private static final int      N                 = 5;

    public static void replaceAndShowError(String i18nMessageProperty, String t1, String t2) {

        AbstractMB.replaceAndShowError(UM_BOUNDLE, i18nMessageProperty, t1, t2);
    }

    public static void showLoginValidationError(String i18nMessageProperty) {

        AbstractMB.showLoginValidationError(UM_BOUNDLE, i18nMessageProperty);
    }

    public static String showValidationError(String i18nMessageProperty) {

        return AbstractMB.showValidationError(UM_BOUNDLE, i18nMessageProperty);
    }

    public static void showInfoMessage(String i18nMessageProperty) {

        AbstractMB.showInfoMessage(UM_BOUNDLE, i18nMessageProperty);
    }

    public static void showCreateValidationError(String i18nMessageProperty) {

        AbstractMB.showCreateValidationError(UM_BOUNDLE, i18nMessageProperty);
    }

    public static void showDeleteValidationError(String i18nMessageProperty) {

        AbstractMB.showDeleteValidationError(UM_BOUNDLE, i18nMessageProperty);
    }

    public static String showValidationError(String clientId, String i18nMessageProperty) {

        return AbstractMB.showValidationError(UM_BOUNDLE, clientId, i18nMessageProperty);
    }

    public static void showValidationErrorWithToken(String i18nMessageProperty, String token) {

        AbstractMB.replaceAndShowErrorMessage(UM_BOUNDLE, i18nMessageProperty, token);
    }

    public static String i18n(String i18nMessageProperty) {

        return BaseBean.i18n(UM_BOUNDLE, i18nMessageProperty);
    }

    public static String i18n(String i18nMessageProperty, Locale l) {

        return BaseBean.i18n(UM_BOUNDLE, i18nMessageProperty, l);
    }

    public static String stackTraceToString(Exception e, String errmsg) {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream ps = new PrintStream(baos);
        e.printStackTrace(ps);

        errmsg = errmsg + baos.toString();
        if (errmsg.length() > MAX_MESSAGE_LEN) {
            errmsg = errmsg.substring(MAX_MESSAGE_LEN);
        }
        return errmsg;
    }

    public static SimpleDateFormat hh24mm() {

        String hh24mm = i18n(P_HH_MM);
        SimpleDateFormat sdf = new SimpleDateFormat(hh24mm);

        return sdf;
    }

    public static String printH24mm(Date date) {

        String hh24mm = i18n(P_HH_MM);
        SimpleDateFormat sdf = new SimpleDateFormat(hh24mm);

        return sdf.format(date);
    }

    public static Date convStringToDate(String dateAsString) {

        logger.trace("Entering convStringToDate(" + dateAsString + ")");
        SimpleDateFormat format = new SimpleDateFormat(i18n(DATE_FORMAT));
        Date d = new Date();
        try {
            d = format.parse(dateAsString);
        } catch (ParseException e) {
            logger.error("Bad date format: " + dateAsString, e);
        }
        logger.trace(dateAsString + " ==> " + d);
        return d;
    }

    public static Date convToDate(Integer year, Integer month, Integer day) {

        String dateAsString = String.format("%1$02d/%2$02d/%3$s", day, month + 1, year);

        return convStringToDate(dateAsString);
    }

    public static String convDateToString(Date date) {

        SimpleDateFormat sdf = new SimpleDateFormat(i18n(DATE_FORMAT));

        String s = sdf.format(date);

        logger.trace("convDateToString(" + date + ")=" + s);
        return s;
    }

    public static String convToYYYYMMDD(Date date) {

        SimpleDateFormat sdf = new SimpleDateFormat(YYYY_MM_DD_FORMAT);

        String s = sdf.format(date);

        logger.trace("convDateToString(" + date + ")=" + s);
        return s;
    }

    public static String convDateToString(Date date, String dateFormat) {

        if (date == null) {
            return "";
        }

        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);

        String s = sdf.format(date);

        logger.trace("convDateToString(" + date + ")=" + s);
        return s;
    }

    public static String convDateToStringHHmm(Date date) {

        String dateFormat = CommonUtil.i18n(P_HH_MM);
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);

        String s = sdf.format(date);

        logger.trace("convDateToString(" + date + ")=" + s);
        return s;
    }

    public static Date convDateToStringHHmm(String date) throws ParseException {

        String dateFormat = CommonUtil.i18n(P_HH_MM);
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);

        Date d = sdf.parse(date);
        logger.trace("convStringToDate(" + date + ")=" + d);
        return d;
    }

    public static String convFullDateToString(Date date) {

        SimpleDateFormat sdf = new SimpleDateFormat(i18n(FULL_DATE_FORMAT));

        String s = sdf.format(date);

        logger.trace("convFullDateToString(" + date + ")=" + s);
        return s;
    }

    public static String convFullDateToString(Date date, String dateFormat) {

        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat + " " + i18n(TIME_FORMAT));

        String s = sdf.format(date);

        logger.trace("convFullDateToString(" + date + ")=" + s);
        return s;
    }

    public static int getDay(Date date) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(date);

        int lastDay = gc.get(Calendar.DAY_OF_MONTH);

        logger.trace("DAY(" + convDateToString(date) + ")=" + lastDay);
        return lastDay;
    }

    /**
     * Makes a new date using the received base date and day in the month of the date and return the computed date
     * 
     * @param from the date to add the day of
     * @param day the day to add
     * @return the new date
     */
    public static Date makeDate(Date from, int day) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(from);

        gc.set(Calendar.DAY_OF_MONTH, day);

        Date curDate = gc.getTime();

        logger.trace("makeDate(" + convDateToString(from) + "," + day + ")=" + convDateToString(curDate));
        return curDate;
    }

    /**
     * Extract from the received Date the year number as string
     * 
     * @param date the date which take the year from
     * @return the year in the Date
     */
    public static String getYear(Date date) {

        Calendar cal = new GregorianCalendar();
        cal.setTime(date);
        int yy = cal.get(Calendar.YEAR);
        logger.trace("YYYY=" + yy);
        return "" + yy;
    }

    /**
     * Extract from the received Date the zero based month number as string
     * 
     * @param date the date which take the month from
     * @return the zero-base month
     */
    public static String getMonth(Date date) {

        Calendar cal = new GregorianCalendar();
        cal.setTime(date);
        int mm = cal.get(Calendar.MONTH);
        logger.trace("MM=" + mm);
        return "" + mm;
    }

    public static Date getPreviousDate(String toDate) {

        Date date = convStringToDate(toDate);
        return getPreviousDate(date);
    }

    public static Date getPreviousDate(Date date) {

        long milli = date.getTime();
        milli -= DAY_IN_MILLI;

        Date prevDate = new Date(milli);

        return prevDate;
    }

    public static Date getNextDate(String toDate) {

        Date date = convStringToDate(toDate);
        return getNextDate(date);
    }

    public static Date getNextDate(Date date) {

        long milli = date.getTime();
        milli += DAY_IN_MILLI;

        Date nextDate = new Date(milli);

        return nextDate;
    }

    public static Date zeroMilli(Date dd) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(dd);
        gc.set(Calendar.MILLISECOND, 0);

        return gc.getTime();
    }

    public static Date zeroTime(Date dd) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(dd);
        gc.set(Calendar.HOUR_OF_DAY, 0);
        gc.set(Calendar.MINUTE, 0);
        gc.set(Calendar.SECOND, 0);
        gc.set(Calendar.MILLISECOND, 0);

        return gc.getTime();
    }

    /**
     * Extracts the day from the received data in the format dd/mm/yyyy
     * 
     * @param dateAsString format string: dd/mm/yyyy
     * @return dd
     */
    public static String getDay(String dateAsString) throws ParseException {

        logger.trace("Entering getDay(" + dateAsString + ")");
        SimpleDateFormat format = new SimpleDateFormat(i18n(DATE_FORMAT));
        Date d = new Date();
        try {
            d = format.parse(dateAsString);
        } catch (ParseException e) {
            logger.error("Bad date format: " + d + ". Expected: " + i18n(DATE_FORMAT), e);
            throw e;
        }

        String[] tokens = dateAsString.split("/");
        String day = tokens[0];

        logger.trace(dateAsString + " ==> " + day);
        return day;
    }

    /**
     * Extracts the month from the received data in the format dd/mm/yyyy
     * 
     * @param dateAsString format string: dd/mm/yyyy
     * @return mm
     */
    public static String getMonth(String dateAsString) throws ParseException {

        logger.trace("Entering getMonth(" + dateAsString + ")");
        SimpleDateFormat format = new SimpleDateFormat(i18n(DATE_FORMAT));
        Date d = new Date();
        try {
            d = format.parse(dateAsString);
        } catch (ParseException e) {
            logger.error("Bad date format: " + d + ". Expected: " + i18n(DATE_FORMAT), e);
            throw e;
        }

        String[] tokens = dateAsString.split("/");
        String month = tokens[1];

        logger.trace(dateAsString + " ==> " + month);
        return month;
    }

    /**
     * Extracts the year from the received data in the format dd/mm/yyyy
     * 
     * @param dateAsString format string: dd/mm/yyyy
     * @return yyyy
     */
    public static String getYear(String dateAsString) throws ParseException {

        logger.trace("Entering getYear(" + dateAsString + ")");
        SimpleDateFormat format = new SimpleDateFormat(i18n(DATE_FORMAT));
        Date d = new Date();
        try {
            d = format.parse(dateAsString);
        } catch (ParseException e) {
            logger.error("Bad date format: " + d + ". Expected: " + i18n(DATE_FORMAT), e);
            throw e;
        }

        String[] tokens = dateAsString.split("/");
        String year = tokens[2];

        logger.trace(dateAsString + " ==> " + year);
        return year;
    }

    public static Timestamp convertDateToTimestamp(Date passDate) {

        Timestamp ts = new Timestamp(passDate.getTime());
        return ts;
    }

    public static List<Date> createRequestList(Date from, Date to) {

        String fromStr = convDateToString(from);
        String toStr = convDateToString(to);
        return createRequestList(fromStr, toStr);
    }

    public static List<Date> createFullRequestList(String fromStr, String toStr) {

        logger.debug("Entering createRequestList(" + fromStr + "," + toStr + ")");
        return createRequestList(fromStr, toStr);
    }

    public static int lastDay(Date date) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(date);

        int lastDay = gc.getActualMaximum(Calendar.DATE);

        logger.trace("LASTDAY(" + convDateToString(date) + ")=" + lastDay);
        return lastDay;
    }

    /**
     * Get the last date in the month containing the received date
     * 
     * @param date the date to process
     * @return the last date of the month
     */
    public static Date lastDate(Date date) {

        int lastDay = lastDay(date);

        Calendar gc = new GregorianCalendar();
        gc.setTime(date);

        gc.set(Calendar.DAY_OF_MONTH, lastDay);

        Date lastDate = gc.getTime();

        logger.trace("LASTDAY(" + convDateToString(lastDate) + ")=" + lastDay);
        return lastDate;
    }

    public static List<Date> createRequestList(String fromStr, String toStr) {

        logger.debug("Entering createRequestList(" + fromStr + "," + toStr + ")");

        List<Date> dateList = new ArrayList<Date>();
        if (fromStr == null || fromStr.equals("") || toStr == null || toStr.equals("")) {
            logger.error("Invalid from-to parameters, returning an empty DATE list.");
            return dateList;
        }

        Date from = convStringToDate(fromStr);

        if (fromStr.equals(toStr)) {
            dateList.add(from);
            return dateList;
        }

        Date to = convStringToDate(toStr);

        if (to.before(from)) {
            logger.error("Invalid from-to parameters: from must come before to. Returning an empty DATE list.");
            return dateList;
        }

        Date lastDate = lastDate(from);

        if (to.before(lastDate)) {
            int fromDay = getDay(from);
            int toDay = getDay(to);
            for (int i = fromDay; i <= toDay; i++) {
                Date d = makeDate(from, i);
                dateList.add(d);
            }
            return dateList;
        }

        int fromDay = getDay(from);
        int lastDay = lastDay(from);

        for (int i = fromDay; i <= lastDay; i++) {
            Date d = makeDate(from, i);
            dateList.add(d);
        }

        Date firstDate = firstDate(to);
        int toDay = getDay(to);
        for (int i = 1; i <= toDay; i++) {
            Date d = makeDate(firstDate, i);
            dateList.add(d);
        }
        return dateList;
    }

    /**
     * Get the first date in the month containing the received date
     * 
     * @param date the date to process
     * @return the last date of the month
     */
    public static Date firstDate(Date date) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(date);

        gc.set(Calendar.DAY_OF_MONTH, 1);

        Date firstDate = gc.getTime();

        logger.trace("FRIST-DATE(" + convDateToString(date) + ")=" + convDateToString(firstDate));

        return firstDate;
    }

    /**
     * Creates a new Date as: - the base time of the the received booking (zero time) - add the received hours - add the
     * received minutes
     * 
     * @param bookingDay the day to normalize
     * @param fromTime the hours to add at base day
     * @param fromMinute the minutes to add at base day
     * @return the new Date
     */
    public static Date createDateInMinute(Date bookingDay, Date fromTime) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(bookingDay);
        gc.set(Calendar.SECOND, 0);
        gc.set(Calendar.MILLISECOND, 0);

        Calendar gc2 = new GregorianCalendar();
        gc2.setTime(fromTime);
        gc.set(Calendar.HOUR_OF_DAY, gc2.get(Calendar.HOUR_OF_DAY));
        gc.set(Calendar.MINUTE, gc2.get(Calendar.MINUTE));

        return gc.getTime();
    }

    /**
     * Created a new Date in function of received parameters: - reset the received Date to the start of the day - add
     * the received hours - zeros the remaining parameters
     * 
     * @param date the Date to normalize
     * @param hoursBeforeClose the hours to add
     * @return the normalized Date
     */
    public static Date createDateInMinute(Date date, Integer fromHour) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(date);
        int hh = gc.get(Calendar.HOUR_OF_DAY) + new Integer(fromHour);
        gc.set(Calendar.HOUR_OF_DAY, hh);

        return gc.getTime();
    }

    public static Date addOneDay(Date date) {

        long milli = date.getTime();
        milli += DAY_IN_MILLI;
        Date newdate = new Date(milli);
        return newdate;
    }

    public static Date subOneDay(Date date) {

        long milli = date.getTime();
        milli -= DAY_IN_MILLI;
        Date newdate = new Date(milli);
        return newdate;
    }

    public static Date initDay(Date dd) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(dd);

        gc.set(Calendar.HOUR_OF_DAY, 0);
        gc.set(Calendar.MINUTE, 0);
        gc.set(Calendar.SECOND, 0);
        gc.set(Calendar.MILLISECOND, 0);

        return gc.getTime();
    }

    public static Date endDay(Date dd) {

        Date newDate = initDay(dd);

        Calendar gc = new GregorianCalendar();
        gc.setTime(newDate);

        gc.set(Calendar.HOUR_OF_DAY, 23);
        gc.set(Calendar.MINUTE, 59);
        gc.set(Calendar.SECOND, 59);
        gc.set(Calendar.MILLISECOND, 0);

        return gc.getTime();
    }

    /**
     * Get the last day of the month received as parameter
     * 
     * @param year the 4-digit year containing the month:1800,2010,...
     * @param month is a number in the range 0-11
     * @return the last day in the received month, one of: {28,29,30,31}
     */
    public static int getLastDayOfTheMonth(int year, int month) {

        logger.trace("YEAR=" + year + ", MONTH=" + month);

        Calendar gc = new GregorianCalendar();
        gc.set(Calendar.YEAR, year);
        gc.set(Calendar.MONTH, month);
        gc.set(Calendar.DAY_OF_MONTH, 1);

        int lastDay = gc.getActualMaximum(Calendar.DATE);
        logger.trace("LASTDAY(" + year + "," + month + ")=" + lastDay);

        gc.set(Calendar.DATE, lastDay);
        int lastDow = gc.get(Calendar.DAY_OF_WEEK);
        logger.trace("LASTDOW(" + year + "," + month + ")=" + lastDow);

        return lastDay;
    }

    public static List<String> getCols(Integer year, Integer month) {

        List<String> cols = new ArrayList<String>();

        int lastDay = getLastDayOfTheMonth(year, month);

        for (int i = 1; i <= lastDay; i++) {
            String s = String.format("%1$02d", i);
            cols.add(s);
        }

        return cols;
    }

    public static String convDateToDow(Date date) {

        Calendar cal = new GregorianCalendar();
        cal.setTime(date);
        String strDateFormat = "E";
        SimpleDateFormat sdf = new SimpleDateFormat(strDateFormat);
        String dow = sdf.format(date);
        logger.trace("DayOfWeek=" + dow);
        return dow;
    }

    /**
     * Computes the difference between the to and from Date received as parameter and returns the number of hours in
     * that range
     * 
     * @param to the begin date
     * @param from the end date
     * @return the hours as difference of the two dates
     */
    public static int getHours(Date to, Date from) {

        long secs = getSecs(to, from);
        long minutes = secs / 60;
        long hours = minutes / 60;

        return (int) hours;
    }

    /**
     * Computes the difference between the to and from Date received as parameter and returns the rest in minutes in
     * that range
     * 
     * @param to the begin date
     * @param from the end date
     * @return the rest of the difference of the two dates
     */
    public static int getMinutes(Date to, Date from) {

        long secs = getSecs(to, from);

        int minutes = (int) ((secs / 60) % 60);

        return minutes;
    }

    private static long getSecs(Date to, Date from) {

        Calendar gcTo = new GregorianCalendar();
        gcTo.setTime(to);

        Calendar gcFrom = new GregorianCalendar();
        gcFrom.setTime(from);

        long diffInMilli = gcTo.getTimeInMillis() - gcFrom.getTimeInMillis();

        Calendar diff = new GregorianCalendar();
        diff.setTimeInMillis(diffInMilli);

        long secs = diffInMilli / 1000;
        return secs;
    }

    public static boolean isSunday(Date date) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(date);

        int dayOfTheWeek = gc.get(Calendar.DAY_OF_WEEK);

        if (dayOfTheWeek == Calendar.SUNDAY) {
            return true;
        }
        return false;
    }

    public static String printDate(long dateInMilli) {

        Date dd = new Date(dateInMilli);
        return printDate(dd);
    }

    public static String printDate(Date loverBoundDay) {

        Calendar gc = new GregorianCalendar();
        gc.setTime(loverBoundDay);
        int yy = gc.get(Calendar.YEAR);
        int mm = gc.get(Calendar.MONTH) + 1;
        int dd = gc.get(Calendar.DAY_OF_MONTH);
        int hh = gc.get(Calendar.HOUR_OF_DAY);
        int mi = gc.get(Calendar.MINUTE);
        int ss = gc.get(Calendar.SECOND);
        int ms = gc.get(Calendar.MILLISECOND);

        String st = yy + "/" + mm + "/" + dd + " " + hh + ":" + mi + ":" + ss + "-" + ms;
        return st;
    }

    /**
     * Gauss algorithm per il calcolo della Pasqua Cristiana. http://it.wikipedia.org/wiki/Calcolo_della_Pasqua
     * 
     * a = Y mod 19 b = Y mod 4 c = Y mod 7 Poi si calcolano d = (19a + M) mod 30 e = (2b + 4c + 6d + N) mod 7
     * 
     * ---Anni-- M N 1583-1699 22 2 1700-1799 23 3 1800-1899 23 4 1900-2099 24 5 2100-2199 24 6 2200-2299 25 0 2300-2399
     * 26 1 2400-2499 25 1
     * 
     * In Italia: M=24, N=5
     * 
     * Se (d + e) < 10, allora la Pasqua cade il giorno (d + e + 22) del mese di marzo, altrimenti si verifichera' il (d
     * + e - 9)-esimo giorno del mese di aprile.
     * 
     * Si tenga tuttavia conto delle seguenti eccezioni: Se la data risultante dalla formula e' il 26 aprile, allora la
     * Pasqua cadra' il giorno 19 aprile; Se la data risultante dalla formula e' il 25 aprile e contemporaneamente d =
     * 28, e = 6 e a > 10, allora la Pasqua cadra' il 18 aprile.
     * 
     * @return
     */
    public static Date getEaster(int year) {

        int day, month;

        int a = year % 19;
        int b = year % 4;
        int c = year % 7;

        int d = (19 * a + M) % 30;
        int e = (2 * b + 4 * c + 6 * d + N) % 7;

        if (d + e < 10) {
            month = Calendar.MARCH;
            day = d + e + 22;
        } else {
            month = Calendar.APRIL;
            day = d + e - 9;
            if (day == 25 && d == 28 && e == 6 && a > 10) {
                day = 18;
            }
            if (day == 26) {
                day = 19;
            }
        }

        Calendar gc = new GregorianCalendar();
        gc.set(Calendar.YEAR, year);
        gc.set(Calendar.MONTH, month);
        gc.set(Calendar.DAY_OF_MONTH, day);

        return gc.getTime();
    }

    public static int getEasterDay(int year) {

        Date dd = getEaster(year);
        Calendar gc = new GregorianCalendar();
        gc.setTime(dd);

        return gc.get(Calendar.DAY_OF_MONTH);
    }

}
