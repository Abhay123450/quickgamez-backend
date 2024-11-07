export function generateOtp(length: number): number {
    let otp: number = 0;
    for (let i = 0; i < length; i++) {
        const num = Math.floor(Math.random() * 10);
        otp = otp * 10 + num;
    }
    return otp;
}
