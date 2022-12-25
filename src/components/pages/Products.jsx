import React, { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { fireStore } from '../../../src/firebase';

function Products() {
  const param = useParams();
  useEffect(() => {
    const pId = Object.values(param)[0];
    /** doc(fireStore, collection명, document명)*/
    const docRef = doc(fireStore, 'shopping_items', pId);
    const getItems = async () => {
      const resultData = await getDoc(docRef);
      console.log(resultData.data());
    };
    getItems();
  }, []);
}

export default Products;
