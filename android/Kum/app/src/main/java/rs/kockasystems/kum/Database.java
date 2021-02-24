package rs.kockasystems.kum;

import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.Cursor;
import android.app.Activity;

import java.io.File;
import java.util.Date;
import rs.kockasystems.Commons;

/**
 * {@code Database} is a database helper used throughout whole application
 *
 * @see SQLiteOpenHelper
 */
public class Database extends SQLiteOpenHelper
{
    /**
     * {@code Cursor} used temporarily.
     */
    private Cursor tempCursor;

    /**
     * Original {@code Activity} that initialized the database.
     */
    private Activity app;

    /**
     * {@code SQLiteDatabase} that is set after database initialization.
     */
    private SQLiteDatabase database;

    /**
     * Username of currently logged in admin.
     */
    public String loggedInAdmin;

    /**
     * List of admin names, used when populating {@code ListView}s.
     */
    public String[] adminNames;

    /**
     * List of user names, used when populating {@code ListView}s.
     */
    public String[] userNames;

    /**
     * List of user QR codes, used in callbacks from {@code ListView}s.
     */
    public String[] userQRs;

    /**
     * Constructs a new {@code Database}
     *
     * @param app original activity initializing the database
     */
    public Database(final Activity app)
    {
        super(app, "data", null, 1);
        this.app = app;
    }

    /**
     * Called when the database is created for the first time. This is where the
     * creation of tables and the initial population of the tables should happen.
     *
     * @param db The database.
     */
    @Override
    public void onCreate(final SQLiteDatabase db) { }

    /**
     * Called when the database needs to be upgraded. The implementation
     * should use this method to drop tables, add tables, or do anything else it
     * needs to upgrade to the new schema version.
     *
     * @param db The database.
     * @param oldVersion The old database version.
     * @param newVersion The new database version.
     */
    @Override
    public void onUpgrade(final SQLiteDatabase db, final int oldVersion, final int newVersion) {  }

    /**
     * Initializes the database.
     *
     * @return if the database initialized correctly.
     */
    public boolean initialize()
    {
        try
        {
            this.database = getWritableDatabase();
            for(int i=0; i<4; ++i) database.execSQL(Commons.QUERY_CREATE_TABLES[i]);
            return refreshAdmins() && refreshUsers();
        }
        catch(final Exception e) { e.printStackTrace(); }
        return false;
    }

    /**
     * Checks if admin has logged in successfully.
     *
     * @param username user name of the admin
     * @param password specified password
     * @return if admin username and password match
     */
    public boolean checkAdmin(final String username, final String password)
    {
        // WARN: This protects from basic SQL injection attacks. It cannot stop people that hack SQL for their living
        tempCursor = database.rawQuery(Commons.QUERY_LOG_IN, new String[]{username, password});
        tempCursor.moveToFirst();
        if(tempCursor.getCount() == 0) return false;
        loggedInAdmin = tempCursor.getString(tempCursor.getColumnIndex("name"));
        return true;
    }

    /**
     * Registers a new {@code User}
     *
     * @param name name of the new user
     * @param surname surname of the new user
     * @param qr QR code of the new user
     * @return if user registered successfully.
     */
    public boolean registerNewUser(String name, String surname, String qr)
    {
        try
        {
            database.execSQL(Commons.QUERY_NEW_USER, new String[]{qr, name, surname});
            return refreshUsers();
        }
        catch(Exception e) { e.printStackTrace(); }
        return false;
    }

    /**
     * Refreshes {@code userNames} array.
     *
     * @todo Fix code duplication
     * @return if {@code userNames} is refreshed successfully.
     */
    public boolean refreshUsers()
    {
        try
        {
            tempCursor = database.rawQuery(Commons.QUERY_SELECT_USERS, null);
            tempCursor.moveToFirst();
            userNames = new String[tempCursor.getCount()];
            userQRs = new String[tempCursor.getCount()];
            for(int i=0; i<tempCursor.getCount(); ++i)
            {
                userNames[i] = tempCursor.getString(tempCursor.getColumnIndex("name")) + " " + tempCursor.getString(tempCursor.getColumnIndex("surname"));
                userQRs[i] = tempCursor.getString(tempCursor.getColumnIndex("id"));
                tempCursor.moveToNext();
            }
            return true;
        }
        catch(Exception e){ e.printStackTrace(); }
        return false;
    }

