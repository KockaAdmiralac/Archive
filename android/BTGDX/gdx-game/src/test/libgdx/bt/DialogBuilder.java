package test.libgdx.bt;

public interface DialogBuilder
{
	public int which;
	public void setTitle(String title);
	public void setItems(String[] items);
	public int getSelectedItem();
	public void show();
}
