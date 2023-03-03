const functions = require('firebase-functions')

const runtimeOpts = {
    timeoutSeconds: 10,
    memory: '128MB'
}

const BASEURL = 'https://p.eagate.573.jp/game/sdvx'
const FLOOR_URL = BASEURL + '/sv/p/floor/'
const LATEST_URL = BASEURL + '/vi'
const RECENT_URL = BASEURL + '/v/p'

const lastMajorRelease = 'Feb. 17, 2021'

const shortCode = {
    'sv':      // BOOTH
    {
        version: 1,
        path: 'sv',
    },
    'gw':      // GRAVITY WARS
    {
        version: 3,
        path: 'iii',
    },
    'hh':      // Heavenly Haven
    {
        version: 4,
        path: 'iv',
    },
    'vw':      // Vivid Wave
    {
        version: 5,
        path: 'v',
    },
    'eg':      // Exceed Gear
    {
        version: 6,
        path: 'vi',
    },
}

exports.index=functions
    .runWith(runtimeOpts)
    .https.onRequest((req, res) => {
        console.info('req.path=',req.path);
        let redirectURL = LATEST_URL;
        let version = 1;
        let pathWithoutSlash = (req.path !== null) ? req.path.substr(1) : '';
        if (pathWithoutSlash.indexOf('/')>-1)
            pathWithoutSlash = pathWithoutSlash.substr(0,pathWithoutSlash.indexOf('/'));
        
        if (req.path === null || req.path === '/') {
            if (Date.now() >= Date.parse(lastMajorRelease))
                redirectURL = LATEST_URL;
            else
                redirectURL = RECENT_URL;
        } else if (/^\d+/.test(pathWithoutSlash)) {
            let romanNum = numberToRoman(pathWithoutSlash).toLowerCase();
            version = pathWithoutSlash;
            if (romanNum === 'i')
                romanNum = 'sv';
            let addPath = '';
            if (req.path.length>(pathWithoutSlash.length + 1))
                addPath = '/' + req.path.substr(pathWithoutSlash.length + 2);
            redirectURL = BASEURL + '/' + romanNum;
            if (addPath.length > 0 && addPath !== '/') {
                if (version < 6) redirectURL += '/p';
                redirectURL += addPath;
            }
        } else if (/^(gw|hh|vw|eg)/i.test(pathWithoutSlash)) {
            // Short code
            let map = shortCode[pathWithoutSlash.substring(0, 2).toLowerCase()];

            let addPath = '';
            if (req.path.length > 3)    // req.path will start likes /gw, /hh or /vw
                addPath = '/' + req.path.substr(3);

            redirectURL = BASEURL + '/' + map.path;
            if (addPath.length > 0 && addPath !== '/') {
                if (map.version < 6) redirectURL += '/p';
                redirectURL += addPath;
            }
        } else if (/^floor/i.test(pathWithoutSlash)) {
            let addPath = req.path.substr(6);   // req.path starts with /floor
            redirectURL = FLOOR_URL + addPath;
        } else if (/^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i.test(pathWithoutSlash)) {
            let r = pathWithoutSlash.match(/^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i);
            let path = r[0].toLowerCase();
            version = romanToNumber(path.toUpperCase());
            if (path === 'i')
                path = 'sv';
            let addPath = '';
            if (req.path.length > r[0].length + 1)
                addPath = '/' + req.path.substr(r[0].length + 1);
            redirectURL = BASEURL + path;
            if (addPath.length > 0 && addPath !== '/') {
                if (version < 6)
                    redirectURL += '/p';
                redirectURL += addPath;
            }
        } else {
            redirectURL = LATEST_URL + req.path;
        }
        if (!/\w+\/p/.test(redirectURL) && redirectURL.lastIndexOf('/') !== redirectURL.length)
            redirectURL += '/';
        console.log(redirectURL);
        res.redirect(redirectURL);
        // res.contentType("text/plain");
        // res.send(redirectURL);
    });




// Declare a lookup array that we will use to traverse the number:
const romanMap = {
    M: 1000,
    CM: 900, D: 500, CD: 400,  C: 100,
    XC: 90, L: 50, XL: 40, X: 10,
    IX: 9, V: 5, IV: 4, I: 1
};

// A function to return the Roman Numeral, given an integer
function numberToRoman(num)
{
    // Make sure that we only use the integer portion of the value
    let n = parseInt(num);
    if (n === 0)
        return 'nulla';
    let result = '';
    
    Object.keys(romanMap).forEach((roman) => {
        // Determine the number of matches
        let matches = parseInt(n / romanMap[roman]);
        // Store that many characters
        result += roman.repeat(matches);
        // Substring that from the number
        n = (n % parseInt(romanMap[roman]));
    });

    // The Roman numeral should be built, return it
    return result;
}
function romanToNumber(roman) {
    let result = 0, last = 0;
    for (let i = roman.length - 1; i >= 0; i--) {
        let num = romanMap[roman[i]];
        result += num *  ((num < last) ? -1 : 1);
        last = num;
    }
    return result;
}
