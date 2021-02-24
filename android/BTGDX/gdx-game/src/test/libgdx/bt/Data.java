package test.libgdx.bt;

public class Data
{
	public float x, y, radius, x1, y1;

	public Data(final String[] format)
	{
		System.out.println(format.length);
		for(String a : format)System.out.println(a);
		System.out.println("---------");
		/*x = Float.valueOf(format[0]);
		y = Float.valueOf(format[1]);
		radius = Float.valueOf(format[2]);
		x1 = Float.valueOf(format[3]);
		y1 = Float.valueOf(format[4]);*/
		x = 1;
		x1 = 1;
		y = 1;
		y1 = 1;
		radius = 1;
	}
}
