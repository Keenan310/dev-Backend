"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoSpacesServicerovider = exports.DoSpacesServiceLib = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
exports.DoSpacesServiceLib = 'lib:do-spaces-service';
const spacesEndpoint = process.env.SPACES_ENDPOINT;
const spacesRegion = process.env.SPACES_REGION || 'us-east-1';
const S3 = new client_s3_1.S3Client({
    endpoint: spacesEndpoint,
    region: spacesRegion,
    credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY || '',
        secretAccessKey: process.env.SPACES_SECRET_KEY || '',
    },
});
exports.DoSpacesServicerovider = {
    provide: exports.DoSpacesServiceLib,
    useValue: S3,
};
//# sourceMappingURL=upload.provider.service.js.map