package rs.kockasystems.vucic;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.os.Bundle;


public class NotificationReceiverActivity extends Activity
{
	@Override
	protected void onCreate(Bundle savedInstanceState){
			super.onCreate(savedInstanceState);
		try{
			setContentView(R.layout.notification);
		}
		catch(Exception e){
			NotificationManager notifmgr = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);
			Notification notif = new Notification.Builder(this)
				.setContentTitle("Error")
				.setStyle(new Notification.BigTextStyle().bigText(e.getMessage()))
				.setSmallIcon(R.drawable.ic_launcher)
				.build();
			notifmgr.notify(0, notif);
			
			
		}
	}
}
