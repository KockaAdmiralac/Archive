package test.libgdx.bt;

import android.os.Bundle;
import android.bluetooth.*;
import android.content.*;
import java.io.*;
import java.util.*;
import com.badlogic.gdx.backends.android.AndroidApplication;
import com.badlogic.gdx.backends.android.AndroidApplicationConfiguration;
import android.bluetooth.*;
import android.content.*;
import android.app.*;

public class MainActivity extends AndroidApplication
{
	private final int BLUETOOTH_TURN_ON_CODE = 1745;
	private final String BLUETOOTH_NAME = "rs.kockasystems.mrkonjic.Bluetooth";
	private WriteThread wt;
	private ReadThread rt;
	private ConnectThread ct;
	private AcceptThread at;
	private BluetoothAdapter bta;
	private BluetoothDevice scanned;
	private Set<BluetoothDevice> devices;
	private final UUID BLUETOOTH_UUID = UUID.fromString("457807c0-4897-11df-9879-0800200c9a66");
	private String buffer = "";
	private boolean host;
	private boolean connected;
	private List<Data> messages;
	private BluetoothDevice lastConnectedDevice;
	
    @Override
    public void onCreate(Bundle savedInstanceState)
	{
        super.onCreate(savedInstanceState);
		messages = new ArrayList<Data>();
        AndroidApplicationConfiguration cfg = new AndroidApplicationConfiguration();
        cfg.hideStatusBar = true;
        initialize(new BTTest(new AndroidBluetoothConnection(), new AndroidDialogBuilder()), cfg);
    }
	
	@Override
	protected void onDestroy()
	{
		super.onDestroy();
		unregisterReceiver(btr);
	}
	
	private class AndroidBluetoothConnection implements BluetoothConnection
	{

		@Override
		public List<Data> read()
		{
			List<Data> temp = messages;
			messages.clear();
			return messages;
		}

		@Override
		public void write(Data data) { buffer = data.x + "|" + data.y + "|" + data.radius + "|" + data.x1 + "|" + data.y1; }


		public AndroidBluetoothConnection()
		{
			bta = BluetoothAdapter.getDefaultAdapter();
			if(bta == null)
			{
				notSupported = true;
				return;
			}
			if(!bta.isEnabled())startActivityForResult(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE), BLUETOOTH_TURN_ON_CODE);
			devices = bta.getBondedDevices();
			registerReceiver(btr, new IntentFilter(BluetoothDevice.ACTION_FOUND));
		}
		
		@Override
		public void scan() { bta.startDiscovery(); }
		
		@Override
		public BluetoothDevice getScannedDevice() { return scanned; }
		
		@Override
		public void connect(final Object device)
		{
			if(notSupported){}
			else
			{
				lastConnectedDevice = (BluetoothDevice)device;
				ct = new ConnectThread();
				ct.start();
			}
		}
		
		@Override
		public Object[] getPairedDevices() { return devices.toArray(); }
		
		@Override
		public String[] getPairedDevicesNames()
		{
			String[] names = new String[devices.size()];
			int i = 0;
			for(BluetoothDevice dev : devices)names[i++] = dev.getName();
			return names;
		}

		@Override
		public void accept()
		{
			at = new AcceptThread();
			at.start();
		}

		@Override
		public boolean isConnected(){ return connected; }

		@Override
		public void reconnect() { connect(lastConnectedDevice); }
		
	}
	
	
	
	private class AcceptThread extends Thread
	{
		private final BluetoothServerSocket server;

		public AcceptThread()
		{
			startActivity(new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE));
			BluetoothServerSocket tmp = null;
			host = true;
			try { tmp = bta.listenUsingRfcommWithServiceRecord(BLUETOOTH_NAME, BLUETOOTH_UUID); }
			catch(IOException e){ }
			server = tmp;
		}

		@Override
		public void run()
		{
			BluetoothSocket socket = null;
			while(true)
			{
				try{ socket = server.accept(); }
				catch(IOException e) { break; }
				if(socket != null)
				{
					rt = new ReadThread(socket);
					wt = new WriteThread(socket);
					rt.start();
					wt.start();
					connected = true;
					break;
				}
			}
		}
		public void cancel()
		{
			try{ server.close(); }
			catch(IOException e){  }
		}

	}


	private class ConnectThread extends Thread
	{
		private final BluetoothSocket client;
		private final BluetoothDevice device;

		public ConnectThread()
		{
			BluetoothSocket tmp = null;
			host = false;
			device = lastConnectedDevice;
			try{ tmp = device.createRfcommSocketToServiceRecord(BLUETOOTH_UUID); }
			catch(IOException e){  }
			client = tmp;
		}

		@Override
		public void run()
		{
			bta.cancelDiscovery();
			try{ client.connect(); }
			catch(IOException e1)
			{
				try{ client.close(); }
				catch(IOException e2){  }
				return;
			}
			rt = new ReadThread(client);
			wt = new WriteThread(client);
			rt.start();
			wt.start();
			connected = true;
		}
		public void cancel()
		{
			try{ client.close(); }
			catch(IOException e){  }
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
			catch(IOException e){  }
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
						messages.add(new Data(message.split("\\|")));
					}
				}
				catch(IOException e)
				{
					connected = false;
					break;
				}
			}
		}
	}

	private class WriteThread extends Thread
	{
		private final BluetoothSocket socket;
		private final OutputStream os;

		WriteThread(BluetoothSocket s)
		{
			socket = s;
			OutputStream tmpo = null;
			try{ tmpo = socket.getOutputStream(); }
			catch(IOException e){  }
			os = tmpo;
		}
		
		@Override
		public void run()
		{
			System.out.println("Started running WriteThread");
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
	
	
	
	private final BroadcastReceiver btr = new BroadcastReceiver()
	{
		public void onReceive(Context context, Intent intent) { if(intent.getAction().equals(BluetoothDevice.ACTION_FOUND))scanned = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE); }
	};
	
	public class AndroidDialogBuilder implements DialogBuilder
	{
		private AlertDialog.Builder builder;
		
		public AndroidDialogBuilder()
		{
			builder = new AlertDialog.Builder(MainActivity.this);
			builder.setCancelable(false);
			which = -1;
		}
		
		@Override
		public void setTitle(String title) { builder.setTitle(title); }

		@Override
		public void setItems(String[] items) { builder.setItems(items, new DialogInterface.OnClickListener() { public void onClick(DialogInterface p1, int p2) { which = p2; } }); }
		
		@Override
		public int getSelectedItem() { return which; }
		
		@Override
		public void show() { new AndroidDialog(builder).show(getFragmentManager(), "test.gdx.bt.Dialog"); }
	}
	
	private class AndroidDialog extends DialogFragment
	{
		private AlertDialog.Builder bd;
		public AndroidDialog(AlertDialog.Builder bd) { this.bd = bd; }
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState) { return bd.create(); }
	}
}
