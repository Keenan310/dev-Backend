import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Keenan Travel & Tourism</title>
      <style>
        body {
          margin: 0;
          font-family: 'Segoe UI', Arial, sans-serif;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: #fff;
        }

        .card {
          background: #ffffff;
          color: #333;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
          text-align: center;
          width: 400px;
        }

        h1 {
          margin-bottom: 10px;
          color: #0f2027;
        }

        h3 {
          margin-top: 0;
          font-weight: normal;
          color: #555;
        }

        .btn {
          display: block;
          margin: 12px 0;
          padding: 12px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: 0.3s ease;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-success {
          background-color: #28a745;
          color: white;
        }

        .btn-dark {
          background-color: #343a40;
          color: white;
        }

        .btn-warning {
          background-color: #ffc107;
          color: black;
        }

        .btn:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        .footer {
          margin-top: 20px;
          font-size: 14px;
          color: #777;
        }
      </style>
    </head>

    <body>
      <div class="card">
        <h1>Welcome to Keenan Travel & Tourism</h1>
        <h3>📞 +92 330 800 6006 | 📱 WhatsApp: +971 503913990</h3>

        <a href="https://keenantravel.com" target="_blank" class="btn btn-primary">
          🌐 Main Website
        </a>

        <a href="https://agent.keenantravel.com" target="_blank" class="btn btn-success">
          👨‍💼 Agent Dashboard
        </a>

        <a href="https://admin.keenantravel.com" target="_blank" class="btn btn-dark">
          🛠 Admin Dashboard
        </a>

        <a href="https://apib2b.keenantravel.com/jakuma" target="_blank" class="btn btn-warning">
          📘 B2B API Documentation
        </a>

        <div class="footer">
          Thank you for choosing Keenan Travel & Tourism.
        </div>
      </div>
    </body>
    </html>
    `;
  }
}
