import React, { useState } from "react";
import "./style.css";

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    if (cardNumber && expiryDate && cvv && name) {
      alert("Payment Successful!");
    } else {
      alert("Please fill in all details.");
    }
  };

  return (
    <div className="pay-container">
      <h2 className="pay-h">Complete Your Payment</h2>

      {/* Payment Logos */}
      <div className="pay-logos">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Pay" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_" alt="Google Pay" />
      </div>

      {/* Payment Form */}
      <form className="pay-form" onSubmit={handlePayment}>
        <label className="pay-label">Cardholder Name</label>
        <input
          type="text"
          className="pay-input"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Card Number</label>
        <input
          type="text"
          className="pay-input"
          placeholder="1234 5678 9101 1121"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
          maxLength="19"
        />

        <div className="pay-form-row">
          <div>
            <label>Expiry Date</label>
            <input
              type="text"
              className="pay-input"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>CVV</label>
            <input
              type="text"
              className="pay-input"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              maxLength="3"
            />
          </div>
        </div>

        <button type="submit" className="pay-button" onClick={() => window.location.href = "/mybook"}>Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentPage;
