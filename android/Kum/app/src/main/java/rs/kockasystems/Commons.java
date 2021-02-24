package rs.kockasystems;

import android.app.Activity;
import android.app.DialogFragment;
import android.app.FragmentManager;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import rs.kockasystems.kum.R;


public class Commons
{
    // Private variables
    private static final String ACTION_SCAN = "com.google.zxing.client.android.SCAN";
    private static final String DIALOG_TAG  = "rs.kockasystems.kum.Dialog";
    private static final String SCAN_MODE   = "QR_CODE_MODE";

    // File names
    public static final String FILE_DUMP_CHECKOUT   = "checkout-dump.txt";
    public static final String FILE_DUMP_PAYMENT    = "payment-dump.txt";
    public static final String FILE_DUMP_DATABASE   = "data.sqlite3";

    // Requests
    public static final int QR_PAYMENT_SCAN_REQUEST = 53729;
    public static final int QR_USER_SCAN_REQUEST = 53730;
    public static final int QR_ADD_TERMS_SCAN_REQUEST = 53731;

    // SQL queries
    // CREATE TABLE queries
    public static final String[] QUERY_CREATE_TABLES    = {
            "CREATE TABLE IF NOT EXISTS `users` (id VARCHAR(50), name VARCHAR(50) NOT NULL, surname VARCHAR(50) NOT NULL, terms VARCHAR(255), PRIMARY KEY (id))",
            "CREATE TABLE IF NOT EXISTS `admins` (id INT AUTO_INCREMENT, name VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY (id))",
            "CREATE TABLE IF NOT EXISTS `payments` (time VARCHAR(40), admin INT, user VARCHAR(255), terms INT, PRIMARY KEY(time))",
            "CREATE TABLE IF NOT EXISTS `checkouts` (time VARCHAR(40), admin INT, user VARCHAR(255), PRIMARY KEY(time))"
    };
    // SELECT queries
    public static final String QUERY_SELECT_USERS       = "SELECT * FROM `users`";
    public static final String QUERY_SELECT_ADMINS      = "SELECT * FROM `admins`";
    public static final String QUERY_SELECT_CHECKOUTS   = "SELECT * FROM `checkouts`";
    public static final String QUERY_SELECT_PAYMENTS    = "SELECT * FROM `payments`";
    // SELECT...WHERE queries
    public static final String QUERY_SELECT_USER        = "SELECT * FROM `users` WHERE `id` = ?";
    public static final String QUERY_LOG_IN             = "SELECT * FROM `admins` WHERE `name` = ? AND `password` = ? LIMIT 1";
    // INSERT INTO queries
    public static final String QUERY_REGISTER_ADMIN     = "INSERT INTO `admins` (name, password) VALUES(?, ?)";
    public static final String QUERY_NEW_CHECKOUT       = "INSERT INTO `checkouts` VALUES(?, ?, ?)";
    public static final String QUERY_NEW_USER           = "INSERT INTO `users` VALUES(?, ?, ?, '')";
    public static final String QUERY_NEW_PAYMENT        = "INSERT INTO `payments` VALUES(?, ?, ?, ?)";
    // UPDATE queries
    public static final String QUERY_UPDATE_TERMS       = "UPDATE `users` SET `terms`= ? WHERE `id`= ?";
    // DELETE queries
    public static final String QUERY_DELETE_ADMIN       = "DELETE FROM `admins` WHERE `name` = ?";
    public static final String QUERY_DELETE_USER        = "DELETE FROM `users` WHERE `id`= ?";

    // Other
    public static final SimpleDateFormat timestampFormat = new SimpleDateFormat("yyyyMMddHHmmssS");
    public static final int month = Integer.parseInt(new SimpleDateFormat("MM").format(new Date())) - 1;
    public static Bundle dialogArguments = new Bundle();

    public static void toast(final Context c, final String text) { Toast.makeText(c, text, Toast.LENGTH_LONG).show(); }

    public static String error(final Activity app, final int whilst) { return app.getString(R.string.error_base) + " " + app.getString(whilst) + "."; }

    public static void scanQR(final Activity app, final int requestCode)
    {
        try
        {
            final Intent intent = new Intent(ACTION_SCAN);
            intent.putExtra("SCAN_MODE", SCAN_MODE);
            app.startActivityForResult(intent, requestCode);
        }
        catch(final ActivityNotFoundException ex) { toast(app, app.getString(R.string.error_no_scanner)); }
    }

    public static String readFromFile(final File file)
    {
        try
        {
            final FileReader read = new FileReader(file);
            final BufferedReader br = new BufferedReader(read);
            String ret = "", temp;
            while((temp = br.readLine()) != null) ret += temp;
            br.close();
            read.close();
            return ret;
        }
        catch(final Exception e) { e.printStackTrace(); }
        return null;
    }

    public static boolean writeToFile(final File file, final String text)
    {
        try
        {
            final FileOutputStream fos = new FileOutputStream(file);
            final PrintWriter pw = new PrintWriter(fos);
            pw.println(text);
            pw.flush();
            pw.close();
            fos.close();
            return true;
        }
        catch(final IOException e)
        {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean copyFile(final File fromFile, final File toFile)
    {
        try
        {
            final String temp = readFromFile(fromFile);
            if(temp != null) return writeToFile(toFile, temp);
        }
        catch(final Exception e) { e.printStackTrace(); }
        return false;
    }

    public static void startDialog(final FragmentManager fm, final DialogFragment dialog)
    {
        dialog.setArguments(dialogArguments);
        dialog.show(fm, DIALOG_TAG);
    }

}