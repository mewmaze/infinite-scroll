import React, { useState, useEffect, useRef } from 'react';
import { getMockData } from './data/mockData';
import './App.css';

interface MockData {
  productId: string;
  productName: string;
  price: number;
  boughtDate: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<MockData[]>([]);
  const [isEnd, setIsEnd] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true); // 처음 로딩 제어 변수

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd && !loading) {
        setPageNum((prev) => prev + 1);
      }
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loading, isEnd]);

  useEffect(() => {
    const fetchData = async () => {
      if(firstLoad.current) {
        firstLoad.current = false;
      }else{
      setLoading(true);
      const result = await getMockData(pageNum); // getMockData에서 10개씩 불러옴
      setData((prevData) => [...prevData, ...result.datas]);
      setIsEnd(result.isEnd);
      setLoading(false);
      }
    };

    fetchData();
  }, [pageNum]);

  const productNum = () => {
    return data.length;
  };

  const productPrice = () => {
    return data.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="App">
      <h1>Infinite Scroll Example</h1>
      <div className="productInfo">
        <div>상품 개수 : {productNum()}개</div>
        <div>상품 가격 합 : {productPrice()}</div>
      </div>
      {data.map((item) => (
        <div key={item.productId} className="ProductItem">
          <div className='productName'>{item.productName}</div>
          <div className='ProductItem-bottom'>
            <div className='boughtDate'>{item.boughtDate.split("GMT")[0]}</div>
            <div className='productPrice'>{item.price}</div>
          </div>
        </div>
      ))}
      {loading && <div className="spinner"></div>}
      <div ref={loadingRef} style={{ height: '20px' }}></div>
    </div>
  );
};

export default App;
