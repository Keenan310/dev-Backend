export declare const encryptSensitiveData: ({ sensitive_data, public_key, }: {
    sensitive_data: string;
    public_key: string;
}) => string;
export declare const generateDigitalSignature: ({ sensitive_data, private_key, }: {
    sensitive_data: string;
    private_key: string;
}) => string;
export declare const decryptSensitiveData: ({ sensitive_data, private_key, }: {
    sensitive_data: string;
    private_key: string;
}) => string;
export declare const isVerifiedDigitalSignature: ({ sensitive_data, signature, public_key, }: {
    sensitive_data: string;
    signature: string;
    public_key: string;
}) => boolean;
