class NumberTools {
    static getRandomNumber(min, max, attempt = 1, numType = "int") {
        const random = () => {
            return numType === "int" ? Math.floor(Math.random() * (max - min)) + min : Math.random() * (max - min) + min;
        };
        if (attempt <= 0 || !Number.isInteger(attempt)) {
            throw new RangeError("The attempt argument must be an integer 1 or greater.");
        }
        else if (!isFinite(min) || !isFinite(max)) {
            throw new RangeError("The minimum(min) and maximum(max) argument must be finite.");
        }
        else if (attempt === 1) {
            return random();
        }
        const array = [];
        this.getNumberArray(attempt).forEach(() => {
            array.push(random());
        });
        return array;
    }
    static getNumberArray(first, second) {
        if (!Number.isInteger(first) || (typeof second === "number" && !Number.isInteger(second))) {
            throw new RangeError("The first and second arguments must be integer (but the second argument can be undefined).");
        }
        else if (typeof second === "number" && first > second) {
            throw new RangeError("The first argument must not be greater than the second argument.");
        }
        const array = [];
        for (let i = typeof second === "number" && second >= 1 ? first : 0; i < (typeof second === "number" ? second : first); i++) {
            array.push(i);
        }
        return array;
    }
}
export { NumberTools };
