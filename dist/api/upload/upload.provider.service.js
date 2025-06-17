"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoSpacesServicerovider = exports.DoSpacesServiceLib = void 0;
const AWS = require("aws-sdk");
exports.DoSpacesServiceLib = 'lib:do-spaces-service';
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);
const S3 = new AWS.S3({
    endpoint: spacesEndpoint.href,
    credentials: new AWS.Credentials({
        accessKeyId: process.env.SPACES_ACCESS_KEY,
        secretAccessKey: process.env.SPACES_SECRET_KEY,
    }),
});
exports.DoSpacesServicerovider = {
    provide: exports.DoSpacesServiceLib,
    useValue: S3,
};
//# sourceMappingURL=upload.provider.service.js.map