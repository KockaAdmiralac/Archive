/******** KOCKA-SYSTEMS APPLICATION ********
 * Author : KockaAdmiralac<1405223@gmail.com>
 * Release dates : 
 * * Version : Date       : Description
 * * 0.1     : 07/06/2015 : Unofficial release
 * * 0.2     : 10/06/2015 : First official release
 * Further releases :
 * * Add Settings with "settings.xml"
 * * Remove getNewsFile()
 * Package : com.kockasystems.kesic
 */

package rs.kockasystems.kesic;

/* -*- IMPORTS -*-
 * This is where we import other libraries' 
 * classes into the project
 */

import android.os.Bundle;
import android.os.StrictMode;
import android.os.Environment;
import android.app.Activity;
import android.app.ActionBar;
import android.app.FragmentTransaction;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MenuInflater;
import android.widget.TextView;
import android.widget.PopupMenu;
import android.widget.ShareActionProvider;
import android.widget.Toast;
import android.widget.Toolbar;
import android.content.Intent;
import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserFactory;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.entity.BufferedHttpEntity;
import java.io.IOException;

/* -*- CLASSES -*-
 * This is where classes are defined
 */

class Article
{
	/* -*- NEW CLASS -*-
	 * A class for storing the data about the articles. 
	 */
	public String title;
	public String body;
	public String author;
}
public class NewsActivity extends Activity
{
	/* -*- PUBLIC VARIABLES -*-
	 * This is a place where public variables are defined
	 */
	TextView title;          // The article title viewer
	TextView body;           // The article body viewer
	TextView author;         // The article author
	TextView forums;
	ArrayList<Article> news; // News - The list of Articles
	ArrayList<int[]> tabs;   // Tabs - The list of views in each tab
	int currTab;
	int currNewsIndex = 0;   // Current viewing article index
	ShareActionProvider sap; // The menu share provider
	boolean copied = true;   // Is the news.xml copied to private storage?
	
