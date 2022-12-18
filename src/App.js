import React, { useEffect } from 'react';
import Home from './components/pages/Home';
import { fireStore } from './firebase'; //firebase.js에서 내보낸 fireStore
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

function App() {
  /** fireStore의 collection에서 "shopping_itmes" 라는 document를 찾아서 저장된 값 */
  const itemsRef = collection(fireStore, 'shopping_items');
  /** query메서드를 사용할 때, 인수 1번째는 document, 2번째는 where절 */
  const resultQuery = query(
    itemsRef,
    where('ITEMS_COLOR', '==', 'WHITE')
  );

  useEffect(() => {
    const getItems = async () => {
      const data = await getDocs(resultQuery);
      console.log(data);
    };

    getItems();
  }, []);
  return (
    <div>
      <Home />
    </div>
  );
}

export default App;
