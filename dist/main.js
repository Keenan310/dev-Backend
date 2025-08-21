"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const compression = require("compression");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    app.use((0, helmet_1.default)());
    app.use(compression({ filter: () => { return true; }, threshold: 0 }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Porject OTA API (Keenan Travel)')
        .setDescription('Keenan Travel API description BY Project OTA')
        .setVersion('1.0.0')
        .addTag('flights-api-b2b')
        .addSecurityRequirements('token')
        .addBearerAuth({ type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
    }, 'access_token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('jakuma', app, document);
    await app.listen(8080, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map