class Matrix {
    constructor(rawMatrix) {
        if (typeof rawMatrix === 'string') {
            this.rows = rawMatrix.trim().split('\n').filter(Boolean).map(columns => columns.split(' ').filter(Boolean).map(x => Number(x)));
        } else if (typeof rawMatrix === 'object' && Array.isArray(rawMatrix)) {
            this.rows = rawMatrix;      
        }
        
        this.getColumns();
    }
  
    getColumns() {
        this.columns = new Array(this.rows[0].length).fill(0).map((_, index) => this.rows.map(row => row[index]));    
    }

    addMatrix(secondMatrix) {
        if (typeof secondMatrix === 'string') {
            secondMatrix = new Matrix(secondMatrix);
        }
        
        // current and new matrix have the rows/columns size    
        if (!this.canAddMatrix(secondMatrix)) {
            throw new Error(`Matrix dimension missmatch: ${this.rows.length}x${this.columns.length} vs ${secondMatrix.rows.length}x${secondMatrix.columns.length}`);
        }
        
        this.rows.forEach((row, i) => row.forEach((_, j) => {
            this.rows[i][j] += secondMatrix.rows[i][j];
        }));
        return this;
    }

    multiplyByScalar(scalar) {
        this.rows.forEach((row, i) => row.forEach((_, j) => {
            this.rows[i][j] *= scalar;
        }));
        return this;
    }
  
    multiplyByMatrix(secondMatrix) {
        if (typeof secondMatrix === 'string') {
            secondMatrix = new Matrix(secondMatrix);
        }
        
        if (!this.canMultiplyByMatrix(secondMatrix)) {
            throw new Error(`Matrix A (${this.rows.length}x${this.columns.length}) row count not match with B (${secondMatrix.rows.length}x${secondMatrix.columns.length}) column count (${this.columns.length} != ${secondMatrix.rows.length})`);
        }
        
        // it will have this.rows.length x secondMatrix.columns.length
        const newMatrixArray = this.createZeroMatrix(this.rows.length, secondMatrix.columns.length);
        
        // lets do the multiplication and insert the value into the new Matrix
        // probably it will have new dimension if the 2 matrix have different size
        for (let i = 0; i < this.rows.length; i++) {
            for (let j = 0; j < secondMatrix.columns.length; j++) {
                const currentRow = this.rows[i];
                const currentColumn = secondMatrix.columns[j];
                newMatrixArray[i][j] = currentRow.reduce((total, current, index) => total + currentRow[index] * currentColumn[index], 0);
            }
        }

        // assign the result of the new matrix into the current one
        this.rows = newMatrixArray;
        this.getColumns();
        return this;
    }
  
    createZeroMatrix(rowsCount, columnsCount) {
        return new Array(rowsCount).fill(0).map(_ => new Array(columnsCount).fill(0));
    }
  
    canAddMatrix(secondMatrix) {
        return this.rows.length === secondMatrix.rows.length &&
            this.columns.length === secondMatrix.columns.length;
    }
  
    canMultiplyByMatrix(secondMatrix) {
        return this.columns.length === secondMatrix.rows.length;
    }

    canInvert() {
        if (this.rows.length === 1 && this.columns.length === 1 && this.rows[0][0] !== 0) {
            return true;
        }

        if (this.rows.length === 2 && this.columns.length === 2) {
            const determinant = this.rows[0][0] * this.rows[1][1] - this.rows[0][1] * this.rows[1][0];
            return determinant !== 0;
        }

        if (this.isDiagonal()) {
            return this.rows.every((row, i) => row[i] !== 0);
        }

        return false;
    }

    isDiagonal() {
        if (this.rows.length !== this.columns.length) {
            return false;
        }
        for (let i = 0; i < this.rows.length; i++) {
            for (let j = 0; j < this.columns.length; j++) {
                if (i !== j && this.rows[i][j] !== 0) {
                    return false;
                }
            }
        }
        return true;
    }

    invert() {
        if (!this.canInvert()) {
            throw new Error('Matrix cannot be inverted');
        }
        if (this.rows.length === 1 && this.columns.length === 1) {
            this.rows[0][0] = 1 / this.rows[0][0];
            return this;
        }

        if (this.rows.length === 2 && this.columns.length === 2) {
            const determinant = this.rows[0][0] * this.rows[1][1] - this.rows[0][1] * this.rows[1][0];
            const newMatrix = [
                [this.rows[1][1] / determinant, -this.rows[0][1] / determinant],
                [-this.rows[1][0] / determinant, this.rows[0][0] / determinant]
            ];
            this.rows = newMatrix;
            this.getColumns();
            return this;
        }

        if (this.isDiagonal()) {
            this.rows.forEach((row, i) => {
                row.forEach((_, j) => {
                    if (i === j) {
                        this.rows[i][j] = 1 / this.rows[i][j];
                    }
                });
            });
            return this;
        }
        throw new Error('Matrix inversion not implemented for this size/type');
    }
  
    clone() {
        return new Matrix(this.rows.map(row => [...row]));
    }

    toString() {
        const maxNumber = Math.max(...this.rows.flat());
        const requiredCharacter = maxNumber.toString().length;
        return '\n' + this.rows.map((row) => '|' + row.map(n => n.toString().padStart(requiredCharacter + 1, ' ')).join(' ') + ' |').join('\n') + '\n';
     }
}

const A = `
1 2
3 4
5 6
`;

const matrix = new Matrix(A);
matrix.multiplyByMatrix(
`
    7 8 9 10
    11 12 13 14
`
)
  .addMatrix(
`
    1 2 3 4
    2 2 2 2
    3 4 4 4
`
);

console.log(matrix.toString());