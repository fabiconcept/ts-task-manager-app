export function validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validateName (name: string): boolean {
    const test = /[^a-zA-Z\s]/.test(name);
    return test;
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