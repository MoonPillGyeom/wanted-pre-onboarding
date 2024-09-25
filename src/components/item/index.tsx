import React from "react";
import "./index.css";

interface MockData {
  data: {
    productId: string;
    productName: string;
    price: number;
    boughtDate: string;
  };
}

export default function Item({ data }: MockData) {
  const { productName, price, boughtDate } = data;
  return (
    <div className="ItemBox">
      <p>productName : {productName}</p>
      <p>price : {price}</p>
      <p>boughtDate : {boughtDate}</p>
    </div>
  );
}
