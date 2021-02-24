package rs.kockasystems.vucic;

import android.app.*;
import android.os.Bundle;
import android.os.StrictMode;
import android.view.View;
import android.widget.TextView;
import android.widget.Button;
import android.widget.EditText;
import android.content.Context;
import android.content.Intent;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.Dictionary;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import java.util.Map;
import java.util.HashMap;

public class MainActivity extends Activity 
{
	Map<String, String> user;
	Button button1;
	Button button2;
	TextView txt1;
	EditText box1;
	EditText box2;
	
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		button1 = (Button)findViewById(R.id.button);
		button2 = (Button)findViewById(R.id.button2);
		box1 = (EditText)findViewById(R.id.box1);
		box2 = (EditText)findViewById(R.id.box2);
		txt1 = (TextView)findViewById(R.id.txt1);
		user = new HashMap<String, String>();
	}
	public boolean connect(){	
	    String db_url = "http://127.0.0.1:8080/include/realnoBezvezeProgram.php?username="+box1.getText()+"&password="+box2.getText();
		HttpClient client = new DefaultHttpClient();
		try{
			HttpGet request = new HttpGet();
			request.setURI(new URI(db_url));
			StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().permitAll().build());
			HttpResponse response = client.execute(request);
			BufferedReader in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
			StringBuffer sb = new StringBuffer("");
			String line;
			while((line = in.readLine()) != null)sb.append(line);
	        in.close();
			if(sb.toString() == "") return false;
			String[] params = sb.toString().split("///");
			user.put("name",params[0]);
			user.put("surname",params[1]);
			user.put("rank",params[2]);
			user.put("description",params[3]);
			return true;
		}
		catch(Exception e){return false;}
	}
	public void button1_Click(View v){
		connect();
	}
	
	public void button2_Click(View v){
		Intent intent = new Intent(this, NotificationReceiverActivity.class);
		PendingIntent pintent = PendingIntent.getActivity(this, 0, intent, 0);
		NotificationManager notifmgr = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);
        Notification notif = new Notification.Builder(this)
		    .setContentTitle("lol")
			.setContentText("lol")
			.setSmallIcon(R.drawable.ic_launcher)
			.setContentIntent(pintent)
			.setAutoCancel(true)
			.addAction(R.drawable.ic_launcher, "Answer", pintent)
			.build();
		notifmgr.notify(0, notif);
	}
}
