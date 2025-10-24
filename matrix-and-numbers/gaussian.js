

`
data is an array of numbers
example
[
[1,  2, 3, 4,  5]
[4,  1, 4, 6,  1]
[11, 2, 9, 2,  5]
[1, 22, 5, 4,  4]
[4,  3, 0, 3,  10]
]
`
const extendedLinearEquationMatrix = [
    [ 1, 1, -1, -2],   // x +  y -  z = -2
    [ 2, -1, 1, 5],    // 2x -  y +  z = 5
    [ -1, 2, 2, 1],    // -x + 2y + 2z = 1
];

const squareMatrix = [
    [1, 1, 0],
    [1, 1, 1],
    [1, 2, 2],
];

// echelon form
// [
//     [1, 1, -1, -2],
//     [0, -3, 3, 9],
//     [0, 0, 7, 7]
// ]
// x=-1, y=-1, z=2
// -1 + -1 - 2 = -4

function gaussianAlgorithm(rows, currentRowIndex = 0, currentColumnIndex = 0, step = 0) {
    rows = JSON.parse(JSON.stringify(rows));
    // Step 0 - Preparation: if there is rows with all zeros, remove them
    if (step === 0) {
        if (rows.length + 1 !== rows[0].length) {
            throw new Error(`Unique solution isn't possible`);
        }
        return gaussianAlgorithm(rows, currentRowIndex, currentColumnIndex, step + 1);
    // Step 1 - Echelon form - elimination the leading coefficients
    // Everything below the diagonal is 0
    // Leading coefficient is the first non-zero number from the left, in a non-zero row
    // Each leading coefficient is in a column to the right of the leading coefficient of the previous row
    // Rows with all zeroes are at the bottom of the matrix
    // Leading coefficients are all 1 and are the only non-zero entry in their column
    } else if (step === 1) {
        if (currentRowIndex >= rows.length && (currentColumnIndex + 1) >= rows[0].length) {
            console.log('Echelon form achieved', rows);
            return gaussianAlgorithm(rows, rows.length - 2, rows[0].length - 2, step + 1);
        }

        if (rows[currentRowIndex][currentColumnIndex] === 0) {
            const nextRow = currentRowIndex + 1;
            if (nextRow === rows.length) {
                return gaussianAlgorithm(rows, currentRowIndex, currentColumnIndex + 1, step);
            }

            // swap rows
            let swapped = false;
            for (let i = nextRow; i < rows.length; i++) {
                if (rows[i][currentColumnIndex] !== 0) {
                    [rows[x], rows[i]] = [rows[i], rows[x]];
                    swapped = true;
                    break;
                }
            }
            if (!swapped) {
                console.log('Cannot solve this system');
                return rows;
            }
        }

        const currentRowFirstElement = rows[currentRowIndex][currentColumnIndex];
        if (currentRowFirstElement !== 1 && currentRowFirstElement !== -1) {
            rows[currentRowIndex] = rows[currentRowIndex].map(value => value / currentRowFirstElement);
        }

        const currentRow = rows[currentRowIndex];
        console.log('Current row', currentRow);

        for (let i = currentRowIndex + 1; i < rows.length; i++) {
            const targetRow = rows[i];
            const factor = targetRow[currentColumnIndex] / currentRow[currentColumnIndex];
            console.log('Factor', factor);
            for (let j = currentColumnIndex; j < targetRow.length; j++) {
                targetRow[j] = targetRow[j] - factor * currentRow[j];
            }
            console.log('Target row after elimination', targetRow);
            rows[i] = targetRow;
        }

        return gaussianAlgorithm(rows, currentRowIndex = currentColumnIndex + 1, currentColumnIndex + 1, step);
    // Step 2 - Back substitution - making the leading coefficients to be 1 and eliminating the values above them
    // Everything above the diagonal is 0
    // Each leading coefficient is the only non-zero entry in its column
    // The leading coefficient in each nonzero row is 1
    } else if (step === 2) {
        // variable value is in the last column of the current row
        const variableValueColumnIndex = rows[currentRowIndex].length - 1;
        const eqRightSideValue = rows[currentRowIndex + 1][variableValueColumnIndex];
        // if the variable value is 0, just move to the next row and column
        if (eqRightSideValue === 0) {
            return gaussianAlgorithm(rows, currentRowIndex - 1, currentColumnIndex - 1, step);
        }
    
        // eliminate the identified value from both sides (from last column and from the current column)
        for (let i = currentRowIndex; i >= 0; i--) {
            const currentValue = rows[i][currentColumnIndex];
            const calculatedValue = eqRightSideValue * currentValue;
            rows[i][currentColumnIndex] = 0;
            rows[i][variableValueColumnIndex] -= calculatedValue;
        }

        if (currentColumnIndex === 1) {
            console.log('result', rows);
            return rows;
        }
        return gaussianAlgorithm(rows, currentRowIndex - 1, currentColumnIndex - 1, step);
    }
}

