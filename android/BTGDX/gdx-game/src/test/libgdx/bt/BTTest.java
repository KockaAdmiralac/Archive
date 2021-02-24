package test.libgdx.bt;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.scenes.scene2d.*;
import java.util.*;

public class BTTest implements ApplicationListener
{
	BluetoothConnection btc;
	DialogBuilder dlg;
	final String[] hj = {"Host", "Join"};
	final String[] sp = {"Search", "Paired devices"};
	List<Data> list;

	public BTTest(final BluetoothConnection btc, DialogBuilder dlg)
	{
		this.btc = btc;
		this.dlg = dlg;
		this.list = new ArrayList<Data>();
	}
	
	
	@Override
	public void create()
	{
		dlg.setTitle("Asdfk");
		dlg.setItems(hj);
		dlg.show();
		while(dlg.which == -1);
		if(dlg.which == 0)
		{
			btc.accept();
			while(!btc.isConnected());
			dlg.setTitle("Accepted!");
			dlg.show();
		}
		else
		{
			dlg.setItems(sp);
			dlg.which = -1;
			dlg.show();
			while(dlg.which == -1);
			if(dlg.which == 0)
			{
				btc.scan();
				while(btc.getScannedDevice() == null);
				btc.connect(btc.getScannedDevice());
			}
			else
			{
				dlg.setItems(btc.getPairedDevicesNames());
				dlg.which = -1;
				dlg.show();
				while(dlg.which == -1);
				btc.connect(btc.getPairedDevices()[dlg.which]);
			}
			while(!btc.isConnected());
			dlg.setTitle("Connected");
			dlg.show();
			
		}
	}

	@Override
	public void render()
	{
		btc.write(new Data("1|22|3|4|56".split("\\|")));
		list = btc.read();
		if(!(list.size() == 0))
		{
			for(Data a : list)System.out.println(a.x);
		}
	}

	@Override
	public void dispose()
	{
	}

	@Override
	public void resize(int width, int height)
	{
	}

	@Override
	public void pause()
	{
	}

	@Override
	public void resume()
	{
	}
	
}
