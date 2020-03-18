import processing.serial.*;

Serial myPort;
String data = "";
int comma = 0;
int angle = 0;
int distance = 0;
String sAngle = "";
String sDistance = "";
boolean object = false;
float tmp;
String txt, txt1;

void setup()
{
  delay(20);
  size(1580, 830);
  myPort = new Serial(this, "COM3", 9600);
  myPort.bufferUntil('.');
  background(50,50,50); 

}

void serialEvent (Serial myPort)
{
  if ( myPort.available() > 0)
  {
    data = myPort.readStringUntil('.');
    data = data.substring(0, data.length() - 1);
    
    comma = data.indexOf(',');
    sDistance = data.substring(0, comma);
    sAngle = data.substring(comma + 1, data.length());
   
   
    angle = 180 - int(sAngle);   
    distance = int(sDistance);
    if(distance > 50) object = false;
      else object = true;
  }
}



void drawRadar()
{
  translate(790,830);
  noFill();
  strokeWeight(1.5);
  stroke(199,21,133);
  ellipse(0, 0, 1500, 1500);
  ellipse(0, 0, 1200, 1200);
  ellipse(0, 0, 900, 900);
  ellipse(0, 0, 600, 600);
  ellipse(0, 0, 300, 300);
  
  line(0,0, -780 * cos(radians(30)), -780 * sin(radians(30)));
  line(0,0, -780 * cos(radians(60)), -780 * sin(radians(60)));
  line(0,0, -780 * cos(radians(90)), -780 * sin(radians(90)));
  line(0,0, -780 * cos(radians(120)), -780 * sin(radians(120)));
  line(0,0, -780 * cos(radians(150)), -780 * sin(radians(150)));
  
  
  strokeWeight(4);
  line(0,0, -775 * cos(radians(0)), -775 * sin(radians(0)));
  line(0,0, -775 * cos(radians(180)), -775 * sin(radians(180)));
  
}

void noObject()
{
  noFill();
  strokeWeight(1);
  stroke(199,21,133);
  line(0,0, -790 * cos(radians(angle)), -790 * sin(radians(angle)));
}

void Object()
{
  noFill();
  strokeWeight(1);
  stroke(199,21,133);
  tmp=750/30*distance;
  line(0,0,-tmp * cos(radians(angle)), -tmp * sin(radians(angle)));
  
  
  stroke(123,104,238);
  line( -tmp * cos(radians(angle)), -tmp * sin(radians(angle)), -790*cos(radians(angle)), -790*sin(radians(angle)));
  
}

void textOnScreen()
{
  pushMatrix();
  translate(790,830);
  fill(199,21,133);
  textSize(15);
  text("6cm", 151,-2);
  text("12cm", 301,-2);
  text("18cm", 456,-2);
  text("24cm", 601,-2);
  text("30cm", 751,-2);

  //rotate(-radians(30));
  textSize(9);
  
  text("30°", - 790 * cos(radians(150)), - 790 * sin(radians(150)));
  text("60°", - 790 * cos(radians(120)), - 790 * sin(radians(120)));
  text("90°", - 790 * cos(radians(90))-7, - 790 * sin(radians(90))+5);
  text("120°", - 790 * cos(radians(60)), - 790 * sin(radians(60)));
  text("150°", - 790 * cos(radians(30)), - 790 * sin(radians(30)));
  
  popMatrix();
}

void draw()
{
  pushMatrix();
  fill(250, 250, 250);
  textSize(20);
  if(distance<30)
  {
    txt="Rastojanje: " + distance + "cm";
    txt1="Ugao: " + (180-angle);
  }
  else
  {
    txt="Objekat nije detektovan";
    txt1="";
  }
  text(txt,50,25);
  text(txt1,400,25);
  noStroke();
  fill(0,100); 
  rect(0, 0, width, 35);
  popMatrix();
  
  pushMatrix();
  noStroke();
  fill(0,6); 
  rect(0, 0, width, 830); 
  drawRadar();
  if(distance<30) 
    Object();
  else 
    noObject();
   popMatrix();
 
 textOnScreen();
}