gaussianAlgorithm(extendedLinearEquationMatrix);

const createIdentityMatrix = (size) => {
    const identityMatrix = [];
    for (let i = 0; i < size; i++) {
        const row = new Array(size).fill(0);
        row[i] = 1;
        identityMatrix.push(row);
    }
    return identityMatrix;
};

const augmentMatrix = (matrix, identityMatrix) => {
    return matrix.map((row, rowIndex) => [...row, ...identityMatrix[rowIndex]]);
}

function gaussianAlgorithmForInverseMatrix(rows, currentRowIndex = 0, currentColumnIndex = 0, step = 0) {
    rows = JSON.parse(JSON.stringify(rows));
    // Step 0 - Preparation: if there is rows with all zeros, remove them
    if (step === 0) {
        if (rows.length !== rows[0].length) {
            throw new Error(`Inverse matrix isn't possible, it is not a square matrix`);
        }
        rows = augmentMatrix(rows, createIdentityMatrix(rows.length));
        console.log('Augmented matrix', rows);
        return gaussianAlgorithmForInverseMatrix(rows, currentRowIndex, currentColumnIndex, step + 1);
    // Step 1 - Echelon form - elimination the leading coefficients
    // Everything below the diagonal is 0
    // Leading coefficient is the first non-zero number from the left, in a non-zero row
    // Each leading coefficient is in a column to the right of the leading coefficient of the previous row
    // Rows with all zeroes are at the bottom of the matrix
    // Leading coefficients are all 1 and are the only non-zero entry in their column
    } else if (step === 1) {
        // const matrixRowSize = rows.length;
        if (currentRowIndex >= rows.length && (currentColumnIndex + 1) >= rows[0].length) {
            console.log('Echelon form achieved', rows);
            return gaussianAlgorithmForInverseMatrix(rows, rows.length - 2, rows.length - 2, step + 1);
        }

        if (rows[currentRowIndex][currentColumnIndex] === 0) {
            const nextRow = currentRowIndex + 1;
            if (nextRow === rows.length) {
                return gaussianAlgorithmForInverseMatrix(rows, currentRowIndex, currentColumnIndex + 1, step);
            }

            // swap rows
            let swapped = false;
            for (let i = nextRow; i < rows.length; i++) {
                if (rows[i][currentColumnIndex] !== 0) {
                    console.log('Swapping rows', currentRowIndex, i);
                    [rows[currentRowIndex], rows[i]] = [rows[i], rows[currentRowIndex]];
                    swapped = true;
                    break;
                }
            }
            if (!swapped) {
                console.log('Cannot solve this system');
                return rows;
            }
        }

        const currentRowFirstElement = rows[currentRowIndex][currentColumnIndex];
        if (currentRowFirstElement !== 1 && currentRowFirstElement !== -1) {
            rows[currentRowIndex] = rows[currentRowIndex].map(value => value / currentRowFirstElement);
        }

        const currentRow = rows[currentRowIndex];
        console.log('Current row', currentRow);

        for (let i = currentRowIndex + 1; i < rows.length; i++) {
            const targetRow = rows[i];
            const factor = targetRow[currentColumnIndex] / currentRow[currentColumnIndex];
            console.log('Factor', factor);
            for (let j = currentColumnIndex; j < targetRow.length; j++) {
                targetRow[j] = targetRow[j] - factor * currentRow[j];
            }
            console.log('Target row after elimination', targetRow);
            rows[i] = targetRow;
        }

        return gaussianAlgorithmForInverseMatrix(rows, currentRowIndex = currentColumnIndex + 1, currentColumnIndex + 1, step);
    // Step 2 - Back substitution - making the leading coefficients to be 1 and eliminating the values above them
    // Everything above the diagonal is 0
    // Each leading coefficient is the only non-zero entry in its column
    // The leading coefficient in each nonzero row is 1
    } else if (step === 2) {
        // variable value is in the last column of the current row
        const variableValueColumnIndex = rows[currentRowIndex].length - 1;
        const eqRightSideValue = rows[currentRowIndex + 1][variableValueColumnIndex];
        // if the variable value is 0, just move to the next row and column
        if (eqRightSideValue === 0) {
            return gaussianAlgorithmForInverseMatrix(rows, currentRowIndex - 1, currentColumnIndex - 1, step);
        }
    
        // eliminate the identified value from both sides (from last column and from the current column)
        for (let i = currentRowIndex; i >= 0; i--) {
            const currentValue = rows[i][currentColumnIndex];
            const calculatedValue = eqRightSideValue * currentValue;
            rows[i][currentColumnIndex] = 0;
            rows[i][variableValueColumnIndex] -= calculatedValue;
        }

        if (currentColumnIndex === 1) {
            console.log('result', rows);
            return rows;
        }
        return gaussianAlgorithmForInverseMatrix(rows, currentRowIndex - 1, currentColumnIndex - 1, step);
    }
}

gaussianAlgorithmForInverseMatrix(squareMatrix);