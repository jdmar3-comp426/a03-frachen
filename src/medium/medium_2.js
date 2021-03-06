import mpg_data from "./data/mpg_data.js";
import {
    getStatistics
} from "./medium_1.js";

/*
This section can be done by using the array prototype functions.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
see under the methods section
*/


/**
 * This object contains data that has to do with every car in the `mpg_data` object.
 *
 *
 * @param {allCarStats.avgMpg} Average miles per gallon on the highway and in the city. keys `city` and `highway`
 *
 * @param {allCarStats.allYearStats} The result of calling `getStatistics` from medium_1.js on
 * the years the cars were made.
 *
 * @param {allCarStats.ratioHybrids} ratio of cars that are hybrids
 */
export const allCarStats = {
    avgMpg: {
        city: mpg_data.reduce((sum, next) =>
            sum + next.city_mpg, 0) / mpg_data.length,
        highway: mpg_data.reduce((sum, next) =>
            sum + next.highway_mpg, 0) / mpg_data.length
    },
    allYearStats: getStatistics(mpg_data.map(element => element.year)),
    ratioHybrids: mpg_data.filter(element => element.hybrid).length / mpg_data.length,
};


/**
 * HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @param {moreStats.makerHybrids} Array of objects where keys are the `make` of the car and
 * a list of `hybrids` available (their `id` string). Don't show car makes with 0 hybrids. Sort by the number of hybrids
 * in descending order.
 *
 *[{
 *     "make": "Buick",
 *     "hybrids": [
 *       "2012 Buick Lacrosse Convenience Group",
 *       "2012 Buick Lacrosse Leather Group",
 *       "2012 Buick Lacrosse Premium I Group",
 *       "2012 Buick Lacrosse"
 *     ]
 *   },
 *{
 *     "make": "BMW",
 *     "hybrids": [
 *       "2011 BMW ActiveHybrid 750i Sedan",
 *       "2011 BMW ActiveHybrid 750Li Sedan"
 *     ]
 *}]
 *
 *
 *
 *
 * @param {moreStats.avgMpgByYearAndHybrid} Object where keys are years and each year
 * an object with keys for `hybrid` and `notHybrid`. The hybrid and notHybrid
 * should be an object with keys for `highway` and `city` average mpg.
 *
 * Only years in the data should be keys.
 *
 * {
 *     2020: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *     2021: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *
 * }
 */
export const moreStats = {
    makerHybrids: calculateMakerHyrbrids(mpg_data),
    avgMpgByYearAndHybrid: calculateAvgMpgByYearAndHybrid(mpg_data)
};

export function calculateMakerHyrbrids(array) {
    array = array.filter(element => element.hybrid === true).sort(function (a, b) {
        var nameA = a.make.toUpperCase();
        var nameB = b.make.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        return 0;
    });

    let arr = [];
    let j = -1;
    for (let i = 0; i < array.length; i++) {
        if (!arr.some(element => element.make === array[i].make)) {
            arr.push({
                make: array[i].make,
                hybrids: []
            })
            j++;
            arr[j].hybrids.push(array[i].id);
        } else {
            arr[j].hybrids.push(array[i].id);
        }
    }

    arr.sort(function (a, b) {
        return a.hybrids.length - b.hybrids.length;
    });

    return arr;
}

function calculateAvgMpgByYearAndHybrid(array) {
    array = array.sort(function (a, b) {
        return a.year - b.year;
    });

    let obj = new Object();
    let years = [];
    let j = -1;
    for (let i = 0; i < array.length; i++) {
        if (!years.includes(array[i].year)) {
            years.push(array[i].year);
        }
    }

    for (let i = 0; i < years.length; i++) {
        let hybridArr = array.filter(element => element.hybrid && element.year === years[i]);
        let notHybridArr = array.filter(element => !element.hybrid && element.year === years[i]);
        obj[years[i]] = new Object({
            hybrid: {
                city: hybridArr.reduce((sum, next) =>
                    sum + next.city_mpg, 0) / hybridArr.length,
                highway: hybridArr.reduce((sum, next) =>
                    sum + next.highway_mpg, 0) / hybridArr.length
            },
            notHybrid: {
                city: notHybridArr.reduce((sum, next) =>
                    sum + next.city_mpg, 0) / notHybridArr.length,
                highway: notHybridArr.reduce((sum, next) =>
                    sum + next.highway_mpg, 0) / notHybridArr.length
            }
        });
    }
    return obj;
}