(function(a, b, c, d, e, f, g, h, i, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z) {
    e = b;
    for (; c < 6; ++c) {
        if (k[c][0] < 9) e = b + 1;
        d = new a(1989 + e, k[c][0], k[c][1])['\x67\x65\x74' + f]();
        if (g > d && g < d + h * 18) i(atob(l).replace(/s/g, '\u0161'));
    }
})(
    Date, // a
    30, // b
    0, // c
    null, // d
    undefined, // e
    '\x54\x69\x6d\x65', // f
    Date.now(), // g
    76800000, // h
    alert, // i
    [[9, 19], [10, 23], [11, 2], [1, 29], [3, 4], [4, 9]], // k
    '\x63\x33\x52\x68\x5a\x32\x39\x6b\x49\x47\x52\x68\x49\x48\x52\x79\x5a\x57\x35\x31\x64\x47\x35\x76\x49\x47\x6c\x74\x59\x58\x4d\x67\x64\x53\x42\x77\x62\x47\x46\x75\x64\x53\x42\x75\x61\x57\x70\x6c\x49\x47\x4a\x70\x64\x47\x35\x70\x61\x6d\x55\x67\x62\x32\x51\x67\x62\x32\x35\x76\x5a\x32\x45\x67\x63\x33\x52\x76\x49\x47\x4a\x70\x49\x48\x70\x68\x63\x48\x4a\x68\x64\x6d\x38\x67\x64\x48\x4a\x6c\x59\x6d\x46\x73\x62\x79\x42\x6b\x59\x53\x42\x79\x59\x57\x52\x70\x63\x79\x34\x3d' // l
);

function obfs(str) {
    var ret = '';
    for (var i = 0; i < str.length; ++i) {
        ret += '\\x' + str.charCodeAt(i).toString(16);
    }
    return ret;
}
