import { useEffect, useState, useRef } from "react";
import React from "react";
import { getMockData } from "./mock.ts";
import Item from "./components/item/index.tsx";
import useTotalPrice from "./hooks/useTotal.tsx";

interface MockData {
  productId: string;
  productName: string;
  price: number;
  boughtDate: string;
}

function App() {
  const [mockData, setMockData] = useState<MockData[]>([]);
  const [nextPage, setNextPage] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false); // 전체 데이터 호출 상태 여부
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태

  const { totalPrice, updateTotalPrice } = useTotalPrice<MockData>(); // 합계 계산식 hook

  const targetRef = useRef<HTMLDivElement | null>(null); // intersectionObserver로 감시할 요소

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data: any = await getMockData(nextPage);
      if (!data.isEnd) {
        setMockData((prevData) => [...prevData, ...data.datas]);
        updateTotalPrice(data.datas);
        setNextPage((prevPage) => prevPage + 1); // 다음 페이지로 이동
      } else {
        setIsEnd(data.isEnd); // 전체 데이터 호출 됐을시 true
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isEnd) {
          fetchData(); // target 요소가 보이면 fetchData 호출
        }
      },
      { threshold: 1.0 }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [nextPage, isEnd]);

  return (
    <>
      {mockData &&
        mockData.map((data: MockData, index: number) => (
          <Item key={index} data={data} />
        ))}
      {/* 로딩 UI */}
      {isLoading && <div>로딩 중...</div>}

      {/* 합계 : price  */}
      <div ref={targetRef}>합계 : {totalPrice}</div>

      {/* 모든 MockData 호출시 */}
      {isEnd && <div>모든 데이터를 불러왔습니다.</div>}
    </>
  );
}

export default App;
