export class Helper {

    constructor() {
        this.spawnUsed = 0;
        this.botsNameIndex = 0;
    }

    getSpawnPoint(arr) {
        let _spawn = this.spawnUsed;
        if (_spawn == arr.length) {
            _spawn = 0;
            this.spawnUsed = 0;
        } else {
            this.spawnUsed++;
        }
        console.log(`Used spawn point n° ${this.spawnUsed}`);
        return arr[_spawn]
    }

    getBotsName(arr) {
        let _spawn = this.botsNameIndex;
        if (_spawn == arr.length) {
            _spawn = 0;
            this.botsNameIndex = 0;
        } else {
            this.botsNameIndex++;
        }
        return arr[_spawn]
    }

    randomElementInArray(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    // Returns a random integer between min (include) and max (include)
    randBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    rand(min, max) {
        return Math.floor(this.randf(min, max));
    }

    randf(min, max) {
        if (max == null) {
            max = min || 1;
            min = 0;
        }
        return Math.random() * (max - min) + min;
    }

    randOneIn(max = 2) {
        return this.rand(0, max) === 0;
    }

    // https://www.emanueleferonato.com/2007/04/28/create-a-flash-artillery-game-step-1/
    // https://www.safaribooksonline.com/library/view/html5-canvas/9781449308032/ch05s03.html

    getBotsPreferences() {
        let preferences = [/* 'Rifle',  */'Shotgun', 'Plasma', 'Rocket', 'Railgun'];
        let weights = [0.22, 0.24, 0.27, 0.26];
        function generateWeighedList(list, weights) {
            let weighed_list = [];
            // Loop over weights
            for (let i = 0; i < weights.length; i++) {
                let multiples = weights[i] * 100;
                // Loop over the list of items
                for (let j = 0; j < multiples; j++) {
                    weighed_list.push(list[i]);
                }
            }
            return weighed_list;
        };
        let weighed_list = generateWeighedList(preferences, weights);
        let random_num = this.rand(0, weighed_list.length - 1);
        return weighed_list[random_num];
    }

}   

export function degToRad(deg) {
    return (Math.PI*deg)/180
 }
 
 export function radToDeg(rad) {
    return (rad*180)/Math.PI
 }