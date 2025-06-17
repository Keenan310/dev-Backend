"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVerifiedDigitalSignature = exports.decryptSensitiveData = exports.generateDigitalSignature = exports.encryptSensitiveData = void 0;
const crypto_1 = require("crypto");
const crypto = require("crypto");
const encryptSensitiveData = ({ sensitive_data, public_key, }) => {
    const buffer = Buffer.from(sensitive_data, "utf8");
    const encrypted = (0, crypto_1.publicEncrypt)({
        key: public_key,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    }, buffer);
    return encrypted.toString("base64");
};
exports.encryptSensitiveData = encryptSensitiveData;
const generateDigitalSignature = ({ sensitive_data, private_key, }) => {
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(sensitive_data);
    sign.end();
    const signature = sign.sign(private_key);
    return signature.toString("base64");
};
exports.generateDigitalSignature = generateDigitalSignature;
const decryptSensitiveData = ({ sensitive_data, private_key, }) => {
    const buffer = Buffer.from(sensitive_data, "base64");
    const decrypted = crypto.privateDecrypt({
        key: private_key,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    }, buffer);
    return decrypted.toString('utf8');
};
exports.decryptSensitiveData = decryptSensitiveData;
const isVerifiedDigitalSignature = ({ sensitive_data, signature, public_key, }) => {
    const buffer = Buffer.from(signature, "base64");
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(sensitive_data);
    verify.end();
    return verify.verify(public_key, buffer);
};
exports.isVerifiedDigitalSignature = isVerifiedDigitalSignature;
//# sourceMappingURL=nagad.utils.js.map