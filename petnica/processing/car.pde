public class Car {
  public float x;
  public float v;
  private boolean ubrzava;
  private boolean usporava;
  public static final int WIDTH = 320;
  public static final int HEIGHT = 120;
  public static final float SPEED = 360.0;
  public static final float DISTANCE = 300.0;
  public static final float MIN_DISTANCE = 10.0;
  public static final float UBRZANJE = 400;
  public Prepreka pEffective = null;
  public Car() {
    this.x = -WIDTH;
    v = SPEED;
  }
  public void draw() {
    if (pEffective != null) {
      float realX = x + WIDTH;
      if (realX <= pEffective.x + Prepreka.WIDTH && realX >= pEffective.x) {
        jebiga = true;
      }
      if (pEffective.isDead()) {
        die();
      } else if (v <= pEffective.v) {
        usporava = false;
      }
    } else if (v >= SPEED && ubrzava) {
      ubrzava = false;
      v = SPEED;
    }
    if (ubrzava) {
      v += UBRZANJE / framerate;
    } else if (usporava) {
      v -= UBRZANJE / framerate;
    }
    x += v / framerate;
    if (x > windowWidth) {
      x = -WIDTH;
    }
    fill(255, 0, 0);
    rect(x, (windowHeight - HEIGHT) / 2, WIDTH, HEIGHT);
  }
  public void setSlow(Prepreka pEffective, float distance) {
    if (pEffective == this.pEffective) {
      return;
    }
    this.pEffective = pEffective;
    float dist = distance - MIN_DISTANCE;
    if (dist < 0) {
      dist = MIN_DISTANCE;
    }
    usporava = true;
  }
  public void die() {
    pEffective = null;
    ubrzava = true;
    usporava = false;
  }
}
