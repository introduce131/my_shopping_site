/* 이 파일은 Admin(관리자) 전용 화면입니다. */
/* 컴포넌트 이름이 긴 것은 어쩔 수 없습니다. o.<* */

import React from 'react';
import { fireStore } from '../../firebase.js';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

const AdminUpload = () => {
  const itemsCollectionRef = collection(fireStore, 'shopping_items');

  const addItems = async () => {
    const ItemName = document.querySelector('#ITEMS_NAME').value;
    const ItemPrice = document.querySelector('#ITEMS_PRICE').value;
    const ItemFabric = document.querySelector('#ITEMS_FABRIC').value;
    const ItemSize = document.querySelector('#ITEMS_SIZE').value;
    const ItemColor = document.querySelector('#ITEMS_COLOR').value;
    const ItemMadein = document.querySelector('#ITEMS_MADEIN').value;
    const ItemContent = document.querySelector('#ITEMS_CONTENTS').value;

    try {
      //addDoc("컬렉션에 대한 참조", "데이터가 포함된 Object")
      const res = await addDoc(itemsCollectionRef, {
        ID: 3,
        ITEMS_NAME: ItemName,
        ITEMS_PRICE: parseInt(ItemPrice),
        ITEMS_FABRIC: ItemFabric,
        ITEMS_SIZE: ItemSize,
        ITEMS_COLOR: ItemColor,
        ITEMS_MADEIN: ItemMadein,
        ITEMS_CONTENTS: ItemContent,
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <label htmlFor="ITEMS_NAME">상품명</label>
      <input type="text" id="ITEMS_NAME" />
      <br />
      <label htmlFor="ITEMS_PRICE">가격</label>
      <input type="text" id="ITEMS_PRICE" />
      <br />
      <label htmlFor="ITEMS_FABRIC">재질</label>
      <textarea id="ITEMS_FABRIC" />
      <br />
      <label htmlFor="ITEMS_SIZE">사이즈</label>
      <input type="text" id="ITEMS_SIZE" />
      <br />
      <label htmlFor="ITEMS_COLOR">색상</label>
      <input type="text" id="ITEMS_COLOR" />
      <br />
      <label htmlFor="ITEMS_MADEIN">MADE IN</label>
      <input type="text" id="ITEMS_MADEIN" />
      <br />
      <label htmlFor="ITEMS_CONTENTS">상품 설명</label>
      <textarea id="ITEMS_CONTENTS" />
      <br />
      <button onClick={addItems}>추가하기</button>
    </div>
  );
};

export default AdminUpload;
