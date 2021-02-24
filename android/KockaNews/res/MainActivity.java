package rs.kockasystems.kesic;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.os.Bundle;
import android.os.AsyncTask;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.view.View;
import android.view.ViewGroup;
import android.view.SurfaceView;
import android.view.SurfaceHolder;
import android.util.Size;
import android.content.Intent;
import android.content.Context;
import android.content.ContentResolver;
import android.net.Uri;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.ShareActionProvider;
import java.io.File;
import java.io.FileDescriptor;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import android.nfc.NfcAdapter;
import android.nfc.NfcEvent;
import android.media.AudioManager;
import android.provider.MediaStore;
import android.graphics.Bitmap;
import android.view.*;

public class MainActivity extends Activity 
{
	TextView txt;
	ImageView img;
	ShareActionProvider sap;
	NfcAdapter nfc;
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
        setContentView(R.layout.main);
		txt = (TextView)findViewById(R.id.txt);
		img = (ImageView)findViewById(R.id.bmp);
    }

	@Override
	public boolean onTouchEvent(MotionEvent event)
	{
		txt.setX(event.getX());
		txt.setY(event.getY());
		txt.setText(String.valueOf(event.getX()));
		return super.onTouchEvent(event);
	}
	/*
	public void onClick(View v){
		try{
			Intent intent = new Intent();
			intent.setAction(Intent.ACTION_SEND);
			intent.putExtra(Intent.EXTRA_TEXT, "Yay, a text");
			intent.setType("");
			startActivity(intent);
		}
		catch(Exception e){}
	}
	public void onClick2(View v){
		try{startActivityForResult(new Intent(Intent.ACTION_PICK).setType(""),0);}
		catch(Exception e){txt.setText(e.getMessage());}
	}
	public void onClick3(View v){
		NfcAdapter.getDefaultAdapter(this).setBeamPushUrisCallback(new UriCallback(), this);
	}
	public void onClick4(View v){
		setVolumeControlStream(AudioManager.STREAM_MUSIC);
	}
	*/
	public void onClick5(View v){
		try{
			File imgFile = createFile(".jpg");
		    Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
			intent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(imgFile));
			startActivityForResult(intent, 1);
		}
		catch(IOException e){txt.setText(e.getMessage());}
	}
	public void onClick6(View v){
		try{
			File movFile = createFile(".mp4");
		    Intent intent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
			intent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(movFile));
			startActivity(intent);
		}
		catch(IOException e){txt.setText(e.getMessage());}
	}
	public void onClick7(View v){
		//new AsyncTroll().execute(0);
	}
	/*@Override
	public void onActivityResult1(int requestCode, int resultCode, Intent returnIntent){
		if(resultCode != RESULT_OK)return;
		ParcelFileDescriptor pfd = null;
		notification("B","B");
		try{
			ContentResolver cr = getContentResolver();
			notification("A","A");
			Uri data = returnIntent.getData();
			notification("D",data.toString());
			pfd = cr.openFileDescriptor(data, "r");
			notification("C","C");
			FileDescriptor fd = pfd.getFileDescriptor();
		}
		catch(Exception e){notification("Error",e.getMessage());txt.setText(e.getMessage());}
	}*/

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data)
	{
		super.onActivityResult(requestCode, resultCode, data);
		if(requestCode == 1 && resultCode == RESULT_OK){
			Bundle extras = data.getExtras();
			Bitmap bmp = (Bitmap)extras.get("data");
			img.setImageBitmap(bmp);
		}
	}
	private File createFile(String suff) throws IOException{
		return File.createTempFile(
		    "temporary",
			suff,
			Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
		);
	}
	/*
	class Preview extends ViewGroup implements SurfaceHolder.Callback
	{
		SurfaceView sv;
		SurfaceHolder sh;
		Camera cam;
		Preview(Context context){
			super(context);
			sv = new SurfaceView(context);
			addView(sv);
			sh = sv.getHolder();
			sh.addCallback(this);
			sh.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
		}
		public void setCamera(Camera camera){
			if(camera == cam)return;
			cam = camera;
			if(cam != null){
				cam.getParameters();
				List<Size> sizes = cam.getParameters().getSupportedPreviewSizes();
				
				
			}
		}
	}
	@Override
	public boolean onCreateOptionsMenu(Menu menu){
		getMenuInflater().inflate(R.menu.main, menu);
		MenuItem item = menu.findItem(R.id.share);
		sap = (ShareActionProvider)item.getActionProvider();
		Intent intent = new Intent()
		    .putExtra(Intent.EXTRA_TEXT, "My text")
		    .setAction(Intent.ACTION_SEND)
		    .setType("text/plain");
		setShareIntent(intent);
		return super.onCreateOptionsMenu(menu);
	}
	private void setShareIntent(Intent intent){
		if(sap != null)sap.setShareIntent(intent);
	}
	private class UriCallback implements NfcAdapter.CreateBeamUrisCallback {
		public UriCallback(){}
        private Uri[] uris = new Uri[10];
		@Override
		public Uri[] createBeamUris(NfcEvent p1)
		{
			//try{uris[0] = (Uri)Uri.fromFile(new File(getExternalFilesDir(null), "a.txt").setReadable(true, false));}
			//catch(Exception e){}
			return uris;
		}
	}
	*/
}
