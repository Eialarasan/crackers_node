import crypto from 'crypto'

export const encryptPass = (password) => {
    return crypto.createHash("sha256").update(password, "utf8").digest("hex");
}

export const isValidPhoneNumber=(phoneNumber)=> {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
}

export const isValidEmail=(email)=> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const isValidateUserMaxLength=(inputString)=> {
    return inputString.length <= 20;
}

export const isValidUsername=(username)=> {
    return username.length >= 3;
}

export const isValidPassword = (password) => {
    return password.length >= 3;
}
export const isValidPasswordMaxLength = (password) => {
    return password.length <= 20;
}