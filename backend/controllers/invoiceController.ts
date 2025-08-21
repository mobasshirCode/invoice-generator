import { Request, Response } from "express";
import puppeteer from "puppeteer";
import Product from "../models/Product";
import fs from "fs";
import path from "path";
const logoPath = path.join(__dirname, "./logo.svg");
const logo = `data:image/svg+xml;base64,${fs
  .readFileSync(logoPath)
  .toString("base64")}`;

// user (from authMiddleware)
interface AuthRequest extends Request {
  user?: { _id: string; email: string; name?: string };
}

export const generateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // products for this user 
    const products = await Product.find({ user: req.user._id });

    if (!products.length) {
      return res.status(404).json({ message: "No products found for invoice" });
    }

    const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    const date = new Date().toLocaleDateString("en-GB");
    const personName = req.user.name || req.user.email.split("@")[0];

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333; }
            .header { display: flex; justify-content: space-between; padding: 20px; border-bottom: 2px solid #000; }
            .logo { font-size: 20px; font-weight: bold; }
            .invoice-title { text-align: right; }
            .invoice-title h2 { margin: 0; font-size: 18px; font-weight: bold; }
            .invoice-title p { margin: 0; font-size: 12px; color: #666; }

            .info-bar {
              background: radial-gradient(#0F0F0F 5%, #191919, #303661);
              color: white;
              border-radius: 10px;
              margin: 30px;
              padding: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .info-bar .name { font-size: 22px; font-weight: bold; color: #CCF575; }
            .info-bar .email { font-size: 16px; background: white; color: #000; padding: 5px 20px; border-radius: 28px; }
            .info-bar .date { font-size: 16px; color: #DDDDDD; }
            .info-bar .nam { font-size: 16px; color: #CCCCCC }
            .info-bar .right-info {
              display: flex;
              flex-direction: column;
              align-items: flex-end; 
            }

            table { width: 95%; border-collapse: collapse; margin: 20px auto; border-radius: 10px; overflow: hidden; }
            thead th {
              background-color: #1a1f3b;
              color: white;
              padding: 12px;
              text-align: left;
            }
    
            tbody tr td:first-child ,thead tr th:first-child  {
              border-top-left-radius: 20px;
              border-bottom-left-radius: 20px;
            }
            tbody tr td:last-child ,thead tr th:last-child  {
              border-top-right-radius: 20px;
              border-bottom-right-radius: 20px;
            }
            tbody td { padding: 14px; color: #333333;}
            
            tr:nth-child(even) { background: #fafafa; }
            tr:nth-child(odd) { background: #fff; }

            .totals-box {
              border: 1px solid #ccc;
              border-radius: 10px;
              padding: 15px;
              width: 250px;
              float: right;
              margin: 20px;
            }
            .totals-box .ptotal { margin: 5px 0; font-size: 16px; font-weight: normal; color: #999; display: flex; justify-content: space-between; padding: 5px; }
            .totals-box .gst { margin: 5px 0; font-size: 14px; font-weight: normal; color: #999; display: flex; justify-content: space-between; padding: 5px; }
            .totals-box .total { margin: 5px 0; font-size: 18px; font-weight: bold; display: flex; justify-content: space-between; padding: 5px; }
            .totals-box .ltotal { color: #000000; }
            .totals-box .rtotal { color: #175EE2; }

            .date { margin: 20px; font-size: 12px; clear: both; }

            .footer { 
              text-align: center; 
              background: #272833; 
              color: white; 
              padding: 15px; 
              border-radius: 20px; 
              margin: 80px; 
              font-size: 12px; 
              clear: both;
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            <div class="logo"><img src=${logo} alt=""></div>
            <div class="invoice-title">
              <h2>INVOICE GENERATOR</h2>
              <p>Sample Output should be this</p>
            </div>
          </div>

          <!-- Info Bar -->
          <div class="info-bar">
            <div>
              <p class="nam">Name</p>
              <p class="name">${personName}</p>
            </div>
            <div class="right-info">
              <p class="date">Date: ${date}</p>
              <p class="email">${req.user.email}</p>
            </div>
          </div>

          <!-- Products Table -->
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (p) => `
                  <tr>
                    <td>${p.name}</td>
                    <td>${p.quantity}</td>
                    <td>${p.price}</td>
                    <td>INR ${p.price * p.quantity}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>

          <!-- Totals Box -->
          <div class="totals-box">
            <p class="ptotal"><span>Total Charges</span> <span>₹${subtotal.toFixed(
              2
            )}</span></p>
            <p class="gst"><span>GST (18%)</span> <span>₹${gst.toFixed(
              2
            )}</span></p>
            <h3 class="total"><span class="ltotal">Total Amount</span> <span class="rtotal">₹ ${total.toFixed(
              2
            )}</span></h3>
          </div>

          <!-- Date -->
          <div class="date">Date: ${date}</div>

          <!-- Footer -->
          <div class="footer">
            We are pleased to provide any further information you may require and look forward to assisting with your next order. 
            Rest assured, it will receive our prompt and dedicated attention.
          </div>
        </body>
      </html>
    `;

    // Puppeteer PDF generation
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({ message: "Error generating invoice", error });
  }
};
