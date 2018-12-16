//This part was made in browser console
let somethingEncoded = [ 104, 116, 116, 112, 115, 58, 47, 47, 101, 110, 103, 105, 110, 101, 101, 114, 105, 110, 103, 45, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 46, 98, 114, 105, 116, 101, 99, 111, 114, 101, 46, 99, 111, 109, 47, 113, 117, 105, 122, 47, 115, 97, 97, 115, 100, 97, 115, 100, 108, 102, 108, 102, 108, 115, ]
console.log(somethingEncoded.map(it => String.fromCharCode(it)).join("")) //eslint-disable-line
//The "too long string" could be seen in debugger
//The rest was just to fix some mistakes in code
const fernet = require("fernet")
const secret = new fernet.Secret("TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM=")
let message = "gAAAAABcERgtgzw92fhHMY7VFbuzYpVKUeOIH3Met4SxIE0cisdBMcSIO20ajxiufPhkmBWbVnUFN9ITw70SGCTy3GMF73xYwtfdEaFjpm4MvY2T7YhLcfSte0BhK4yo8YwynQ3IQxLeIBZRhz8mBQJZZ2PM4TyK7WPPE8culkO688oye6YVfpJqcYAOMhUfanVuk7VFSsAn"
let token = new fernet.Token({ secret, token: message, ttl:0, })
console.log(token.decode()) //eslint-disable-line
