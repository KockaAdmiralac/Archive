package test.libgdx.bt;
import java.util.List;

public interface BluetoothConnection
{
	public boolean notSupported;
	public void connect(final Object device);
	public void accept();
	public boolean isConnected();
	public void reconnect();
	public void scan();
	public Object[] getPairedDevices();
	public String[] getPairedDevicesNames();
	public Object getScannedDevice();
	public List<Data> read();
	public void write(Data data);
}
