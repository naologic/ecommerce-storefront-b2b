import { AES, enc } from 'crypto-js';
/**
 * Encrypt a string using AES
 */
export function encryptAES(str: string, pass: string): string {
    return AES.encrypt(str, pass).toString();
}

/**
 * Decrypt a string using AES
 */
export function decryptAES(encryptedStr: string, pass: string): string {
    const as = AES.decrypt(encryptedStr, pass);
    return as.toString(enc.Utf8);
}