	/* -*- FUNCTIONS -*-
	 * This is a place where activity functions are defined
	 */
	
	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		/* -*- BUILTIN FUNCTION -*-
		 * A function for Activity creation callback 
		 */
		super.onCreate(savedInstanceState);
		setContentView(R.layout.news);
		title = (TextView)findViewById(R.id.title);
		body = (TextView)findViewById(R.id.body);
		author = (TextView)findViewById(R.id.author);
		forums = (TextView)findViewById(R.id.forumText);
		tabs = new ArrayList<int[]>();
		getActionBar().setNavigationMode(ActionBar.NAVIGATION_MODE_TABS);
		setTabs();
		getActionBar().selectTab(getActionBar().getTabAt(1));
	}
	
	public void copy(InputStream in, File dst){
		/* -*- NEW FUNCTION -*-
		 * A function for copying from one file to another.
		 * 
		 * Parameters : 
		 * * InputStream - the file to read from
		 * * File - the file to write to
		 */
		try{
			OutputStream out = new FileOutputStream(dst); 
			byte[] buf = new byte[1024];
			int len;
			while ((len = in.read(buf)) > 0)out.write(buf, 0, len);
			in.close(); 
			out.close(); 
		}
		catch(Exception e){e.printStackTrace();}
	}
	
	public void toast(int text){Toast.makeText(getApplicationContext(), getApplicationContext().getResources().getString(text), Toast.LENGTH_SHORT);}
	
	public void download(int url, int filename) throws IOException{
		StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().permitAll().build());
		copy(new BufferedHttpEntity(new DefaultHttpClient().execute(new HttpGet(getResources().getString(url))).getEntity()).getContent(), new File(getApplicationContext().getFilesDir(), getResources().getString(filename)));
	}
	
	public InputStream getNewsFile(){
		/* -*- NEW FUNCTION -*-
		 * A function for finding the news.xml file location
		 * The file can be in two places : 
		 * * In application assets
		 * * In application private storage
		 * 
		 * Returns :
		 * * An InputStream from which the file can be read.
		 */
		try{return new FileInputStream(new File(getApplicationContext().getFilesDir(), "news.xml"));}
		catch(Exception e){
			copied = false;
			try{return getApplicationContext().getAssets().open("news.xml");}
			catch(Exception f){return null;}
		}
	}
	
	public void handleTab(int tab){
		/* -*- NEW FUNCTION -*-
		 * A function for handling the tab changing
		 * 
		 * Parameters :
		 * * Integer - An integer representing a tab index
		 */
		currTab = tab;
		switch(tab){
			case 0:
				
				break;
			case 1:
				getNews(getNewsFile());
				if(!copied){
					try{
						File f = new File(getApplicationContext().getFilesDir(), "news.xml");
						if(!f.createNewFile())title.setText("Error creating a file");
						copy(getApplicationContext().getAssets().open("news.xml"), f);
					}
					catch(Exception e){}
				}
				setNews();
				break;
		}
	}
	
	public void setTabs(){
		/* -*- NEW FUNCTION -*-
		 * This function sets the tabs for using in the application
		 * Tabs can be added in the "tabs" array
		 */
		try{
			final int[] curr01 = {R.id.text, R.id.about, R.id.version}; tabs.add(curr01);
			final int[] curr02 = {R.id.title, R.id.body, R.id.author, R.id.nextArticleButton}; tabs.add(curr02);
			final int[] curr03 = {R.id.forumText}; tabs.add(curr03);
			final int[] texts = {R.string.about, R.string.news, R.string.forums};
			final int[] sizes = {3, 4 ,1};
			for(int i=0; i<tabs.size(); i++){final int b = i; getActionBar().addTab(getActionBar().newTab().setText(getApplicationContext().getResources().getString(texts[i])).setTabListener(new ActionBar.TabListener(){
				public void onTabSelected(ActionBar.Tab tab, FragmentTransaction ft){for(int j=0; j<sizes[b]; j++)findViewById(tabs.get(b)[j]).setVisibility(View.VISIBLE); handleTab(b);}
				public void onTabUnselected(ActionBar.Tab tab, FragmentTransaction ft){for(int j=0; j<sizes[b]; j++)findViewById(tabs.get(b)[j]).setVisibility(View.GONE);}
				public void onTabReselected(ActionBar.Tab tab, FragmentTransaction ft){}
			}));}
		}
		catch(Exception e){e.printStackTrace();}
	}
	
	public void getNews(InputStream newsFile){
		/* -*- NEW FUNCTION -*-
		 * A function for setting the news list by :
		 * * Reading the contents of news.xml file
		 * * Grouping them into Articles
		 * * Adding them to news list
		 * 
		 * Parameters :
		 * * An InputStream which represents the source of news.xml
		 */
		try{
			XmlPullParser xmlParser = XmlPullParserFactory.newInstance().newPullParser();
			xmlParser.setInput(newsFile, null);
			xmlParser.setFeature(XmlPullParser.FEATURE_PROCESS_NAMESPACES, false);
			int event = xmlParser.getEventType();
			Article curr = null;
			while(event != XmlPullParser.END_DOCUMENT){
				switch(event){
					case XmlPullParser.START_DOCUMENT:
						news = new ArrayList<Article>();
						break;
					case XmlPullParser.START_TAG:
						switch(xmlParser.getName()){
							case "article":
								curr = new Article();
								break;
							case "title":
								curr.title = xmlParser.nextText();
								break;
							case "body":
								curr.body = xmlParser.nextText();
								break;
							case "footer":
								curr.author = xmlParser.nextText();
								break;
					    }
						break;
					case XmlPullParser.END_TAG:
						if(xmlParser.getName().equalsIgnoreCase("article") && curr != null)news.add(curr);
						break;
			    }
				event = xmlParser.next();
			}
		}
		catch(Exception e){title.setText("Error : "+e.getMessage());e.printStackTrace();}
	}
	
	public void setNews(){
		/* -*- NEW FUNCTION -*-
		 * A function for setting the article viewers
		 * to their apropriate values.
		 */
		title.setText(news.get(currNewsIndex).title);
		body.setText(news.get(currNewsIndex).body);
		author.setText(news.get(currNewsIndex).author);
	}
	
	public void button_Click(View v){
		/* -*- BUILTIN FUNCTION -*-
		 * A function for handling the change article button click 
		 */
		currNewsIndex += 1;
		if(currNewsIndex == news.size())currNewsIndex = 0;
		setNews();
		updateShareIntent();
	}
	
	public void getForum(){
		
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu)
	{
		/* -*- BUILTIN FUNCTION -*-
		 * A function for Options Menu creation callback 
		 */
		getMenuInflater().inflate(R.menu.main, menu);
		sap = (ShareActionProvider)menu.findItem(R.id.share).getActionProvider();
		updateShareIntent();
		return super.onCreateOptionsMenu(menu);
	}
	public void updateShareIntent(){
		/* -*- NEW FUNCTION -*-
		 * A function for updating the share button Intent
		 * The thing it updates is the article name in the shared text.
		 */
		sap.setShareIntent(new Intent()
			.putExtra(Intent.EXTRA_TEXT, String.format(getResources().getString(R.string.share_text), news.get(currNewsIndex).title))
		    .setType("text/plain")
			.setAction(Intent.ACTION_SEND)
		);
	}
	@Override
	public boolean onOptionsItemSelected(MenuItem item)
	{
		/* -*- BUILTIN FUNCTION -*-
		 * A function for Options Menu item selection callback 
		 */
		switch(item.getItemId()){
			case R.id.other:
				PopupMenu popup = new PopupMenu(this, findViewById(R.id.other));
				popup.getMenuInflater().inflate(R.menu.popup_news, popup.getMenu());
				popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener(){
					public boolean onMenuItemClick(MenuItem item){
						switch(item.getItemId()){
							case R.id.logout:
								if(new File(getApplicationContext().getFilesDir(), "user.txt").delete()){
									Toast.makeText(NewsActivity.this, getResources().getString(R.string.logout_success), Toast.LENGTH_SHORT).show();
									finish();
								}
								break;
							case R.id.refresh:
								try{
									switch(currTab){
										case 0:
											break;
										case 1:
											StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().permitAll().build());
											copy(new BufferedHttpEntity(new DefaultHttpClient().execute(new HttpGet(getResources().getString(R.string.news_url))).getEntity()).getContent(), new File(getApplicationContext().getFilesDir(), getResources().getString(R.string.news_file)));
											getNews(getNewsFile());
											setNews();
											break;
										case 2:
											File f = new File(getApplicationContext().getFilesDir(), getApplicationContext().getResources().getString(R.string.forums_file));
											f.createNewFile();
											download(R.string.forums_url, R.string.forums_file);
											getForum();
											break;
									}
								}
								catch(Exception e){Toast.makeText(getApplicationContext(), getApplicationContext().getResources().getString(R.string.connect_error), Toast.LENGTH_SHORT).show();e.printStackTrace();}
								break;
						}
						return true;
					}
				});
				popup.show();
				break;
		}
		return super.onOptionsItemSelected(item);
	}
}

/******** THE END ********/
