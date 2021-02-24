package rs.kockasystems.krompirko;


import android.app.Activity;
import android.content.Intent;
import android.app.Notification;
import android.app.NotificationManager;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MenuInflater;
import android.widget.TextView;
import android.widget.EditText;


public class MainActivity extends Activity 
{
	TextView txt1;
	EditText box1;
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
        try{setContentView(R.layout.main);}
		catch(Exception e){notification("Error",e.getMessage());}
		txt1 = (TextView)findViewById(R.id.txt1);
		box1 = (EditText)findViewById(R.id.box1);
		
    }
	@Override
	public boolean onCreateOptionsMenu(Menu menu){
		MenuInflater inf = getMenuInflater();
		inf.inflate(R.menu.action_bar, menu);
		return super.onCreateOptionsMenu(menu);
	}
	@Override
	public boolean onOptionsItemSelected(MenuItem item){
		Intent newFile = new Intent(this, NewFileActivity.class);
		Intent email = new Intent(this, EmailActivity.class);
		switch(item.getItemId()){
			case R.id.action_bar_button: startActivity(newFile); break;
			case R.id.action_bar_button2: startActivity(email);
		}
		return super.onOptionsItemSelected(item);
	}
	/*
	@Override
	public void onRestoreInstanceState(Bundle savedState){
		super.onRestoreInstanceState(savedState);
		if(savedState != null){
			box1.setText(savedState.get("Text"));
			notification("Restore","Text restored.");
		}
	}
	
	@Override
	public void onResume(){
		super.onResume();
		notification("Start","App started.");
	}
	@Override
	public void onPause(){
		super.onPause();
		notification("Resume","App resumed.");
	}
	@Override
	public void onDestroy(){
		super.onDestroy();
		notification("Destroy","App destroyed.");
		android.os.Debug.stopMethodTracing();
	}
	@Override
	public void onStart(){
		super.onStart();
		notification("Start","App started.");
	}
	@Override
	public void onRestart(){
		super.onRestart();
		notification("Restart","App restarted.");
	}
	@Override
	public void onStop(){
		super.onStop();
		notification("Stop","App stopped.");
	}
	@Override
	public void onSaveInstanceState(Bundle savedInstanceState){
		super.onSaveInstanceState(savedInstanceState);
		savedInstanceState.putString("Text",txt1.getText().toString());
	}
	*/
}
