/**
 * I listed 3 solution for time comparison
 */


/**
 * Direct solution
 * 
*/
export const getUserByName = (sortedUsers, name) => {
    const startAt = performance.now();
    const searchInterval = [0, sortedUsers.length - 1];
    let compare = 0;
    let foundUser = null;
    let step = 0;
    let prevIndex;

    while (!foundUser) {
        step++;
        const index = Math.round((searchInterval[1] + searchInterval[0]) / 2);
        compare = name.localeCompare(sortedUsers[index].name);
        if (compare === 1) {
            searchInterval[0] = index;
        } else if (compare === -1) {
            searchInterval[1] = index;
        } else if (!compare) {
            foundUser = sortedUsers[index];
        }

        if (searchInterval[0] === searchInterval[1] || prevIndex === index) {
            break;
        }
        prevIndex = index;
    }

    return {
        user: foundUser,
        step,
        duration: performance.now() - startAt
    };
};
// -------------------------------



/**
 * Generic Solution 
 * @param {T[]} items 
 * @param {T} targetItem 
 * @param {(T) => number | string} getItemProp 
 * 
 * @returns 
 */
export const genericBinarySearch = (items, targetValue, getItemProp) => {
    const searchInterval = [0, items.length - 1];
    let compareFn;
    let compare = 0;
    let foundUser = null;
    let prevIndex;

    switch (typeof targetValue) {
        case 'string':
            compareFn = (idx) => {
                const prop = getItemProp(items[idx]);
                return targetValue.localeCompare(prop);
            }
            break;
        case 'number':
            compareFn = (idx) => {
                const prop = getItemProp(items[idx]);
                return targetValue < prop ? -1 : (targetValue > targetValue ? 1 : 0);
            }
            break;
        default:
            throw new Error('prop type not implemented yet');
    }

    while (!foundUser) {
        const index = Math.round((searchInterval[1] + searchInterval[0]) / 2);
        compare = compareFn(index);
        if (compare === 1) {
            searchInterval[0] = index;
        } else if (compare === -1) {
            searchInterval[1] = index;
        } else if (!compare) {
            foundUser = items[index];
        }

        if (searchInterval[0] === searchInterval[1] || prevIndex === index) {
            break;
        }
        prevIndex = index;
    }

    return foundUser;
};

export const getUserByNameGenericBinarySearch = (sortedUsers, name) => {
    const startAt = performance.now();
    const foundUser = genericBinarySearch(
        sortedUsers,
        name,
        user => user.name
    );

    return {
        user: foundUser,
        duration: performance.now() - startAt
    };
};
// -------------------------------


/**
 * Generic Recursive Solution 
 * @param {T[]} items 
 * @param {T} targetItem 
 * @param {(T) => number | string} getItemProp 
 * 
 * @returns 
 */
export const genericRecursiveBinarySearch = (items, targetValue, getItemProp, data = null) => {
    let compareFn;
    let compare = 0;
    let foundUser = null;

    if (!data) {
        data = {
            step: 0,
            prevIndex: 0
        };
    }

    switch (typeof targetValue) {
        case 'string':
            compareFn = (idx) => {
                const prop = getItemProp(items[idx]);
                return targetValue.localeCompare(prop);
            }
            break;
        case 'number':
            compareFn = (idx) => {
                const prop = getItemProp(items[idx]);
                return targetValue < prop ? -1 : (targetValue > targetValue ? 1 : 0);
            }
            break;
        default:
            throw new Error('prop type not implemented yet');
    }

    data.step++;

    const index = Math.round((items.length - 1) / 2);
    compare = compareFn(index);

    if (data.prevIndex === index || (items.length === 1 && compare)) {
        return {
            user: null,
            step: data.step,
        };
    }
    data.prevIndex = index;
    if (compare === 1) {
        return genericRecursiveBinarySearch(items.slice(index + 1), targetValue, getItemProp, data);
    } else if (compare === -1) {
        return genericRecursiveBinarySearch(items.slice(0, index), targetValue, getItemProp, data);
    } else if (!compare) {
        return {
            user: items[index],
            step: data.step,
        };
    }
};

export const getUserByNameGenericRecursiveinarySearch = (sortedUsers, name) => {
    const startAt = performance.now();
    const foundData = genericRecursiveBinarySearch(
        sortedUsers,
        name,
        user => user.name
    );

    return {
        ...foundData,
        duration: performance.now() - startAt
    };
};

// -------------------------------





/**
 * Native JS findIndex solution
 */
export const getUserByNameSimpleSearch = (sortedUsers, name) => {
    const startAt = performance.now();
    const index = sortedUsers.findIndex(x => x.name === name)
    let foundUser = index >= 0 ? sortedUsers[index] : null;

    return {
        user: foundUser,
        step: index >= 0 ? index : sortedUsers.length,
        duration: performance.now() - startAt
    };
};

// ---------------------
