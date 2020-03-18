final int framerate = 60;
final int windowWidth = 1280;
final int windowHeight = 720;
final int trackHeight = 240;
final Car brmbrm = new Car();
final ArrayList<Prepreka> prepreke = new ArrayList<Prepreka>();
final int SUM = 200;
boolean jebiga;

void setup() {
  frameRate(framerate);
  size(1280, 720);
  surface.setTitle("4. Automobili");
  noStroke();
}

void draw() {
  if (jebiga) {
    background(255, 0, 0);
    textSize(250);
    fill(0, 0, 0);
    text("RIP", 350, 450);
    return;
  }
  background(0, 150, 0);
  fill(220, 220, 220);
  int h = (windowHeight - trackHeight) / 2;
  rect(0, h, windowWidth, trackHeight);
  fill(255, 255, 255);
  brmbrm.draw();
  Prepreka pmin = null;
  float distmin = windowWidth;
  for (Prepreka p : prepreke) {
    if (!p.isDead()) {
      p.draw();
      float dist;
      float realX = brmbrm.x + Car.WIDTH;
      if (p.x >= realX) {
        dist = p.x - realX;
      } else {
        dist = windowWidth + Car.WIDTH - (realX - p.x);
      }
      dist += random(-SUM, SUM);
      if (dist < distmin) {
        distmin = dist;
        pmin = p;
      }
    }
  }
  if (pmin != null && distmin <= Car.DISTANCE) {
    brmbrm.setSlow(pmin, distmin);
  } else if (brmbrm.pEffective != null) {
    brmbrm.die();
  }
}

void mousePressed() {
  prepreke.add(new Prepreka(mouseX, mouseButton == LEFT));
}
