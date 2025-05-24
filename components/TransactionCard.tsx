// TransactionCard.jsx
import React from "react";

const TransactionCard = ({ transaction }) => {
  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold">{transaction.stockSymbol}</h2>
      <p>Type: {transaction.type}</p>
      <p>Quantity: {transaction.quantity}</p>
      <p>Price: {transaction.price}</p>
      <p>Total: {transaction.total}</p>
      <p>Date: {new Date(transaction.date).toLocaleString()}</p>
    </div>
  );
};

export default TransactionCard;
