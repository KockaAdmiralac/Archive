final int KVADRATICI = 10;
final float MIN_SIZE = 5;
final ArrayList<Kvadratic> kvadratici = new ArrayList<Kvadratic>();
Kvadratic current;
float currentSize = MIN_SIZE;
int potez = 0;
boolean won;

class Kvadratic {
  public float x;
  public float y;
  public float size;
  public float initSize;
  private color c;
  public int group;
    
  public Kvadratic(float x, float y, int group) {
    this.x = x;
    this.y = y;
    this.size = this.initSize = getSize();
    this.group = group;
    c = getColorByGroup(group);
  }
  
  private color getColorByGroup(int group) {
    switch(group) {
      case 0: return color(255, 0, 0);
      case 1: return color(0, 255, 0);
      case 2: return color(0, 0, 255);
      default: return color(0, 0, 0);
    }
  }
  
  public float overlap(Kvadratic k) {
    float newsize = getSize();
    float dist = size + k.initSize;
    float dx = abs(x - k.x);
    float dy = abs(y - k.y);
    if (dx >= dist || dy >= dist) {
      return newsize;
    }
    if (dx <= size && dy <= size) {
      return 0;
    }
    if (dx > dy) {
      return newsize - dist + dx;
    } else {
      return newsize - dist + dy;
    }
  }
  
  public void draw() {
    fill(c);
    rect(x - size, y - size, size * 2, size * 2);
  }
  
  public float povrsina() {
    return size * size * 4;
  }
}

void setup() {
  size(500, 500);
  frameRate(60);
  noStroke();
  current = new Kvadratic(-100, -100, 1);
  for (int i = 0; i < KVADRATICI; ++i) {
    kvadratici.add(new Kvadratic(round(random(MIN_SIZE, width - MIN_SIZE)), round(random(MIN_SIZE, height - MIN_SIZE)), 0));
  }
}

void draw() {
  if (won) {
    return;
  }
  background(0, 0, 0);
  current.draw();
  for (Kvadratic k : kvadratici) {
    k.draw();
  }
}

float getSize() {
  return MIN_SIZE * pow(2, potez / 2);
}

void mouseMoved() {
  if (won) {
    return;
  }
  float size = getSize();
  float newsize;
  for (Kvadratic k : kvadratici) {
    newsize = k.overlap(current);
    if (newsize < size) {
      size = newsize;
    }
  }
  if (current.x - size < 0) {
    size = current.x;
  }
  if (current.x + size > width) {
    size = width - current.x;
  }
  if (current.y - size < 0) {
    size = current.y;
  }
  if (current.y + size > height) {
    size = height - current.y;
  }
  current.size = size;
  current.x = round(mouseX);
  current.y = round(mouseY);
}

void mousePressed() {
  if (won) {
    return;
  }
  mouseMoved();
  if (current.size > 0) {
    kvadratici.add(current);
    ++potez;
    current = new Kvadratic(round(mouseX), round(mouseY), abs(3 - current.group));
    mouseMoved();
    draw();
    if (potez == 20) {
      checkWin();
      won = true;
    }
  }
}

void checkWin() {
  float zeleni = 0;
  float plavi = 0;
  for (Kvadratic k : kvadratici) {
    float p = k.povrsina();
    if (k.group == 1) {
      zeleni += p;
    } else if (k.group == 2) {
      plavi += p;
    }
  }
  textSize(32);
  fill(255, 255, 255);
  String text;
  if (plavi > zeleni) {
    text = "Plavi su pobedili";
  } else if (zeleni > plavi) {
    text = "Zeleni su pobedili";
  } else {
    text = "Nerešeno";
  }
  text(text, 32, 32);
}
