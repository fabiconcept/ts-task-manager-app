import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY!;

// Function to encrypt the value
export const encryptValue = (value: string) => {
    const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
    return encryptedValue;
};

// Function to decrypt the value
export const decryptValue = (encryptedValue: string) => {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
    const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedValue;
};

// Function to set the session cookie
export const setSessionData = (key: string, value: string, timeout?: number) => {
    const SESSION_DURATION = timeout ? timeout : 1; // Duration in minutes
    const encryptedValue = encryptValue(value);
    Cookies.set(key, encryptedValue, { expires: (SESSION_DURATION*60) / (24), secure: true }); // Convert duration to days
    return true;
};

// Function to get the session cookie value
export const getSessionData = (key: string) => {
    const encryptedValue = Cookies.get(key);
    if (encryptedValue) {
        const decryptedValue = decryptValue(encryptedValue);
        return decryptedValue;
    }
    return null;
};

// Function to remove the session cookie
export const removeSessionData = (key: string) => {
    Cookies.remove(key);
};

export const performLogin = (value: string, toastText?: string, expTime?: number,) => {
    toast.success(toastText ?? "Welcome back!");
    setSessionData("taskerId", `${value}`, expTime);
    return;
}