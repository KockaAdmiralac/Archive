class Prepreka {
  public float x;
  public boolean ide;
  private int life;
  public float v;
  private final int LIFETIME = 5;
  public static final float SPEED = 30.0;
  public static final int HEIGHT = 200;
  public static final int WIDTH = 120;
  public Prepreka(float x, boolean ide) {
    this.x = x;
    v = ide ? SPEED : 0.0;
    life = LIFETIME * framerate;
  }
  public void draw() {
    --life;
    x += v / framerate;
    fill(0, 0, 255);
    rect(x, (windowHeight - HEIGHT) / 2, WIDTH, HEIGHT);
  }
  public boolean isDead() {
    return life <= 0;
  }
}
