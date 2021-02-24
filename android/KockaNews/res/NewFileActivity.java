package rs.kockasystems.krompirko;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import java.io.File;
import java.io.FileOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.widget.EditText;
import android.content.Context;

public class NewFileActivity extends Activity
{
	EditText box1, box2;
	FileOutputStream fos;
	public void notification(String title, String text){
		NotificationManager notifmgr = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);
		Notification notif = new Notification.Builder(this)
			.setContentTitle(title)
		    .setContentText(text)
			.setSmallIcon(R.drawable.ic_launcher)
			.build();
	    notifmgr.notify(0, notif);
	}
	@Override
	protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.new_file);
		box1 = (EditText)findViewById(R.id.box1);
		box2 = (EditText)findViewById(R.id.box2);
		
    }
	public void makeFile(View v){
		Context con = null;
		notification("Creating...","Creating file...");
		try{
			File s = con.getFilesDir();
			notification("Yay","A");
			File file = new File(con.getFilesDir(), box1.getText().toString());
			notification("Yay","O");
			BufferedWriter writer = new BufferedWriter(new FileWriter(file));
			notification("Yay","B");
			writer.write(box2.getText().toString());
			notification("Yay","C");
			BufferedReader reader = new BufferedReader(new FileReader(file));
			notification("Yay","D");
			notification("File",reader.readLine());
		}
		catch(Exception e){notification(e.getCause().toString(),e.getMessage());}
	}
}
