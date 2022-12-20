/* 이 파일은 Admin(관리자) 전용 화면입니다. */
/* 컴포넌트 이름이 긴 것은 어쩔 수 없습니다 ^^ */

import React, { useState } from 'react';
import { fireStore, storage } from '../../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

const AdminUpload = () => {
  const itemsCollectionRef = collection(fireStore, 'shopping_items');
  const [file, setFile] = useState('');
  const [percent, setPercent] = useState(0);
  const [imgURL, setImgURL] = useState('');

  // 업로드 함수
  function handleUpload() {
    //파일이 비어있지 않은지 먼저 확인
    if (!file) {
      alert('이미지 파일을 먼저 선택해주세요');
    }

    /** <스토리지(저장소) 참조 생성 => 작업하려는 클라우드 파일에 대한 포인터 역할>
     *  firebase/storage에서 ref함수를 가져오고 파라미터로
     *  (저장소 서비스), (파일경로)를 인수로 전달함 */
    const storageRef = ref(storage, `files/${file.name}`);
    /**  uploadBytesResumable()에 인스턴스를 전달하여 업로드 작업을 만듬.*/
    const uploadTask = uploadBytesResumable(storageRef, file);

    /** state_changed 이벤트에는 3가지 콜백함수가 있다
     *  1번째 함수 : 업로드 진행 상황 추적, 진행 상태 업로드
     *  2번째 함수 : 업로드 실패 시 오류를 처리
     *  3번째 함수 : 업로드가 완료되면 실행되고, 다운로드 URL을 가져오고 콘솔에 표시
     *              실무에서는 데이터베이스에 저장해도 됨.
     */
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //퍼센트 값 = 반올림(지금까지 성공적으로 업로드된 byte 수 / 업로드할 총 byte 수)
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        setPercent(percent);
      },
      (err) => {
        setImgURL('ERR');
        console.log(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImgURL(url); //imgURL state에 저장
          console.log('이미지 경로', url);
        });
      }
    );
  }

  const addItems = async () => {
    const ItemName = document.querySelector('#ITEMS_NAME').value;
    const ItemPrice = document.querySelector('#ITEMS_PRICE').value;
    const ItemFabric = document.querySelector('#ITEMS_FABRIC').value;
    const ItemSize = document.querySelector('#ITEMS_SIZE').value;
    const ItemColor = document.querySelector('#ITEMS_COLOR').value;
    const ItemMadein = document.querySelector('#ITEMS_MADEIN').value;
    const ItemContent = document.querySelector('#ITEMS_CONTENTS').value;
    const ItemImgURL = imgURL;

    //imgURL이 ERR거나 공백이라면 ERR를 return한다
    if (imgURL === 'ERR' && imgURL === '') {
      return 'ERR';
    }

    try {
      //addDoc("컬렉션에 대한 참조", "데이터가 포함된 Object")
      const res = await addDoc(itemsCollectionRef, {
        ITEMS_NAME: ItemName,
        ITEMS_PRICE: parseInt(ItemPrice),
        ITEMS_FABRIC: ItemFabric,
        ITEMS_SIZE: ItemSize,
        ITEMS_COLOR: ItemColor,
        ITEMS_MADEIN: ItemMadein,
        ITEMS_CONTENTS: ItemContent,
        ITEMS_IMGURL: ItemImgURL,
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
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <br />
        <button onClick={handleUpload}>사진 업로드</button>
        <p>{percent}% 완료</p>
      </div>
      <br />
      <br />
      <button onClick={addItems}>추가하기</button>
    </div>
  );
};

export default AdminUpload;
