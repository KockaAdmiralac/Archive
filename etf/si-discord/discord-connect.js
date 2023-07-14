const {latinify, readData} = require('./util.js'),
      discord = require('./discord.json'),
      fs = require('fs');

async function main() {
    const indeksi = await readData('indeksi.txt');
    const connected = [];
    const unconnected = [];
    for (const user of discord) {
        let podaci = null;
        for (const [godina, indeks, prezime, ime] of indeksi) {
            const imeIPrezime = `${ime} ${prezime}`;
            const latinica = latinify(imeIPrezime);
            if (user.displayName.startsWith(imeIPrezime) || user.displayName.startsWith(latinica)) {
                podaci = [godina, indeks, prezime, ime, user.userID];
                break;
            }
        }
        if (podaci) {
            connected.push(podaci);
        } else {
            unconnected.push(user.displayName);
        }
    }
    await fs.promises.writeFile('discord.txt', connected.map(conn => conn.join(';')).join('\n'));
    await fs.promises.writeFile('discord-unconnected.txt', unconnected.join('\n'));
}

main();
