final int BROJ_CESTICA = 5;
final int FRAMERATE = 1;
final float MIN_Q = -1.0;
final float MAX_Q = 1.0;
final float MIN_DIST = 0.99;
final float MAX_DIST = dist(0, 0, width, height);
final Naelektrisanje[] cestice = new Naelektrisanje[BROJ_CESTICA];
Naelektrisanje temp;

class Naelektrisanje {
  public float x;
  public float y;
  public float q;

  public Naelektrisanje(float x, float y, float q) {
    this.x = x;
    this.y = y;
    this.q = q;
  }
}

void setup() {
  size(500, 500);
  frameRate(FRAMERATE);
  colorMode(HSB, 256);
  generate();
}

void generate() {
  for (int i = 0; i < BROJ_CESTICA; ++i) {
    cestice[i] = new Naelektrisanje(
      random(width),
      random(height),
      random(MIN_Q, MAX_Q)
    );
  }
  for (int y = 0; y < height; ++y) {
    for (int x = 0; x < width; ++x) {
      float e = 0;
      for (int i = 0; i < BROJ_CESTICA; ++i) {
        temp = cestice[i];
        e += temp.q / dist(temp.x, temp.y, x, y);
      }
      stroke(map(e, -0.01, 0.01, 0, 255), 255, 255);
      // print(map(e, -10, 10, 0, 255));
      // print("\n");
      point(x, y);
    }
  }
}

void draw() {
}

void mousePressed() {
  generate();
}

void keyPressed() {
  generate();
}
