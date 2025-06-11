function imgError(e){
    e.stopPropagation();
    console.error("Image Not Found: " + e.target.getAttribute("src"));
    //e.target.parentNode.removeChild(e.target);
    if (!e.target.classList.contains("img-hidden"))
        e.target.classList.add("img-hidden");
    return true;
}
function zerofill(value, num){
    return (('0'+value).slice(num*-1));
}

const baseURL = 'https://p.eagate.573.jp/game/bemani/fansite/p';
let size = 200;
if (document.body.clientWidth < 1024) {
    size = Math.floor(document.body.clientWidth / 2.6);
    if (size > 200) size = 200;
}
const imgSize = size;



let date = new Date();

Vue.component('img-jacket', {
    props: [
        'ym',
        'game',
        'num',
    ],
    data: () => {
        return {
            'base': baseURL,
            'width': imgSize,
            'height': imgSize
        };
    },
    template: '<img ' +
      ' :src=\'`${base}/images/music/${ym}_jk/${ym}_${game}_${zerofillNum}.jpg`\'' +
      ' :width="`${width}`" :height="`${height}`"' +
      ' class="img-shadow img-load"' +
      ' v-on:error.self.capture="imgError">',
    computed: {
        zerofillNum: function(){
            return zerofill(this.num,2);
        }
    },
    created: function() {
        this.base = baseURL;
    },
    updated: () => {
        let img=document.getElementsByClassName('img-load');
        for (let i in img) {
            if (img[i].classList.contains("img-hidden"))
                img[i].classList.remove("img-hidden");
            img[i].addEventListener("error", imgError);
        }
    },
    methods: {
        'imgError': imgError
    }
});
const vm = new Vue({
    el: '#app',
    data: {
        arcadeList: {
            "iidx"  : "BEATMANIA IIDX",
            "sv"    : "SOUND VOLTEX",
            "ksv"   : "SOUND VOLTEX (コナステ)",
            "jb"    : "jubeat",
            "nst"   : "ノスタルジア",
            "po"    : "pop'n music",
            "gd"    : "GITADORA",
            "dan"   : "DANCERUSH STARDOM",
            "ddr"   : "DanceDance Revolution",
            "de"    : "Dance Evolution",
            "bs"    : "BEAT STREAM",
            "msc"   : "MÚSECA",
            "rb"    : "REFLEC BEAT",
            "ban01" : "バンめし♪ ふるさとグランプリ ROUND1 ～春の陣～",
            "ban02" : "バンめし♪ ふるさとグランプリ ROUND2 ～夏の陣～",
            "ban03" : "バンめし♪ ふるさとグランプリ ROUND3 ～秋の陣～",
            // "ban04" : "バンめし♪ ふるさとグランプリ ROUND4 ～冬の陣～",
            "bjm2020": "いちかのBEMANI超じゃんけん大会2020",
        },
        dateList: [],
        jackets: [],
        game: "",
        ym: "",
        loaded: false,
    },
    created: function(){
        this.listDate();
    },
    watch: {
        game: function(val,old){
            this.loaded = false;
            vm.$forceUpdate();
            if (this.ym!=='')
                this.loaded = true;
        },
        ym: function(val,old){
            this.loaded = false;
            vm.$forceUpdate();
            if (this.game!=='')
                this.loaded = true;
        }
    },
    methods: {
        listDate: function() {
            // w:[1,2],sp:[3,4,5],su:[6,7,8],au:[9,10,11],w:[12]
            let seasonMap=['w','w','sp','sp','sp','su','su','su','a','a','a','w'],
              seasons={'w':'Winter','sp':'Spring','su':'Summer','a':'Autumn'},
              currentYM=((date.getFullYear()*100)+(date.getMonth()+1)),
              currentYS=(date.getFullYear().toString()+seasonMap[date.getMonth()+1]);
            if (date.getMonth()<1) {
                currentYM=((date.getFullYear()-1)*100+12);
                currentYS=(date.getFullYear().toString()+seasonMap[seasonMap.length-1]);
            }
            let prvYS='';
            for(let y=date.getFullYear(); y > 2020; y--){
                for(let m=12; m >= 1; m--){
                    let ym=(y*100)+m;
                    if(ym < 202101) break;
                    if(ym > currentYM) continue;
                    let s=seasonMap[m-1];
                    let ys=y.toString()+s;
                    if(ys === prvYS) continue;
                    if( m <= 1 && s === 'w'
                      || m <= 4 && s === 'sp'
                      || m <= 7 && s === 'su'
                      || m <= 10 && s === 'a'
                      || m === 12 && s === 'w') continue;
                    this.dateList.push({key:ys, date:(y+" "+seasons[s])});
                    prvYS=ys;
                }
            }
            for(let y=2020; y >=2014; y--){
                for(let m=12; m >= 1; m--){
                    let ym=(y*100)+m;
                    if(ym < 201411) break;
                    if(ym > currentYM) continue;
                    this.dateList.push({key:ym, date:(y+"年"+(("0"+m).slice(-2))+"月")});
                }
            }
        }
    }
});