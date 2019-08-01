'use strict';

/**
 * Importing modules
 */
const fs = require('fs'),
      Heap = require('heap');

/**
 * Global variables
 */
const ucenici = {},
      kvote = {},
      smerovi = {},
      queue = [];
let processes = 2;

/**
 * Rounds a number to two decimal digits, but
 * 0.005 is rounded to 0.01 instead of 0.
 * @param {String|Number} num Number to round
 * @returns {Number} Number rounded to two decimals
 */
function round(num) {
    let ret = Number(num) * 100;
    const div = ret % 1;
    if (div >= 0.5) {
        ret += 1;
    }
    ret -= div;
    return Math.round(ret) / 100;
}

/**
 * Processes a line of the ucenici.txt file and inserts the parsed
 * data into the ucenici object.
 * @param {String} line Line to process
 */
function uceniciLine(line) {
    if (!line) {
        return;
    }
    const ucenik = {},
          celine = line.trim().split('/'),
          c1 = celine.shift().split(',');
    // Student code and sibling
    ucenik.sifra = c1[0];
    if (c1[1] !== '0') {
        ucenik.blizanac = c1[1];
    }
    // Enrolled course
    ucenik.smer = celine.shift();
    ucenik.bodovi = 0;
    // Calculating average grades in 6th-8th grade
    for (let i = 0; i < 3; ++i) {
        const ocene = celine
            .shift()
            .split(',')
            .map(Number);
        ucenik.bodovi += round(
            ocene.reduce((a, b) => a + b) / ocene.length
        ) * 4;
    }
    // "Vukova diploma"
    ucenik.vukovac = celine.shift() === 'v';
    // End of the year tests and competitions
    const c7 = celine.shift().split(',');
    ucenik.matura = Number(c7.shift()) + Number(c7.shift()) + Number(c7.shift());
    ucenik.takmicenja = Number(c7.shift());
    ucenik.bodovi += ucenik.matura + ucenik.takmicenja + Number(c7.shift());
    ucenik.bodovi = round(ucenik.bodovi);
    // Wishlist and course-specific points
    ucenik.zelje = [];
    ucenik.zbodovi = {};
    celine.forEach(function(c) {
        if (c) {
            const spl = c.split(',');
            ucenik.zelje.push(spl[0]);
            ucenik.zbodovi[spl[0]] = Number(spl[1]);
        }
    });
    ucenici[ucenik.sifra] = ucenik;
}

/**
 * Processes a line from the kvote.txt file and inserts it into
 * the kvote object
 * @param {String} line Line to process
 */
function kvoteLine(line) {
    if (!line) {
        return;
    }
    const spl = line.split(',');
    kvote[spl[0]] = Number(spl[1]);
}

/**
 * Compares two students
 * @param {Ucenik} a First student
 * @param {Ucenik} b Second student
 * @param {String} smer Course to enroll
 */
function compare(a, b, smer) {
    const ab = a.bodovi + a.zbodovi[smer],
          bb = b.bodovi + b.zbodovi[smer];
    if (a.blizanac === b.sifra || b.blizanac === a.sifra) {
        return 0;
    }
    if (ab !== bb) {
        return ab - bb;
    }
    if (a.vukovac && !b.vukovac) {
        return 1;
    } else if (b.vukovac && !a.vukovac) {
        return -1;
    }
    if (a.zbodovi[smer] !== b.zbodovi[smer]) {
        return a.zbodovi[smer] - b.zbodovi[smer];
    }
    if (a.takmicenja !== b.takmicenja) {
        return a.takmicenja - b.takmicenja;
    }
    if (a.matura !== b.matura) {
        return a.matura - b.matura;
    }
    return 0;
}

/**
 * Gets the student with the specified code or their sibling if they
 * are better in comparison to the specified student.
 * @param {String} sifra Student code
 * @param {String} smer Course to enroll
 */
function boljiUcenik(sifra, smer) {
    const c = ucenici[sifra];
    if (c.blizanac) {
        const b = ucenici[c.blizanac];
        if (compare(c, b, smer) === -1) {
            return b;
        }
    }
    return c;
}

/**
 * Enrolls a student and all of their siblings to a course
 * @param {Ucenik} ucenik The student
 * @param {String} smer The course to enroll
 * @param {Number} zelja Course position on the wishlist
 */
function upisi(ucenik, smer, zelja) {
    if (ucenik.blizanac && ucenici[ucenik.blizanac].upisan !== zelja) {
        ucenik.upisan = zelja;
        ucenici[ucenik.blizanac].upisan = zelja;
        if (ucenik.blizanac2 && ucenici[ucenik.blizanac2].upisan !== zelja) {
            ucenici[ucenik.blizanac2].upisan = zelja;
            smerovi[smer].push(ucenik.blizanac2);
        }
        smerovi[smer].push(ucenik.blizanac);
        smerovi[smer].push(ucenik.sifra);
    } else {
        ucenik.upisan = zelja;
        smerovi[smer].push(ucenik.sifra);
    }
}

/**
 * Attempts to enroll a student in a course.
 * @param {Ucenik} ucenik The student
 * @param {Number} zelja Course's position in the wishlist
 */
