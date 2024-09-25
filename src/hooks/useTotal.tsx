import { useState } from "react";

export default function useTotalPrice<T extends { price: number }>() {
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // 새 데이터를 받아와 가격 합계를 업데이트하는 함수
  const updateTotalPrice = (newData: T[]) => {
    const newPricesTotal = newData.reduce(
      (acc: number, item: T) => acc + item.price,
      0
    );
    setTotalPrice((prevTotal) => prevTotal + newPricesTotal);
  };

  return { totalPrice, updateTotalPrice };
}
