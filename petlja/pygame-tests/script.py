import pygame as pg

# uključivanje rada biblioteke PyGame
pg.init()

# postavljamo naslov prozora
pg.display.set_caption("Pygame")
# određujemo dimenzije prozora
(sirina, visina) = (400, 400)
# prikazujemo prozor tih dimenzija
prozor = pg.display.set_mode((sirina, visina))

# bojimo pozadinu prozora u belo
prozor.fill(pg.Color("white"))

# crtamo crnu duz od tacke sa koordinatama (100, 100) do tacke sa
# koordinatama (300, 300) debljine 5 piksela
pg.draw.line(prozor, pg.Color("black"), (100, 100), (300, 300), 5)

# osvežavamo sadržaj prozora i tako prikazujemo ono što smo nacrtali
pg.display.update()

# čekamo 5 sekundi tj. 5000 milisekundi
pg.time.wait(5000)

# isključivanje rada biblioteke PyGame
pg.quit()
