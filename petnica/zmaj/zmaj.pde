// Inicijalna dužina segmenta prave
final float MAX_LENGTH = 400;
// Gde se po prvi put iscrtava prava
final float START_X = 200;
final float START_Y = 200;
// Velika matrica kao pomoć pri generisanju
// dva segmenta prave od jednog u zavisnosti
// od pravca segmenta
// Elementi označavaju:
// [
//     Način na koji se menja X u prvom segmentu,
//     Način na koji se menja Y u prvom segmentu,
//     Način na koji se menja X u drugom segmentu,
//     Način na koji se menja Y u drugom segmentu
// ]
// Načini menjanja su:
//     0 - Koordinata se ne menja
//     1 - Koordinata se povećava
//    -1 - Koordinata se smanjuje
final int[][] ZMAJ = {
  {-1,  0,  0,  1}, // Dole levo
  {-1,  1,  1,  1}, // Dole
  { 0,  1,  1,  0}, // Dole desno
  { 1,  1,  1, -1}, // Desno
  { 1,  0,  0, -1}, // Gore desno
  { 1, -1, -1, -1}, // Gore
  { 0, -1, -1,  0}, // Gore levo
  {-1, -1, -1,  1}, // Levo
  { 0,  0,  0,  0}  // Error
};
// Lista segmenata prave u vidu vektora koji
// označavaju "pravac kretanja" segmenta
ArrayList<PVector> crte = new ArrayList<PVector>();
// Pomoćna lista pri generisanju crta sledeće iteracije
final ArrayList<PVector> noveCrte = new ArrayList<PVector>();
// Trenutna iteracija
int iteracija = 1;
// Poboljšavanje memorijske efikasnosti
PVector crta, prvi, drugi;

void setup() {
  // Ako želite da smanjite na 500x500 ne zaboravite da
  // takođe dva puta smanjite MAX_LENGTH, START_X i
  // START_Y konstante
  size(1000, 1000);
  stroke(255, 255, 255);
  surface.setTitle("Zmajeva kriva | Zadatak 6 | PFE Trening");
  generate();
}

void draw() {
  // Noop, jer nam realno treba da se prava iscrta samo jednom
  // u ovoj implementaciji
}

// Dužina jednog segmenta prave za trenutnu iteraciju
float getLength() {
  float res = 1 / pow(2, iteracija / 2);
  if (iteracija % 2 == 1) {
    res = res * sqrt(2) / 2;
  }
  return res * MAX_LENGTH;
}

// "Pravac kretanja" vektora
int getDirection(PVector crta) {
  int levo = crta.x < 0 ? 1 : crta.x == 0 ? 0 : -1;
  int dole = crta.y > 0 ? 1 : crta.y == 0 ? 0 : -1;
  if (dole == 1 && levo == 1) {
    return 0;
  } else if (dole == 1 && levo == 0) {
    return 1;
  } else if (dole == 1 && levo == -1) {
    return 2;
  } else if (dole == 0 && levo == -1) {
    return 3;
  } else if (dole == -1 && levo == -1) {
    return 4;
  } else if (dole == -1 && levo == 0) {
    return 5;
  } else if (dole == -1 && levo == 1) {
    return 6;
  } else if (dole == 0 && levo == 1) {
    return 7;
  } else {
    return 8;
  }
}

// Metoda za generisanje i iscrtavanje sledeće iteracije
void generate() {
  background(0, 0, 0);
  if (iteracija == 1) {
    // Ako smo na početku, inicijalizuj segmente
    crte.add(new PVector(MAX_LENGTH, MAX_LENGTH));
    crte.add(new PVector(MAX_LENGTH, -MAX_LENGTH));
    textSize(12);
    text("Kliknite na prozor za sledeću iteraciju", 0, 12);
  } else {
    // Generisanje novih crta
    for (int i = 0; i < crte.size(); ++i) {
      crta = crte.get(i);
      int dir = getDirection(crta);
      float k = getLength();
      prvi = new PVector(k * ZMAJ[dir][0], k * ZMAJ[dir][1]);
      drugi = new PVector(k * ZMAJ[dir][2], k * ZMAJ[dir][3]);
      // Kada sam pravio ZMAJ matricu smatrao sam
      // da se segmenti docrtavaju sa "desne" strane
      // trenutnog segmenta
      if (i % 2 == 0) {
        noveCrte.add(prvi);
        noveCrte.add(drugi);
      } else {
        noveCrte.add(drugi);
        noveCrte.add(prvi);
      }
    }
    // Nije memorijski efikasno
    crte = (ArrayList) noveCrte.clone();
    noveCrte.clear();
  }
  // Iscrtavanje crta
  float x = START_X;
  float y = START_Y;
  for (PVector crta : crte) {
    line(x, y, x + crta.x, y + crta.y);
    x += crta.x;
    y += crta.y;
  }
}

// Klikni me
void mousePressed() {
  ++iteracija;
  generate();
}
