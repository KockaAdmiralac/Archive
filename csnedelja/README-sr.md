# Upis
Ovaj zadatak sam pisao u JavaScript-u, tačnije [Node.js](https://nodejs.org)-u. Znam da izbor programskog jezika nije najbolji ili najlogičniji, ali sam sa njima u skorije vreme najviše i radio, stoga mi je bilo lakše da se brže prilagodim kucanju ovog programa u JavaScript-u. Izvinjavam se ako kod možda nije najčitkiji ili najoptimalniji, ali sam to pokušao da rešim komentarima iznad svake funkcije i u njima.

Za pokretanje simulacije potreban je Node.js. Može se pokrenuti sa komandama:
```console
$ npm install heap
$ node main.js
```

## Metod rada
1. Program učitava `ucenici.txt` i `kvote.txt`, parsira ih i čuva podatke iz njih
2. Kreira heap učeničkih šifara gde se učenici sortiraju po tome koji ima najviše bodova za taj smer
3. Ubacuje sve učenike u red za upisivanje i onda pokušava da ih upisuje jednog po jednog na njihove želje, redom
    1. Ako učenik ne može da se upiše na dati smer, ubacuju se na vrh reda da bi pokušali sa sledećom željom
    2. Ako je kvota pređena, izbacuju se učenici dok se veličina heap-a ne dovede do kvote. Nakon toga, poredi se svaki izbačeni element sa vrhom heap-a, i ako je bolji ili isti po bodovima kao vrh ubacuje se nazad u heap. Blizanci i trojka se porede po svom najboljem članu porodice. Izbačeni elementi se potom dodaju nazad u red za upis.
    3. **Blizanci i trojka se tretiraju kao jedan učenik.** Specifično, onaj učenik sa najvećom šifrom. Dok se u heap ubacuju odvojeno, između funkcija se prosleđuje samo po jedan učenik a funkcije u sebi tog učenika pretvore u dva ili tri sa njegovom braćom kada dođe do ubacivanja u heap.

## Izlaz
Program generiše dva fajla, `debug.txt` i `bodovi.txt`. `bodovi.txt` je kao u formatu objašnjenom u uputstvu zadatka a `debug.txt` je fajl u kom se sva netačna raspoređivanja prijavljuju. Ako je prazan, program radi.

`debug.txt` prijavljuje na kojim je smerovima učenik upisan i trebao da bude upisan, kao i poziciju tih smerova u učenikovoj listi želja. Ovo se koristilo prilikom pronalaženja nedostajućih učenika, jer se tačno videlo kada je smer na kome je jedan učenik upisan trebao da bude smer na kojem je neki drugi učenik upisan. Kada se dođe do smera na kom je jedan učenik upisan a ne bi trebao da bude, i na kom nijedan drugi učenik ne bi trebao da bude upisan, to znači da je na tom smeru trebao da bude upisan nedostajući učenik.

## Rezultati
Uz pomoć `debug.txt` fajla i simulacije, uspeo sam da uočim dva reda zavisnosti rasporeda učenika i na kraju ta dva reda nalazili su se smerovi učenika koji su nedostajali. Na sajtu rezultata upisa našao sam listu upisanih učenika na te smerove, pogledao koji su sve učenici trenutno na tim smerovima i uporedio te dve liste da bih našao da nedostaju dva učenika sa imenima Dušan Radović, čiji se podaci nalaze ispod.

```csv
148117,0/NINI GB 4R04S/5,5,5,5,5,5,5,5,5,5,5,5,5,5/5,5,5,5,5,5,5,5,5,5,5,5,5,5,5/5,5,5,5,5,5,5,5,5,5,5,5,5,5,5//9.43,9.75,11.55,0.0,0.0/NINI GC 4R04S,0/NINI GB 4R04S,0/NINI GA 4R04S,0/NINI GC 4R01S,0/NINI GB 4R01S,0/NINI GA 4R01S,0/NINI GD 4R03S,0/NINI SI 4O13S,0/NINI SE 4L01S,0/NINI SE 4L10S,0/NINI SM 4E41S,0/NINI SM 4E04S,0/NINI SN 4E40S,0/NINI SN 4E24S,0/NINI SL 4D83S,0/NINI SL 4D14S,0/NINI SF 4L05S,0/NINI SG 3K06S,0/
181528,0/NINI GA 4R01S/5,5,5,5,5,5,5,5,5,5,5,5,5,5/5,5,5,5,5,5,5,5,5,5,5,5,5,5,5/5,5,5,5,5,5,5,5,5,5,5,5,5,5,5/v/10.40,9.43,10.50,0.0,0.0/NINI GA 4R01S,0/NINI GB 4R01S,0/NINI GC 4R01S,0/NINI GA 4R04S,0/NINI GB 4R04S,0/NINI GC 4R04S,0/NINI SI 4O16S,0/NINI GD 4R03S,0/NINI SF 4L05S,0/NINI SF 4L09S,0/NINI SE 4L01S,0/NINI SE 4L10S,0/NINI SF 4L10S,0/NINI SE 4L02S,0/NINI SH 4K14S,0/
```
