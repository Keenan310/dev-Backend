import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
  return `
  <h1>Welcome to Keenan Travel & Tourism</h1>
  <h3> Call +92 330 800 6006  Whatsapp +971 503913990</h3>
  <p><strong>Main Website:</strong><br>
  <a href="https://keenantravel.com" target="_blank">keenantravel.com</a></p>

  <p><strong>Agent Dashboard:</strong><br>
  <a href="https://agent.keenantravel.com" target="_blank">agent.keenantravel.com</a></p>

  <p><strong>Admin Dashboard:</strong><br>
  <a href="https://admin.keenantravel.com" target="_blank">admin.keenantravel.com</a></p>

  <p><strong>B2B API Documentation:</strong><br>
  <a href="https://apib2b.keenantravel.com/jakuma" target="_blank">API Documentation</a></p>

  <hr>

  <p><strong>Thank you for choosing Keenan Travel & Tourism.</strong></p>
  `;
}
}