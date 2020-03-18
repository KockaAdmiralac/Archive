// 1136px je otprilike 30cm ako
// želimo da bukvalno preslikamo svet
// Trenutno, 640px se preslikava u 6m
final float SCALE_PX = 640;
final float SCALE_M = 6;
// Množimo s ovim da bismo konvertovali metre u piksele
final float M_TO_PX = SCALE_PX / SCALE_M;
// Množimo s ovim da bismo konvertovali piksele u metre
final float PX_TO_M = SCALE_M / SCALE_PX;
// Ubrzanje gravitacije [m/s^2]
final float G = 9.80665;
// Početna pozicija lopte [m, m]
final PVector START = new PVector(1, 1.5);
// Veličina lopte (i x i y) [m]
final float BALL_SIZE = 0.2;
// Koliko je vlasnik lopte jak
// (odnos izabrane daljine za bacanje od brzine lopte)
final float SCALE_ARROW = 1.5;
// Pozicija lopte [m, m]
final PVector pos = new PVector();
// Brzina lopte [m/s]
PVector v = new PVector(0, 0);
// Da li se lopta pomera ili stoji u ruci vlasnika
boolean moving;
// Da li je igra gotova
boolean done;
// Da li je trenutni potez AI potez
boolean thinking;
// AI Za Balone Ume Da Misli! [FOTO]
PImage hmm;
// Broj balona
final int NUM_BALLOONS =   10;
// Baloni na sceni
final ArrayList<Balloon> bloons = new ArrayList<Balloon>();
// Baloni u simulaciji
final ArrayList<Balloon> simBloons = new ArrayList<Balloon>();
// Konstanta preciznosti da bi se rešili greške u pokretnom
// zarezu kod detekcije sudara
// Ako je premala, može se desiti da loptica mora da udari
// pravo u centar balona da bi balon pukao. Ako je, pak,
// prevelika, može se desiti da balon pukne dok loptica
// prolazi pored njega. Možda.
final float PRECISE = 1000000000;
// Još jedan način da poboljšamo preciznost je povećavanjem
// framerate-a, ali ne želimo da umesto balona puca
// korisnikov procesor.
final float FRAMERATE = 1000;

class Balloon {
  // Veličina balona [m]
  // Nisam želeo da budem mazohista i napravim posao detekcije
  // sudara 1000x težim tako da su baloni krugovi, a ne elipse
  private final float SIZE = 0.4;
  public PVector pos;
  private color c;
  private boolean rip;
  
  public Balloon(float x, float y) {
    this.pos = new PVector(x, y);
    c = color(random(256), random(256), random(256));
  }
  
  public void draw() {
    if (!rip) {
      fill(c);
      ellipse((pos.x - SIZE / 2) * M_TO_PX, height - (pos.y - SIZE / 2) * M_TO_PX, M_TO_PX * SIZE, M_TO_PX * SIZE);
    }
  }
  
  public boolean overlaps(PVector pos) {
    if (rip) {
      return true;
    }
    float dist = (SIZE + BALL_SIZE) / 2;
    float dx = pos.x - this.pos.x;
    float dy = pos.y - this.pos.y;
    rip = (dx * dx + dy * dy) * PRECISE <= dist * dist * PRECISE;
    return rip;
  }
  
  public void revive() {
    rip = false;
  }
  
  public boolean isDead() {
    return rip;
  }
}

void setup() {
  setStartPos();
  noStroke();
  frameRate(FRAMERATE);
  size(1280, 720);
  surface.setTitle("Baloni | Zadatak 7 | PFE Trening");
  hmm = loadImage("hmm.png");
  float w = width * PX_TO_M;
  float h = height * PX_TO_M;
  bloons.clear();
  simBloons.clear();
  for (int i = 0; i < NUM_BALLOONS; ++i) {
    float x = random(0.4, 0.8) * w;
    float y = random(0.3, 0.6) * h;
    bloons.add(new Balloon(x, y));
    simBloons.add(new Balloon(x, y));
  }
}

void draw() {
  if (done && !moving) {
    drawEnd();
  } else {
    simulate();
    visualize();
  }
}

void drawEnd() {
  background(256, 256, 0);
  textSize(64);
  text("\\o/", 100, 100);
}

void simulate() {
  if (!moving) {
    return;
  }
  // Sekunde [s]
  float t = 1 / frameRate;
  v.y -= G * t;
  pos.x += v.x * t;
  pos.y += v.y * t;
  if (pos.x > width * 1.1 * PX_TO_M || pos.y < -height * 0.1 * PX_TO_M) {
    setStartPos();
    v = new PVector(0, 0);
    moving = false;
    thinking = false;
  }
  done = true;
  for (Balloon b : bloons) {
    if (!b.overlaps(pos)) {
      done = false;
    }
  }
}

void visualize() {
  background(0, 0, 0);
  fill(256, 0, 0);
  ellipse((pos.x - BALL_SIZE / 2) * M_TO_PX, height - (pos.y - BALL_SIZE / 2) * M_TO_PX, M_TO_PX * BALL_SIZE, M_TO_PX * BALL_SIZE);
  for (Balloon b : bloons) {
    b.draw();
  }
  if (moving && thinking) {
    image(hmm, 0, 0);
  }
}

void mousePressed() {
  if (moving) {
    return;
  }
  if (done) {
    setup();
    done = false;
    return;
  }
  float dx = mouseX * PX_TO_M - pos.x;
  float dy = (height - mouseY) * PX_TO_M - pos.y;
  v.x = dx * SCALE_ARROW;
  v.y = dy * SCALE_ARROW;
  moving = true;
}

void keyPressed() {
  if (keyCode == 65) {
    thinking = true;
    PVector simPos = new PVector();
    PVector simV = new PVector();
    float t = 1 / frameRate;
    int maxHit = 0;
    // Pikseli!
    int maxX = 0;
    int maxY = 0;
    // x i y su u pikselima!!!
    for (int x = 0; x < width; ++x) {
      for (int y = 0; y < height; ++y) {
        // Simuliramo bacanje
        int hit = 0;
        for (int i = 0; i < NUM_BALLOONS; ++i) {
          if (!bloons.get(i).isDead()) {
            simBloons.get(i).revive();
          }
        }
        simPos.x = START.x;
        simPos.y = START.y;
        simV.x = (x * PX_TO_M - START.x) * SCALE_ARROW;
        simV.y = (y * PX_TO_M - START.y) * SCALE_ARROW;
        while (simPos.x >= 0 && simPos.x <= width * 1.1 * PX_TO_M && simPos.y >= -height * 0.1 * PX_TO_M) {
          simV.y -= G * t;
          simPos.x += simV.x * t;
          simPos.y += simV.y * t;
          for (Balloon b : simBloons) {
            if (b.overlaps(simPos)) {
              ++hit;
            }
          }
        }
        if (hit > maxHit) {
          maxHit = hit;
          maxX = x;
          maxY = y;
        }
      }
    }
    v.x = (maxX * PX_TO_M - START.x) * SCALE_ARROW;
    v.y = (maxY * PX_TO_M - START.y) * SCALE_ARROW;
    moving = true;
  }
}

void setStartPos() {
  pos.x = START.x;
  pos.y = START.y;
}
