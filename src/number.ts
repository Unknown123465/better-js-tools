

class NumberTools {

    static getRandomNumber(min:number, max:number, attempt:number = 1, numType:"int"|"float" = "int"):number|number[] {

        const random = ():number => {
            return numType === "int" ? Math.floor(Math.random() * (max - min)) + min : Math.random() * (max - min) + min;
        }

        if (attempt <= 0 || !Number.isInteger(attempt)) {
            throw new RangeError("The attempt argument must be an integer 1 or greater.");
        } else if (!isFinite(min) || !isFinite(max)) {
            throw new RangeError("The minimum(min) and maximum(max) argument must be finite.");
        } else if (min > max) {
            throw new RangeError("The minimum(min) argument must not be larger than the maximum(max) argument.")
        } else if (attempt === 1) {
            return random();
        }
        
        const array:number[] = [];
        this.getNumberArray(attempt).forEach(() => {
            array.push(random());
        });

        return array;
    }

    static getNumberArray(first:number, second?:number|undefined, unit:number = 1):number[] {

        if (!Number.isInteger(first) || (typeof second === "number" && !Number.isInteger(second))) {
            throw new RangeError("The arguments must be integer (but the second and unit argument can be undefined).");
        } else if (typeof second === "number" && first > second) {
            throw new RangeError("The first argument must not be greater than the second argument.");
        } else if (unit <= 0 || !isFinite(unit) || !Number.isInteger(unit)) {
            throw new RangeError("The unit argument must be at least 1 and an integer and finite.");
        }

        const array:number[] = [];
        for (let i = typeof second === "number" && second >= 1 ? first : 0; i < (typeof second === "number" ? second : first); i += unit) {
            array.push(i);
        }

        return array;
    }

    
}

export default NumberTools;