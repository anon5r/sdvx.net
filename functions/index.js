const functions = require('firebase-functions');

const LATEST_URL = 'https://p.eagate.573.jp/game/sdvx/vi';
const RECENT_URL = 'https://p.eagate.573.jp/game/sdvx/v/p';

const runtimeOpts = {
    timeoutSeconds: 10,
    memory: '128MB'
}

exports.index=functions
    // .region('asia-northeast1')
    .runWith(runtimeOpts)
    .https.onRequest((req, res) => {
        console.info('req.path=',req.path);
        let redirectURL = LATEST_URL;
        let pathWithoutSlash = (req.path !== null) ? req.path.substr(1) : '';
        if (pathWithoutSlash.indexOf('/')>-1)
            pathWithoutSlash = pathWithoutSlash.substr(0,pathWithoutSlash.indexOf('/'));
        
        if (req.path === null || req.path === '/') {
            let nextRelease = new Date();
            nextRelease.setFullYear(2021);	// 2021
            nextRelease.setMonth(1);	// Feb
            nextRelease.setDate(17);	// 17
            if (Date.now() >= nextRelease.getTime())
                redirectURL = LATEST_URL;
            else
                redirectURL = RECENT_URL;
        } else if (/^\d+/.test(pathWithoutSlash)) {
            let romanNum = numberToRoman(pathWithoutSlash).toLowerCase();
            if (romanNum === 'i')
                romanNum = 'sv';
            let addPath = '';
            if (req.path.length>(pathWithoutSlash.length + 1))
                addPath = '/' + req.path.substr(pathWithoutSlash.length + 2);
            redirectURL = 'https://p.eagate.573.jp/game/sdvx/' + romanNum;
            if (addPath.length > 0 && addPath !== '/')
                redirectURL += '/p' + addPath;
        } else if (/^(gw|hh|vw|eg|xg)/i.test(pathWithoutSlash)) {
            // Short code
            let version = 'sv';
            switch (pathWithoutSlash.substring(0, 2).toLowerCase()) {
                case 'sv':      // BOOTH
                    version = 'sv';
                    break;
                case 'gw':      // GRAVITY WARS
                    version = 'iii';
                    break;
                case 'hh':      // Heavenly Haven
                    version = 'iv';
                    break;
                case 'vw':      // Vivid Wave
                    version = 'v';
                    break;
                case 'eg':      // Exceed Gear
                case 'xg':      // Exceed Gear
                    version = 'vi';
                    break;
            }
            let addPath = '';
            if (req.path.length > 3)    // req.path will start likes /gw, /hh or /vw
                addPath = '/' + req.path.substr(3);
            redirectURL = 'https://p.eagate.573.jp/game/sdvx/' + version;
            if (addPath.length > 0 && addPath !== '/')
                redirectURL += '/p' + addPath;
        //} else if (req.path === '/ps') {
        //  // /ps will be worked configured by firebase,json
        //         res.redirect('https://itunes.apple.com/jp/app/sdvxpsiv/id1287152421?mt=8');
        } else if (/^floor/i.test(pathWithoutSlash)) {
            let addPath = req.path.substr(6);   // req.path starts with /floor
            redirectURL = 'https://p.eagate.573.jp/game/sdvx/sv/p/floor/' + addPath;
        } else if (/^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i.test(pathWithoutSlash)) {
            let r = pathWithoutSlash.match(/^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i);
            let version = r[0].toLowerCase();
            if (version === 'i')
                version = 'sv';
            let addPath = '';
            if (req.path.length > r[0].length + 1)
                addPath = '/' + req.path.substr(r[0].length + 1);
            redirectURL = 'https://p.eagate.573.jp/game/sdvx/' + version;
            if (addPath.length > 0 && addPath !== '/')
                redirectURL += '/p' + addPath;
            //redirectURL = 'https://p.eagate.573.jp/game/sdvx/' + version + '/p' + addPath;
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




// A function to return the Roman Numeral, given an integer
function numberToRoman(num)
{
    // Make sure that we only use the integer portion of the value
    let n = parseInt(num);
    let result = '';
    // Declare a lookup array that we will use to traverse the number:
    let lookup = {
        M: 1000,
        CM: 900, D: 500, CD: 400,  C: 100,
        XC: 90, L: 50, XL: 40, X: 10,
        IX: 9, V: 5, IV: 4,I: 1
    };
    Object.keys(lookup).forEach((roman) => {
        // Determine the number of matches
        var matches = parseInt(n / lookup[roman]);
        // Store that many characters
        result += roman.repeat(matches);
        // Substring that from the number
        n = (n % parseInt(lookup[roman]));
    });

    // The Roman numeral should be built, return it
    return result;
}