function pokusajUpis(ucenik, zelja = 0) {
    if (ucenik.upisan || ucenik.upisan === 0) {
        return;
    }
    const z = ucenik.zelje[zelja];
    if (
        ucenik.blizanac &&
        ucenik.sifra < ucenik.blizanac
    ) {
        return;
    }
    // Enroll the student first, ask questions later
    upisi(ucenik, z, zelja);
    const kvota = kvote[z];
    const size = smerovi[z].size();
    // The student quota has been passed, we need to act now
    if (size > kvota) {
        const popped = [];
        // Pop students from the heap until the quota limit is reached
        for (let i = 0; i < size - kvota; ++i) {
            popped.push(smerovi[z].pop());
        }
        // Return the students that equally compare to the top of the heap
        while (popped.length > 0) {
            const p = popped.pop(),
                  comp = compare(boljiUcenik(p, z), boljiUcenik(smerovi[z].peek(), z), z);
            if (comp >= 0) {
                // We're equal to or better than the top of the heap
                smerovi[z].push(p);
            } else {
                // We have to enroll to the next course in our wishlist and
                // make our siblings do so as well
                const ponovo = ucenici[p];
                if (!ponovo.upisan && ponovo.upisan !== 0) {
                    continue;
                }
                queue.unshift([ponovo.sifra, ponovo.upisan + 1]);
                ucenici[p].upisan = null;
                if (ponovo.blizanac) {
                    ucenici[ponovo.blizanac].upisan = null;
                    queue.unshift([ponovo.blizanac, ponovo.upisan + 1]);
                }
                if (ponovo.blizanac2) {
                    ucenici[ponovo.blizanac2].upisan = null;
                    queue.unshift([ponovo.blizanac2, ponovo.upisan + 1]);
                }
            }
        }
    }
}

/**
 * Generates a heap comparison function based on the course
 * @param {String} smer Course in the context of which to do the comparison
 */
function generateHeap(smer) {
    return function(a, b) {
        return compare(boljiUcenik(a, smer), boljiUcenik(b, smer), smer);
    };
}

/**
 * Callback after an operation of writing to file
 * @param {Error} err The error that occurred, if it occurred
 */
function fileCallback(err) {
    if (err) {
        console.log('rip', e);
    } else if (--processes === 0) {
        console.log('Done!');
    }
}

/**
 * Loading data has finished?
 */
function finished() {
    // No, it hasn't.
    if (--processes !== 0) {
        return;
    }
    // Yes, it has, let's generate our heaps
    for (const smer in kvote) {
        smerovi[smer] = new Heap(generateHeap(smer, kvote[smer]));
    }
    // Go through all students and push them in the enrollment queue, and fix missing data
    for (const sifra in ucenici) {
        if (
            ucenici[sifra].blizanac &&
            ucenici[ucenici[sifra].blizanac].blizanac !== sifra
        ) {
            // Triplets...
            ucenici[ucenici[sifra].blizanac].blizanac2 = sifra;
            ucenici[ucenici[ucenici[sifra].blizanac].blizanac].blizanac2 = sifra;
            ucenici[sifra].blizanac2 = ucenici[ucenici[ucenici[sifra].blizanac].blizanac].sifra;
        }
        queue.push([sifra, 0]);
    }
    // Do the enrollment while there are queued students
    while (queue.length > 0) {
        const [sifra, zelja] = queue.shift();
        pokusajUpis(ucenici[sifra], zelja);
    }
    let debug = '', bodovi = '';
    // We need a debug file to know whether there are any wrongly enrolled students
    for (const sifra in ucenici) {
        const u = ucenici[sifra];
        if (u.smer !== u.zelje[u.upisan]) {
            debug += `${u.sifra},${u.zelje[u.upisan]} (${u.upisan}),${u.smer} (${u.zelje.indexOf(u.smer)})\n`;
        }
    }
    // Calculate the required enrollment points for each course
    for (const smer in smerovi) {
        if (smerovi[smer].size() >= kvote[smer]) {
            const top = ucenici[smerovi[smer].peek()];
            bodovi += `${smer},${round(top.bodovi + top.zbodovi[smer])}\n`;    
        } else {
            bodovi += `${smer},0\n`;
        }
    }
    // Write them to files
    processes = 2;
    fs.writeFile('debug.txt', debug, fileCallback);
    fs.writeFile('bodovi.txt', bodovi, fileCallback);
}

/**
 * Callback after reading from ucenici.txt
 * @param {Error} err Error that occurred when reading from file
 * @param {Buffer} res File contents
 */
function uceniciCallback(err, res) {
    if (err) {
        console.log(err);
        return;
    }
    res.toString().split('\n').forEach(uceniciLine);
    finished();
}

/**
 * Callback after reading from kvote.txt
 * @param {Error} err Error that occurred when reading from file
 * @param {Buffer} res File contents
 */
function kvoteCallback(err, res) {
    if (err) {
        console.log(err);
        return;
    }
    res.toString().split('\n').forEach(kvoteLine);
    finished();
}

// Start the program by reading from files
fs.readFile('ucenici.txt', uceniciCallback);
fs.readFile('kvote.txt', kvoteCallback);
