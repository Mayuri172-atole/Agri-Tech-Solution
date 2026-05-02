const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

// Verify on startup
const transporter = createTransporter();
transporter.verify((error) => {
  if (error) {
    console.log('Email setup error: ' + error.message);
  } else {
    console.log('Email server ready - ' + process.env.EMAIL_USER);
  }
});

// Customer order confirmation
const sendOrderConfirmationEmail = async (order, userEmail, userName) => {
  if (!userEmail) return;
  const itemsHTML = (order.orderItems || []).map(item =>
    '<tr><td style="padding:8px;border-bottom:1px solid #eee">' + item.name + '</td>' +
    '<td style="padding:8px;border-bottom:1px solid #eee;text-align:center">' + item.qty + '</td>' +
    '<td style="padding:8px;border-bottom:1px solid #eee;text-align:right">Rs.' + item.price + '</td></tr>'
  ).join('');

  const mail = {
    from: '"AgriMart" <' + process.env.EMAIL_USER + '>',
    to: userEmail,
    subject: 'Order Confirmed! #' + order._id + ' - AgriMart',
    html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">' +
      '<div style="background:#2e7d32;padding:25px;text-align:center"><h1 style="color:#fff;margin:0">AgriMart</h1><p style="color:#c8e6c9;margin:5px 0 0">Kisan Ka Digital Bazaar</p></div>' +
      '<div style="padding:25px">' +
      '<h2 style="color:#2e7d32">Namaste ' + userName + '!</h2>' +
      '<p>Aapka order successfully place ho gaya hai.</p>' +
      '<div style="background:#f9fbe7;border-left:4px solid #8bc34a;padding:15px;border-radius:8px;margin:20px 0">' +
      '<p><strong>Order ID:</strong> #' + order._id + '</p>' +
      '<p><strong>Tracking ID:</strong> ' + order.trackingId + '</p>' +
      '<p><strong>Payment:</strong> ' + order.paymentMethod + '</p>' +
      '</div>' +
      '<table style="width:100%;border-collapse:collapse"><thead><tr style="background:#e8f5e9">' +
      '<th style="padding:10px;text-align:left">Product</th><th style="padding:10px;text-align:center">Qty</th><th style="padding:10px;text-align:right">Price</th>' +
      '</tr></thead><tbody>' + itemsHTML + '</tbody>' +
      '<tfoot><tr style="background:#e8f5e9"><td colspan="2" style="padding:10px;text-align:right;font-weight:bold;color:#2e7d32">Total:</td>' +
      '<td style="padding:10px;text-align:right;font-weight:bold;color:#2e7d32;font-size:18px">Rs.' + order.totalPrice + '</td></tr></tfoot></table>' +
      '<div style="background:#fff3e0;border-left:4px solid #ff9800;padding:15px;border-radius:8px;margin:20px 0">' +
      '<h4 style="color:#e65100;margin:0 0 8px">Delivery Address</h4>' +
      '<p style="margin:0">' + (order.shippingAddress ? order.shippingAddress.address + ', ' + order.shippingAddress.city + ' - ' + order.shippingAddress.pincode : 'N/A') + '</p>' +
      '</div></div>' +
      '<div style="background:#263238;padding:20px;text-align:center"><p style="color:#90a4ae;margin:0;font-size:13px">AgriMart - support@agrimart.com</p></div>' +
      '</div>',
  };
  try {
    await transporter.sendMail(mail);
    console.log('Customer email sent to ' + userEmail);
  } catch (err) {
    console.log('Customer email failed: ' + err.message);
  }
};

// Seller alert per item
const sendSellerNotificationEmail = async (order, sellerEmail, sellerName, item) => {
  if (!sellerEmail) return;
  const mail = {
    from: '"AgriMart" <' + process.env.EMAIL_USER + '>',
    to: sellerEmail,
    subject: 'Product Sold! Order #' + order._id + ' - AgriMart',
    html: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">' +
      '<div style="background:#1b5e20;padding:25px;text-align:center"><h1 style="color:#fff;margin:0">AgriMart - Seller Alert</h1></div>' +
      '<div style="padding:25px">' +
      '<h2 style="color:#2e7d32">Namaste ' + sellerName + '!</h2>' +
      '<div style="background:#e8f5e9;border-radius:8px;padding:15px;margin-bottom:20px;text-align:center">' +
      '<h3 style="color:#2e7d32;margin:0">Tera product bik gaya!</h3></div>' +
      '<div style="background:#f3f4f6;padding:15px;border-radius:8px;margin:15px 0">' +
      '<p><strong>Order ID:</strong> #' + order._id + '</p>' +
      '<p><strong>Payment:</strong> ' + order.paymentMethod + '</p>' +
      '<p><strong>Date:</strong> ' + new Date(order.createdAt).toLocaleString('en-IN') + '</p>' +
      '</div>' +
      '<div style="background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:15px;margin:15px 0">' +
      '<h3 style="color:#f57f17;margin:0 0 10px">Product Sold:</h3>' +
      '<p style="font-size:18px;font-weight:bold;margin:0">' + item.name + '</p>' +
      '<p>Quantity: <strong>' + item.qty + '</strong></p>' +
      '<p>Amount Earned: <strong style="color:#2e7d32;font-size:18px">Rs.' + (item.price * item.qty) + '</strong></p>' +
      '</div>' +
      '<div style="background:#e3f2fd;border-left:4px solid #1976d2;padding:15px;border-radius:8px">' +
      '<h4 style="color:#1565c0;margin:0 0 8px">Ship To:</h4>' +
      '<p style="margin:0">' + (order.shippingAddress ? order.shippingAddress.address + ', ' + order.shippingAddress.city + ' - ' + order.shippingAddress.pincode : 'N/A') + '</p>' +
      '<p>Phone: ' + (order.shippingAddress ? order.shippingAddress.phone : '') + '</p>' +
      '</div>' +
      '<p style="background:#fff9c4;padding:10px;border-radius:8px;color:#f57f17;font-weight:bold;text-align:center;margin-top:15px">Dispatch within 24 hours!</p>' +
      '</div></div>',
  };
  try {
    await transporter.sendMail(mail);
    console.log('Seller email sent to ' + sellerEmail);
  } catch (err) {
    console.log('Seller email failed: ' + err.message);
  }
};

module.exports = { sendOrderConfirmationEmail, sendSellerNotificationEmail };
