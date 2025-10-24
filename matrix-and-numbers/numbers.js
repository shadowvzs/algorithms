const getPrimeAndCompositeNumbers = (maxNumber) => {
    const primeNumberSet = new Set();
    const compositeNumberSet = new Set();

    // go over each number and mark its multiples as not prime
    let n = 2;
    while (n < maxNumber) {
        // skip the verification because current number is already marked as composite
        if (compositeNumberSet.has(n)) {
            n++;
            continue;
        }

        // if the number is not marked as composite, it is a prime number
        primeNumberSet.add(n);

        // start from square of the number and mark all its multiples as composite
        for (let i = n * n; i <= maxNumber; i += n) {
            compositeNumberSet.add(i);
        }

        n++;
    }

    return {
        primeNumbers: Array.from(primeNumberSet).sort((a, b) => a - b),
        compositeNumbers: Array.from(compositeNumberSet).sort((a, b) => a - b)
    };
}

const getPrimeNumbers = (maxNumber) => getPrimeAndCompositeNumbers(maxNumber).primeNumbers;

// Euclide algorithm based on gcd(a, b) = gcd(a, r), it returns also the history of the steps
const extendedEuclideanAlgorithm = (num1, num2, history = []) => {
    // Ensure b is greater than or equal to a
    // a = smaller number, b = larger number
    const [a, b] = num1 < num2 ? [num1, num2] : [num2, num1];
    // quotient roundDown(b:a)
    const q = Math.floor(b / a);
    // remainder b % a or b - a * q
    const r = b % a;
    // If the remainder is 0, then a is the GCD
    history.push({ a, b, q, r });
    if (r === 0) {
        return history;
    }
    
    // Recursively call the function with b and the remainder
    return extendedEuclideanAlgorithm(a, r, history);
}

// Euclide algorithm based on gcd(a, b) = gcd(a, r)
const getGreatestCommonDivisor = (num1, num2) => {
    // Ensure b is greater than or equal to a
    // a = smaller number, b = larger number
    const [a, b] = num1 < num2 ? [num1, num2] : [num2, num1];
    // quotient roundDown(b:a)
    const q = Math.floor(b / a);
    // remainder b % a or b - a * q
    const r = b % a;
    // If the remainder is 0, then a is the GCD
    if (r === 0) {
        return a;
    }
    
    // Recursively call the function with b and the remainder
    return getGreatestCommonDivisor(a, r);
}