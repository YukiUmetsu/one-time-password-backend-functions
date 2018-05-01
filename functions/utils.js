class Utils {
    static formatPhoneNumber(phone){
        return String(phone).replace(/[^\d]/g, "");
    };
}
module.exports = Utils;