package rs.kockasystems.kum;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.widget.EditText;

import rs.kockasystems.Commons;

public class Main extends Activity
{
    private static final String ROOT_USERNAME = "root";
    private static final String ROOT_PASSWORD = "Beograd2#14";

    public static Database database;
    EditText username, password;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        database = new Database(this);
        if(!database.initialize())
        {
            // If initializing database failed, exit the application
            Commons.toast(this, Commons.error(this, R.string.error_initializing_database));
            finish();
        }
        setContentView(R.layout.main);
        username = (EditText)findViewById(R.id.username);
        password = (EditText)findViewById(R.id.password);
        if(!Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState()))
        {
            Commons.toast(this, Commons.error(this, R.string.error_external_storage));
            finish();
        }
    }

    public void buttonClick(View v)
    {
        String name = username.getText().toString(), pass = password.getText().toString();
        if(name.equals(ROOT_USERNAME) && pass.equals(ROOT_PASSWORD)) startActivity(new Intent(this, Register.class));
        else if(database.checkAdmin(name, pass)) startActivity(new Intent(this, Admin.class));
        else Commons.toast(this, getString(R.string.error_invalid_password));
    }
}
