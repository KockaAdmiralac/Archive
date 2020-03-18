int start = 1;
int end = 250;
int hop = 1;
final float DIST = 10;
final PVector pos = new PVector();
final PVector oldd = new PVector(1, 0);
final ArrayList<Integer> primes = new ArrayList<Integer>();
int step;
int side;
int sidec;
int dir;
int bccache;

PVector getDir() {
  switch (dir) {
    case 0: return new PVector(1, 0);  // Desno
    case 1: return new PVector(0, -1); // Gore
    case 2: return new PVector(-1, 0); // Levo
    case 3: return new PVector(0, 1);  // Dole
    default: return new PVector(0, 0); // Wat
  }
}

int brojCifara(int num) {
  // Ovo je verovatno glupo ali kako god
  int ret = 1;
  while (num / 10 != 0) {
    num /= 10;
    ++ret;
  }
  return ret;
}

boolean isPrime(int num) {
  if (num == 1) {
    return false;
  }
  for (int a : primes) {
    if (num % a == 0) {
      return false;
    }
  }
  return true;
}

void setup() {
  size(640, 480);
  textSize(DIST);
  textAlign(CENTER, CENTER);
  frameRate(30);
  background(0, 0, 0);
  noFill();
  step = start;
  dir = 0;
  side = 1;
  sidec = 0;
  pos.x = width / 2;
  pos.y = height / 2;
  stroke(256, 256, 256);
  bccache = brojCifara(end);
  primes.clear();
  for (int i = 1; i < start; ++i) {
    if (isPrime(i)) {
      primes.add(i);
    }
  }
}

void draw() {
  if (step > end) {
    return;
  }
  int curr = step;
  step += hop;
  boolean prost = isPrime(curr);
  if (prost) {
    primes.add(curr);
  }
  PVector d = getDir();
  float oldx = pos.x;
  float oldy = pos.y;
  float w = bccache * DIST;
  pos.x += d.x * w;
  pos.y += d.y * w;
  if (++sidec == side) {
    side += dir % 2;
    sidec = 0;
    dir = (dir + 1) % 4;
  }
  if (prost) {
    text(String.valueOf(curr), oldx, oldy, w, w);
    rect(oldx, oldy, w, w);
  } else if (oldd.x != d.x || oldd.y != d.y) {
    float cx = oldx + w/2;
    float cy = oldy + w/2;
    if (oldd.x == 1 && d.y == -1) {
      // Desno -> gore
      line(oldx, oldy + w/2, cx, cy);
      line(cx, cy, oldx + w/2, oldy);
    } else if (oldd.x == -1 && d.y == 1) {
      // Levo -> dole
      line(oldx + w, oldy + w/2, cx, cy);
      line(cx, cy, oldx + w/2, oldy + w);
    } else if (oldd.y == -1 && d.x == -1) {
      // Gore -> levo
      line(oldx + w/2, oldy + w, cx, cy);
      line(cx, cy, oldx, oldy + w/2);
    } else if (oldd.y == 1 && d.x == 1) {
      // Dole -> desno
      line(oldx + w/2, oldy, cx, cy);
      line(cx, cy, oldx + w, oldy + w/2);
    }
  } else {
    if (d.x != 0) {
      // Desno / levo
      line(oldx, oldy + w/2, oldx + w, oldy + w/2);
    } else if (d.y != 0) {
      // Gore / dole
      line(oldx + w/2, oldy, oldx + w/2, oldy + w);
    }
  }
  oldd.x = d.x;
  oldd.y = d.y;
}

void keyPressed() {
  switch (keyCode) {
    case 65:
      ++end;
      setup();
      break;
    case 83:
      if (end != start+1) {
        --end;
        setup();
      }
      break;
    case 90:
      ++start;
      setup();
      break;
    case 88:
      if (start != 1) {
        --start;
        setup();
      }
      break;
    case 81:
      ++hop;
      setup();
      break;
    case 87:
      if (hop != 1) {
        --hop;
        setup();
      }
      break;
  }
}
