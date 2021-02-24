/******** KOCKA-SYSTEMS APPLICATION ********
 * Author : KockaAdmiralac<1405223@gmail.com>
 * Last release date : 07/06/2015
 * Package : com.kockasystems.kesic
 */

package rs.kockasystems.kesic;

/* -*- IMPORTS -*-
 * This is where we import other libraries' 
 * classes into the project
 */

import android.os.Bundle;
import android.os.StrictMode;
import android.app.Activity;
import android.view.View;
import android.widget.Toast;
import android.widget.TextView;
import android.widget.EditText;
import android.content.Intent;
import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URI;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import com.jcraft.jsch.*;

/* -*- CLASSES -*-
 * This is where classes are defined
 */

public class MainActivity extends Activity 
{
	/* -*- PUBLIC VARIABLES -*-
	 * This is a place where public variables are defined
	 */
	TextView txt;    // Welcome message text view
	EditText box1;   // Username text box
	EditText box2;   // Password text box
	String username; // The entered username
	String password; // The entered password
	
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
		/* -*- BUILTIN FUNCTION -*-
		 * A function for Activity creation callback 
		 */
		super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		txt = (TextView)findViewById(R.id.txt);
		box1 = (EditText)findViewById(R.id.box1);
		box2 = (EditText)findViewById(R.id.box2);
		readCache();
	}
	
	public void button_Click(View v){
		/* -*- BUILTIN FUNCTION -*-
		 * A function for handling the change article button click 
		 */
		username = box1.getText().toString();
		password = box2.getText().toString();
		box1.setText("");
		box2.setText("");
		if(connect()){
			try{
				OutputStream os = new FileOutputStream(new File(getApplicationContext().getFilesDir(), "user.txt"));
				OutputStreamWriter osw = new OutputStreamWriter(os);
				osw.append(String.format("%s///%s///%s///%s", getSharedPreferences("user", MODE_PRIVATE).getString("name",""), getSharedPreferences("user", MODE_PRIVATE).getString("surname",""), getSharedPreferences("user", MODE_PRIVATE).getString("rank",""), getSharedPreferences("user", MODE_PRIVATE).getString("description","")));
				osw.close();
				startActivity(new Intent(this, NewsActivity.class));
			}
			catch(Exception e){e.printStackTrace();}
		}
	}
	
	public boolean connect(){
		/* -*- NEW FUNCTION -*-
		 * A function for authenticating the user on the server.
		 * It sends a request to a page, and receives an parsed string
		 * which represents the user's data
		 * 
		 * Returns : 
		 * * True if user has successfully authenticated
		 * * False otherwise
		 */
	    final String db_url = String.format("%s?username=%s&password=%s", getResources().getString(R.string.db_url), username, password);
		try{
			HttpGet request = new HttpGet();
			request.setURI(new URI(db_url));
			StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().permitAll().build());
			BufferedReader in = new BufferedReader(new InputStreamReader(new DefaultHttpClient().execute(request).getEntity().getContent()));
			StringBuffer sb = new StringBuffer("");
			String line;
			while((line = in.readLine()) != null)sb.append(line);
	        in.close();
			return logIn(sb.toString());
		}
		catch(Exception e){Toast.makeText(MainActivity.this, getResources().getString(R.string.connect_error), Toast.LENGTH_SHORT).show();return false;}
	}
	
	public boolean logIn(String data){
		/* -*- NEW FUNCTION -*-
		 * A function for setting the user's data by : 
		 * * Splitting the received string to 4 words which represent user's: 
		 * * * Name
		 * * * Surname
		 * * * Rank
		 * * * Description
		 * * Setting the user's data (above said)
		 */
		try{
			String[] params = data.split("///");
			getSharedPreferences("user",MODE_PRIVATE).edit()
			    .clear()
				.putString("name",params[0])
				.putString("surname",params[1])
				.putString("rank",params[2])
				.putString("description",params[3])
				.commit();
			Toast.makeText(MainActivity.this, getResources().getString(R.string.login_success), Toast.LENGTH_SHORT).show();
			return true;
		}
		catch(Exception e){Toast.makeText(MainActivity.this, getResources().getString(R.string.login_fail), Toast.LENGTH_SHORT).show();e.printStackTrace(); return false;}
	}
	
	public void readCache(){
		/* -*- NEW FUNCTION -*-
		 * A function for reading the private file user.txt,
		 * parsing it, and logging in with it.
		 */
		try{
			InputStream is = new FileInputStream(new File(getApplicationContext().getFilesDir(), "user.txt"));
			BufferedReader in = new BufferedReader(new InputStreamReader(is));
			StringBuffer sb = new StringBuffer("");
			String line;
			while((line = in.readLine()) != null)sb.append(line);
	        in.close();
			is.close();
			if(logIn(sb.toString()))startActivity(new Intent(this, NewsActivity.class));
		}
		catch(Exception e){
			try{new File(getApplicationContext().getFilesDir(), getApplicationContext().getResources().getString(R.string.user_cache_file)).createNewFile();}
			catch(Exception f){f.printStackTrace();}
		}
	}
}

/******** THE END ********/
