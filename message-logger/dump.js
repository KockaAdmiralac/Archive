// Setup
const dump = require('./dump.json');
let cid, uid, word;

// Most active channels
console.log(
    Object.keys(dump.messages)
        .sort(
            (a, b) => dump.messages[b].length -
                      dump.messages[a].length
        )
        .map(
            cid => `${dump.channels.find(c => c.id === cid).name}: ${dump.messages[cid].length}`
        )
        .join('\n')
);

// Most active users
const messagesByMember = id => Object.keys(dump.messages)
    .map(
        cid => dump.messages[cid]
            .filter(m => m.authorID === id)
            .length
    )
    .reduce((a, b) => a + b);
console.log(
    dump.members.sort(
        (a, b) => messagesByMember(b.userID) - messagesByMember(a.userID)
    )
    .map((m, i) => `${i + 1}.\t${m.displayName}\t${messagesByMember(m.userID)}`)
    .join('\n')
);

// Channels a user has posted in the most
const messagesByMemberInChannel = (cid, uid) => (dump.messages[cid] || [])
    .filter(m => m.authorID === uid)
    .length;
uid = '639227330597879828';
console.log(
    dump.channels.sort(
        (a, b) => messagesByMemberInChannel(b.id, uid) -
                  messagesByMemberInChannel(a.id, uid)
    )
    .map(c => `${c.name}: ${messagesByMemberInChannel(c.id, uid)}`)
    .join('\n')
);

// Most active users in a specific channel
cid = '639235353537937411';
console.log(
    dump.members.sort(
        (a, b) => messagesByMemberInChannel(cid, b.userID) -
                  messagesByMemberInChannel(cid, a.userID)
    )
    .map(m => `${m.displayName}: ${messagesByMemberInChannel(cid, m.userID)}`)
    .join('\n')
);

// Word usage by channel
word = /raz.{0,20} pretp.{0,20}|раз.{0,20} претп.{0,20}/;
const wordUsedInChannel = (word, cid) => (dump.messages[cid] || [])
    .filter(m => m.content.match(word))
    .length;
console.log(
    dump.channels.sort(
        (a, b) => wordUsedInChannel(word, b.id) - wordUsedInChannel(word, a.id)
    )
    .map(c => `${c.name}: ${wordUsedInChannel(word, c.id)}`)
    .join('\n')
);

// Members who left
const members = {};
const uniqueIDsWhoLeft = {};
dump.members.forEach(m => members[m.userID] = m);
Object.keys(dump.messages).map(cid => dump.messages[cid].filter(m => !m.webhookID && !members[m.authorID]).map(m => m.authorID)).reduce((a, b) => a.concat(b)).forEach(id => uniqueIDsWhoLeft[id] = members[id]);
