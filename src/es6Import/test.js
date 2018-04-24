/**
 * demo test 
 * @type {number}
 */
//------ lib.js ------
export let counter = 3;
export function incCounter() {
    counter++;
}
//------ main1.js ------
import { counter, incCounter } from './lib';
// The imported value `counter` is live
console.log(counter); // 3
incCounter();
console.log(counter); // 4