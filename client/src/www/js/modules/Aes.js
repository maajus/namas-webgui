const iv = new Buffer( [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const crypto = require('crypto');



export function decodeAes(data, key){

    const decipher = crypto.createDecipheriv('aes256', key, iv);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    //console.log("decrypted :"+decrypted);
    return decrypted;
}


export function encodeAes(data ,key){

    const cipher = crypto.createCipheriv('aes256', key, iv);
    let encrypted = cipher.update(data,'utf8','base64');
    encrypted += cipher.final('base64');
    //console.log("encrypted: "+encrypted);
    return encrypted;

}
