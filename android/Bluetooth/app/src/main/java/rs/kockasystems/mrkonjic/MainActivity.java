package rs.kockasystems.mrkonjic;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.DialogInterface;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import android.widget.Button;
import android.widget.TextView;
import android.widget.EditText;
import java.io.InputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Set;
import java.util.UUID;



public class MainActivity extends Activity 
{
	
	private BluetoothAdapter bta;
	private final int BLUETOOTH_TURN_ON_CODE = 1745;
	private final String BLUETOOTH_NAME = "rs.kockasystems.mrkonjic.Bluetooth";
	private final String DIALOG_CONNECT = "rs.kockasystems.mrkonjic.DialogConnect";
	private final String DIALOG_ACCEPT = "rs.kockasystems.mrkonjic.DialogAccept";
	private final String DIALOG_DEVICE = "rs.kockasystems.mrkonjic.DialogDevice";
	private final String DIALOG_DISCOVERY = "rs.kockasystems.mrkonjic.DialogDiscovery";
	private final UUID BLUETOOTH_UUID = UUID.fromString("457807c0-4897-11df-9879-0800200c9a66");
	private ConnectThread cthread;
	private AcceptThread athread;
	private boolean host;
	private ReadThread rt;
	private WriteThread wt;
	private EditText message;
	private Button messageButton;
	private Button connectButton;
	private TextView messageLog;
	private String buffer = "";
	private Set<BluetoothDevice> devices;
		
	private void toast(final int message){ runOnUiThread(new Runnable(){public void run(){Toast.makeText(MainActivity.this, getString(message), Toast.LENGTH_LONG).show();}}); }
	
	private void getComponentsVisible()
	{
		runOnUiThread(new Runnable(){ public void run()
		{
			message.setVisibility(View.VISIBLE);
			messageButton.setVisibility(View.VISIBLE);
			messageLog.setVisibility(View.VISIBLE);
			connectButton.setVisibility(View.GONE);
		}});
	}
	
	private void getComponentsInvisible()
	{
		runOnUiThread(new Runnable(){ public void run()
		{
			message.setVisibility(View.GONE);
			messageButton.setVisibility(View.GONE);
			messageLog.setVisibility(View.GONE);
			connectButton.setVisibility(View.VISIBLE);
		}});
	}
	
