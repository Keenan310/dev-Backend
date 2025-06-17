import { publicEncrypt } from 'crypto';
import * as crypto from 'crypto';


export const encryptSensitiveData = ({
  sensitive_data,
  public_key,
}: {
  sensitive_data: string;
  public_key: string;
}) => {
  const buffer = Buffer.from(sensitive_data, "utf8");

  const encrypted = publicEncrypt(
    {
      key: public_key,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );

  return encrypted.toString("base64");
};

export const generateDigitalSignature = ({
  sensitive_data,
  private_key,
}: {
  sensitive_data: string;
  private_key: string;
}) => {
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(sensitive_data);
  sign.end();

  const signature = sign.sign(private_key);

  return signature.toString("base64");
};

export const decryptSensitiveData = ({
  sensitive_data,
  private_key,
}: {
  sensitive_data: string;
  private_key: string;
}) => {

  const buffer = Buffer.from(sensitive_data, "base64");

  const decrypted = crypto.privateDecrypt(
    {
      key: private_key,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );
  return decrypted.toString('utf8');
};

export const isVerifiedDigitalSignature = ({
  sensitive_data,
  signature,
  public_key,
}: {
  sensitive_data: string;
  signature: string;
  public_key: string;
}) => {

  const buffer = Buffer.from(signature, "base64");

  const verify = crypto.createVerify("RSA-SHA256");
  verify.update(sensitive_data);
  verify.end();

  return verify.verify(public_key, buffer);
};
