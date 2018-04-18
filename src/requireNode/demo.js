
var s = 1
s++
var m = s
function addString(h) {
    m +=h
    console.log(m)
}
module.exports = {
    m: m,
    addString: addString
}