	private void addMessage(final String name, final String message){runOnUiThread(new Runnable(){public void run(){ messageLog.setText(messageLog.getText() + name + " : " + message + "\n");}});}
	
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
		bta = BluetoothAdapter.getDefaultAdapter();
		if(bta == null)
		{
			toast(R.string.notSupported);
			finish();
		}
		if(!bta.isEnabled())startActivityForResult(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE), BLUETOOTH_TURN_ON_CODE);
		devices = bta.getBondedDevices();
		registerReceiver(btr, new IntentFilter(BluetoothDevice.ACTION_FOUND));
		setContentView(R.layout.main);
		message = (EditText)findViewById(R.id.messageBox);
		messageButton = (Button)findViewById(R.id.messageButton);
		messageLog = (TextView)findViewById(R.id.messageLog);
		connectButton = (Button)findViewById(R.id.connectButton);
		getComponentsInvisible();
    }
	
	public void btConnect(View v)
	{
		DialogConnect dlg = new DialogConnect();
		dlg.show(getFragmentManager(), DIALOG_CONNECT);
	}
	
	public void sendMessage(View v)
	{
		addMessage(getString(R.string.you), message.getText().toString());
		buffer = message.getText().toString();
		message.setText("");
		
	}
	
	private final BroadcastReceiver btr = new BroadcastReceiver()
	{
		public void onReceive(Context context, Intent intent)
	    {
			if(intent.getAction().equals(BluetoothDevice.ACTION_FOUND))
			{
				BluetoothDevice temp = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
				if(temp != null)
				{
				    DialogAccept acceptDialog = new DialogAccept(temp);
					acceptDialog.show(getFragmentManager(), DIALOG_ACCEPT);
				}
				else toast(R.string.deviceNotFound);
			}
		}
	};
	
	
	private class AcceptThread extends Thread
	{
		private final BluetoothServerSocket server;
		
		public AcceptThread()
		{
			startActivity(new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE));
			BluetoothServerSocket tmp = null;
			host = true;
			try { tmp = bta.listenUsingRfcommWithServiceRecord(BLUETOOTH_NAME, BLUETOOTH_UUID); }
			catch(IOException e){ toast(R.string.acceptFail1); }
			server = tmp;
		}

		@Override
		public void run()
		{
			BluetoothSocket socket = null;
			while(true)
			{
				try{ socket = server.accept(); }
				catch(IOException e)
			    {
					toast(R.string.acceptFail2);
					break;
				}
				if(socket != null)
				{
					toast(R.string.acceptSuccess);
					rt = new ReadThread(socket);
					wt = new WriteThread(socket);
					rt.start();
					wt.start();
					getComponentsVisible();
					break;
				}
			}
		}
		public void cancel()
		{
			try{ server.close(); }
			catch(IOException e){ toast(R.string.acceptFail3); }
		}
		
	}

	
	private class ConnectThread extends Thread
	{
		private final BluetoothSocket client;
		private final BluetoothDevice device;
		
		public ConnectThread(BluetoothDevice dev)
		{
			BluetoothSocket tmp = null;
			host = false;
			device = dev;
			try{ tmp = device.createRfcommSocketToServiceRecord(BLUETOOTH_UUID); }
			catch(IOException e){ toast(R.string.connectFail1); }
			client = tmp;
		}

		@Override
		public void run()
		{
			bta.cancelDiscovery();
			try{ client.connect(); }
			catch(IOException e1)
			{
				toast(R.string.connectFail2);
				try{ client.close(); }
				catch(IOException e2){ toast(R.string.connectFail3); }
				return;
			}
			toast(R.string.connectSuccess);
			rt = new ReadThread(client);
			wt = new WriteThread(client);
			rt.start();
			wt.start();
			getComponentsVisible();
		}
		public void cancel()
		{
			try{ client.close(); }
			catch(IOException e){ toast(R.string.connectFail3); }
		}
	}
	
	private class ReadThread extends Thread
	{
		private final BluetoothSocket socket;
		private final InputStream is;
		
		public ReadThread(BluetoothSocket s)
		{
			socket = s;
			InputStream tmpi = null;
			try{ tmpi = socket.getInputStream(); }
			catch(IOException e){ toast(R.string.inputGetFail); }
			is = tmpi;
		}
		
		@Override
		public void run()
		{
			int bytes;
			byte[] buffer = new byte[1024];
			while(true)
			{
			    try
			    {
					if(is.available() > 0)
					{
						bytes = is.read(buffer);
					    String message = new String(buffer, 0, bytes);
					    addMessage(socket.getRemoteDevice().getName(), message);
					}
				}
				catch(IOException e)
				{
					toast(R.string.connectionClosed);
					getComponentsInvisible();
					break;
				}
			}
		}
	}
	
	private class WriteThread extends Thread
	{
		private final BluetoothSocket socket;
		private final OutputStream os;
		
		WriteThread(BluetoothSocket s){
			socket = s;
			OutputStream tmpo = null;
			try{ tmpo = socket.getOutputStream(); }
			catch(IOException e){ toast(R.string.outputGetFail); }
			os = tmpo;
		}
		
		@Override
		public void run()
		{
			while(true)
			{
			    try
				{
					if(buffer != "")
					{
						os.write(buffer.getBytes());
						os.flush();
						buffer = "";
					}
				}
				catch(IOException e) { break; }
			}
		}
		
	}
	
	public class DialogDevice extends DialogFragment
	{
		private String[] cs;
		
		DialogDevice(String[] c)
		{
			super();
			cs = c;
		}
		
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState)
		{
			return new AlertDialog.Builder(getActivity())
			    .setTitle(R.string.deviceChoose)
			    .setItems(cs, new DialogInterface.OnClickListener(){ public void onClick(DialogInterface dialog, int which)
				{
					cthread = new ConnectThread((BluetoothDevice)devices.toArray()[which]);
					cthread.start();
				}})
			    .create();
		}
	}
	
	public class DialogDiscovery extends DialogFragment
	{
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState)
		{
			return new AlertDialog.Builder(getActivity())
			    .setTitle(R.string.deviceChoose)
				.setItems(R.array.device, new DialogInterface.OnClickListener(){ public void onClick(DialogInterface dlg, int which)
				{
					if(which == 0)if(!bta.startDiscovery())toast(R.string.discoveryFail);
					else
					{
						devices = bta.getBondedDevices();
						if(devices.size() > 0){
							String[] names = new String[devices.size()];
							int i = 0;
							for(BluetoothDevice device : devices)
							{
								names[i] = device.getName();
								i++;
							}
							DialogFragment dialog = new DialogDevice(names);
							dialog.show(getFragmentManager(), DIALOG_DEVICE);
						}
					}
				}}).create();
		}
		
	}
	
	public class DialogConnect extends DialogFragment
	{

		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState)
		{
			return new AlertDialog.Builder(getActivity())
			    .setTitle(R.string.connection)
				.setItems(R.array.connect, new DialogInterface.OnClickListener(){ public void onClick(DialogInterface dlg, int which)
				{
					if(which == 0){
						athread = new AcceptThread();
						athread.start();
					}
					else{
						DialogDiscovery discoveryDialog = new DialogDiscovery();
						discoveryDialog.show(getFragmentManager(), DIALOG_DISCOVERY);
					}
				}}).create();
		}
		
	}
	
	public class DialogAccept extends DialogFragment
	{
		private final BluetoothDevice device;
		public DialogAccept(BluetoothDevice dev)
		{
			super();
			device = dev;
		}
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState)
		{
			return new AlertDialog.Builder(getActivity())
			    .setTitle(R.string.deviceAccept)
			    .setPositiveButton(R.string.accept, new DialogInterface.OnClickListener(){ public void onClick(DialogInterface dlg, int which)
				{
					cthread = new ConnectThread(device);
					cthread.start();
				}})
				.setMessage(String.format(getString(R.string.deviceDialog), device.getName()))
				.setNegativeButton(R.string.reject, new DialogInterface.OnClickListener(){ public void onClick(DialogInterface dlg, int which){  } })
			    .create();
		}
		
	}
	
	
	@Override
	protected void onDestroy()
	{
		super.onDestroy();
		unregisterReceiver(btr);
	}
	
}
