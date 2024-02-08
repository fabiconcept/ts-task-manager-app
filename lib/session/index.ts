import CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';

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

// Function to set the session data in localStorage
const setSessionData = (key: string, value: string) => {
    localStorage.setItem(key, encryptValue(value));
    return true;
};

// Function to get the session data from localStorage
export const getSessionData = (key: string) => {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
        return decryptValue(encryptedValue);
    }
    return null;
};

// Function to remove the session data from localStorage
export const removeSessionData = (key: string) => {
    localStorage.removeItem(key);
};

export const performLogin = (value: string, toastText?: string) => {
    toast.success(toastText ?? "Welcome back!");
    setSessionData("taskerId", `${value}`);
    return;
}