    /**
     *
     * @param name admin name
     * @param password
     * @return
     */
    public boolean registerNewAdmin(String name, String password)
    {
        try
        {
            database.execSQL(Commons.QUERY_REGISTER_ADMIN, new String[]{name, password});
            return refreshAdmins();
        }
        catch(Exception e){ e.printStackTrace(); }
        return false;
    }

    public boolean newCheckout(String qr)
    {
        try
        {
            database.execSQL(Commons.QUERY_NEW_CHECKOUT, new String[]{Commons.timestampFormat.format(new Date()), loggedInAdmin, qr});
            return true;
        }
        catch(Exception e){ e.printStackTrace(); }
        return false;
    }

    public boolean newPayment(String qr, int terms)
    {
        try
        {
            database.execSQL(Commons.QUERY_NEW_PAYMENT, new String[]{ Commons.timestampFormat.format(new Date()), loggedInAdmin, qr, terms + "" });
            return true;
        }
        catch(Exception e){ e.printStackTrace(); }
        return false;
    }

    public User getUserByQR(String qr)
    {
        tempCursor = database.rawQuery(Commons.QUERY_SELECT_USER, new String[]{qr});
        tempCursor.moveToFirst();
        if(tempCursor.getCount() == 0)
        {
            Commons.toast(app, app.getString(R.string.error_no_user));
            return null;
        }
        else return new User(tempCursor.getString(tempCursor.getColumnIndex("id")), tempCursor.getString(tempCursor.getColumnIndex("name")), tempCursor.getString(tempCursor.getColumnIndex("surname")), tempCursor.getString(tempCursor.getColumnIndex("terms")));
    }

    public boolean updateUserTerms(String qr, String newTerms)
    {
        try
        {
            database.execSQL(Commons.QUERY_UPDATE_TERMS, new String[]{newTerms, qr});
            return true;
        }
        catch(Exception e) { e.printStackTrace(); }
        return false;
    }

    public boolean refreshAdmins()
    {
        // TODO: Fix code duplication
        try
        {
            tempCursor = database.rawQuery(Commons.QUERY_SELECT_ADMINS, null);
            tempCursor.moveToFirst();
            adminNames = new String[tempCursor.getCount()];
            for(int i=0; i<tempCursor.getCount(); ++i)
            {
                adminNames[i] = tempCursor.getString(tempCursor.getColumnIndex("name"));
                tempCursor.moveToNext();
            }
            return true;
        }
        catch (Exception e){ e.printStackTrace(); }
        return false;
    }

    public boolean deleteAdmin(String name)
    {
        try
        {
            database.execSQL(Commons.QUERY_DELETE_ADMIN, new String[]{name});
            return refreshAdmins();
        }
        catch(Exception e){ e.printStackTrace(); }
        return false;
    }

    public boolean deleteUser(int pos)
    {
        try
        {
            database.execSQL(Commons.QUERY_DELETE_USER, new String[]{userQRs[pos]});
            return refreshUsers();
        }
        catch(Exception e){ e.printStackTrace(); }
        return false;
    }

    public boolean addTerms(String qr, boolean next, int number)
    {
        User temp = getUserByQR(qr);
        if(temp == null) return false;
        temp.terms[Commons.month + (next ? 1 : 0)] += number;
        return updateUserTerms(qr, temp.getTerms());
    }

    public boolean dumpTable(File file, String query, int columns)
    {
        try
        {
            String contents = "";
            tempCursor = database.rawQuery(query, null);
            tempCursor.moveToFirst();
            for(int i=0; i<tempCursor.getCount(); ++i)
            {
                for(int j=0; j<columns; ++j) contents += tempCursor.getString(j) + "\t";
                contents += "\n";
                tempCursor.moveToNext();
            }
            return Commons.writeToFile(file, contents);
        }
        catch(Exception e){ e.printStackTrace(); }
        return false;
    }

}