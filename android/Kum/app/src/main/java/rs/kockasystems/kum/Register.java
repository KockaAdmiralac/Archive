package rs.kockasystems.kum;

import android.os.Bundle;
import android.app.Activity;
import android.os.Environment;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;

import java.io.File;

import rs.kockasystems.Commons;

public class Register extends Activity
{
    EditText username, password, confirmPassword;
    ListView listView;
    ArrayAdapter<String> adapter;
    File checkoutDump, paymentsDump, databaseDump;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.register);
        username = (EditText) findViewById(R.id.username);
        password = (EditText) findViewById(R.id.password);
        confirmPassword = (EditText) findViewById(R.id.confirmPassword);
        listView = (ListView) findViewById(R.id.adminsList);
        adapter = new ArrayAdapter<>(this, R.layout.admin_element, Main.database.adminNames);
        listView.setAdapter(adapter);
        listView.setChoiceMode(ListView.CHOICE_MODE_SINGLE);
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener()
        {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id)
            {
                Commons.dialogArguments.putString("adminName", Main.database.adminNames[position]);
                Commons.startDialog(getFragmentManager(), new DialogDelete());
            }
        });
        refreshList();
        File dir = new File(Environment.getExternalStorageDirectory() + "/data-dump");
        dir.mkdirs();
        checkoutDump = new File(dir, Commons.FILE_DUMP_CHECKOUT);
        paymentsDump = new File(dir, Commons.FILE_DUMP_PAYMENT);
        databaseDump = new File(dir, Commons.FILE_DUMP_DATABASE);
    }

    public void refreshList()
    {
        adapter = new ArrayAdapter<>(this, R.layout.admin_element, Main.database.adminNames);
        listView.setAdapter(adapter);
    }

    public void registerClick(View v)
    {
        String pass = password.getText().toString();
        if (confirmPassword.getText().toString().equals(pass))
        {
            String name = username.getText().toString();
            for (int i = 0; i < Main.database.adminNames.length; ++i) if (Main.database.adminNames[i].equals(name))
            {
                Commons.toast(this, getString(R.string.error_same_admin));
                return;
            }
            if (Main.database.registerNewAdmin(name, pass))
            {
                Commons.toast(this, getString(R.string.success_admin_register));
                if (!Main.database.refreshAdmins()) Commons.toast(this, Commons.error(this, R.string.error_refresh_admins));
                else refreshList();
            }
            else Commons.toast(this, Commons.error(this, R.string.error_register_admin));
        }
        else Commons.toast(this, getString(R.string.error_match_password));
    }

    public void exportCheckouts(View v) { Commons.toast(this, Main.database.dumpTable(checkoutDump, Commons.QUERY_SELECT_CHECKOUTS, 3) ? getString(R.string.success_dump_checkouts)    : Commons.error(this, R.string.error_dump_checkouts));   }
    public void exportPayments(View v)  { Commons.toast(this, Main.database.dumpTable(paymentsDump, Commons.QUERY_SELECT_PAYMENTS,  4) ? getString(R.string.success_dump_payments)     : Commons.error(this, R.string.error_dump_payments));   }
    public void dumpDatabase(View v) { Commons.copyFile(getDatabasePath("data"), databaseDump); }

}