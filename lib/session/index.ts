import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY!;

// Function to encrypt the value
const encryptValue = (value: string) => {
    const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
    return encryptedValue;
};

// Function to decrypt the value
const decryptValue = (encryptedValue: string) => {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
    const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedValue;
};

// Function to set the session cookie
export const setSessionCookie = (key: string, value: string, timeout: number) => {
    const SESSION_DURATION = timeout ? timeout : 5; // Duration in minutes
    const encryptedValue = encryptValue(value);
    Cookies.set(key, encryptedValue, { expires: SESSION_DURATION / (24 * 60), secure: true }); // Convert duration to days
    return true;
};

// Function to get the session cookie value
export const getSessionCookie = (key: string) => {
    const encryptedValue = Cookies.get(key);
    if (encryptedValue) {
        const decryptedValue = decryptValue(encryptedValue);
        return decryptedValue;
    }
    return null;
};

// Function to remove the session cookie
export const removeSessionCookie = (key: string) => {
    Cookies.remove(key);
};