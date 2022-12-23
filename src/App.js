import React, { useEffect } from 'react';
import Home from './components/pages/Home';
import Products from './components/pages/Products';
import AdminUpload from './components/pages/AdminUpload';
import { Routes, Route } from 'react-router-dom';
import { fireStore } from './firebase'; //firebase.js에서 내보낸 fireStore
import { collection, getDocs, query, where } from 'firebase/firestore';

function App() {
  /** fireStore의 collection에서 "shopping_itmes" 라는 document를 찾아서 저장된 값 */
  const itemsRef = collection(fireStore, 'shopping_items');
  /** query메서드를 사용할 때, 인수 1번째는 document, 2번째는 where절 */
  const resultQuery = query(itemsRef, where('ITEMS_COLOR', '==', 'WHITE'));

  useEffect(() => {
    const getItems = async () => {
      const data = await getDocs(resultQuery);
      data.forEach((doc) => {
        console.log(doc.data()['ITEMS_NAME']);
      });
    };

    getItems();
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/products" element={<Products />}></Route>
        <Route path="/Admin" element={<AdminUpload />}></Route>
      </Routes>
    </div>
  );
}

export default App;
