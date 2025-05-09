export function generateSecureRandomString(length: number): string {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charsLength = chars.length;
    const array = new Uint8Array(length);
    crypto.getRandomValues(array); // Web Crypto API

    return Array.from(array, (byte) => chars[byte % charsLength]).join("");
}
