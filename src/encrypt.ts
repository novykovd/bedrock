import { randomBytes, scryptSync, createCipheriv, createDecipheriv } from 'crypto';

const ALG = 'aes-256-gcm';
const SALT_LEN = 16;
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_LEN = 32;

export async function encryptFile(data:Buffer, passphrase:string){

    const salt = randomBytes(SALT_LEN);
    const key  = scryptSync(passphrase, salt, KEY_LEN);
    const iv   = randomBytes(IV_LEN);
    const cipher = createCipheriv(ALG, key, iv);
    
    const enc = Buffer.concat([cipher.update(data), cipher.final()]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, enc]);
}

export async function decryptFile(encrypted:Buffer, passphrase:string){
    
    const salt = encrypted.subarray(0, SALT_LEN);
    const iv   = encrypted.subarray(SALT_LEN, SALT_LEN + IV_LEN);
    const tag  = encrypted.subarray(SALT_LEN + IV_LEN, SALT_LEN + IV_LEN + TAG_LEN);
    const data = encrypted.subarray(SALT_LEN + IV_LEN + TAG_LEN);

    const key = scryptSync(passphrase, salt, KEY_LEN);
    const decipher = createDecipheriv(ALG, key, iv).setAuthTag(tag);

    return Buffer.concat([decipher.update(data), decipher.final()]);
}