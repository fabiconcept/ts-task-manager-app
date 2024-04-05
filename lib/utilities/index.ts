import { CompanyTag } from "../Types/dashboard";

export const clientId = process.env.NEXT_PUBLIC_SIRV_ClIENT_ID!
export const clientSecret = process.env.NEXT_PUBLIC_SIRV_ClIENT_SECRET!


export function validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

export function isValidURL(text: string) {
    // Regular expression pattern to match a valid URL format
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

    return urlPattern.test(text);
}


function validateName (name: string): boolean {
    const test = /[^a-zA-Z\s]/.test(name);
    return test;
}

export function validateText(name: string): boolean {
    const test = /[^a-zA-Z\s]/.test(name);
    return !test; // Returning the opposite of the test result since we're validating for allowed characters
}

export const generateFileName = (file: File): string =>{
    const filename = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${new Date().toISOString().slice(11, 16).replace(/:/g, '')}${
        String.fromCharCode(97 + Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 0 : -32))
      }.${file.type.split('/').pop()}`;

      return filename
}


export function validateFullName(name: string): [boolean, string] {
    let errorMessage = "";
    let condition = true;
    const splitName = name.split(" ");

    if (splitName.length < 2) {
        errorMessage = "Enter Fullname.";
        condition = false;
    }
    else if (splitName.length > 2) {
        errorMessage = "Only first and last name";
        condition = false;
    }
    else if (splitName[0].length < 3) {
        errorMessage = "(First name) - too short";
        condition = false;
    }
    else if (splitName[1].length < 3) {
        errorMessage = "(Last name) - too short";
        condition = false;
    }
    else if (validateName(splitName[0])) {
        errorMessage = "(First name) - Avoid numbers and special characters.";
        condition = false;
    }
    else if (validateName(splitName[1])) {
        errorMessage = "(Last name) - Avoid numbers and special characters.";
        condition = false;
    }
    else if (validateName(name)) {
        errorMessage = "Stick to common letters in your name.";
        condition = false;
    }
    else if (name.toLowerCase() === "john doe") {
        errorMessage = "Enter your real name, not 'John Doe.";
        condition = false;
    }


    return [condition, errorMessage];
}

export function validatePassword(password: string): [boolean, string] {
    const lengthRegex = /.{8,}/; // At least 8 characters long
    const uppercaseRegex = /[A-Z]/; // Contains at least one uppercase letter
    const lowercaseRegex = /[a-z]/; // Contains at least one lowercase letter
    const numberRegex = /\d/; // Contains at least one number
    const specialCharRegex = /[^A-Za-z0-9]/; // Contains at least one special character

    let errorMessage = '';
    let condition = true;

    if (!lengthRegex.test(password)) {
        errorMessage = 'Password: at least 8 characters. ';
        condition = false;
    } else if (!uppercaseRegex.test(password)) {
        errorMessage = 'Include 1 uppercase letter. ';
        condition = false;
    } else if (!lowercaseRegex.test(password)) {
        errorMessage = 'Include 1 lowercase letter. ';
        condition = false;
    } else if (!numberRegex.test(password)) {
        errorMessage = 'Include 1 number. ';
        condition = false;
    } else if (!specialCharRegex.test(password)) {
        errorMessage = 'Include 1 special character. ';
        condition = false;
    }    

    return [condition, errorMessage];
}

export function generateUniqueId(): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(25).substring(2, 15);
    return `${randomString}${timestamp}`;
}

export function realEscapeString(str: string) {
    // List of characters to escape
    const escapeChars: Record<string, string> = {
        '\x00': '\\0',
        '\x08': '\\b',
        '\x09': '\\t',
        '\x1a': '\\Z',
        '\n': '\\n',
        '\r': '\\r',
        '\"': '\\"',
        '\'': '\\\'',
        '\\': '\\\\',
    };

    // Replace special characters with their escaped counterparts
    return str.replace(/[\x00\x08\x09\x1a\n\r"\'\\]/g, (char) => escapeChars[char]);
}

export function unescapeString(str: string): string {
    // List of escape sequences and their corresponding characters
    const unescapeChars: Record<string, string> = {
        '\\0': '\x00',
        '\\b': '\x08',
        '\\t': '\x09',
        '\\Z': '\x1a',
        '\\n': '\n',
        '\\r': '\r',
        '\\"': '\"',
        '\\\'': '\'',
        '\\\\': '\\',
    };

    // Replace escape sequences with their corresponding characters
    return str.replace(/\\(0|b|t|Z|n|r|"|'|\\)/g, (match, p1) => unescapeChars[match]);
}


export function sortByMatchingId(tags: CompanyTag[], targetId: string): CompanyTag[] {
    const arr = [...tags];
    const matchedIndex = arr.findIndex(tag => tag.id === targetId);
    
    if (matchedIndex !== -1 && matchedIndex !== 0) {
        const matchedTag = arr.splice(matchedIndex, 1)[0];
        arr.unshift(matchedTag);
    }

    return arr;
}

export function getTomorrowDateFormatted(): string {
    type DateTimeFormatOptions = {
        localeMatcher?: 'best fit' | 'lookup';
        weekday?: 'long' | 'short' | 'narrow';
        era?: 'long' | 'short' | 'narrow';
        year?: 'numeric' | '2-digit';
        month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
        day?: 'numeric' | '2-digit';
        hour?: 'numeric' | '2-digit';
        minute?: 'numeric' | '2-digit';
        second?: 'numeric' | '2-digit';
        timeZoneName?: 'long' | 'short';
        formatMatcher?: 'best fit' | 'basic';
        hour12?: boolean;
        timeZone?: string;
    };
    
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);

    const options: DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    return new Intl.DateTimeFormat('en-GB', options).format(tomorrowDate);
}

interface TokenResponse {
    token: string;
    expiresIn: number;
    scope: string[];
}

export const fetchToken = async (): Promise<string> => {
    try {
        const response = await fetch('https://api.sirv.com/v2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId, clientSecret }),
        });

        if (!response.ok) {
            throw new Error(`This happened: ${response.statusText}`);
        }

        const data: TokenResponse = await response.json();
        const token = data.token;
        return token;
    } catch (error) {
        throw error;
    }
};