import React from 'react';
import { storage } from './firebase.js';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

/** 상품 고유 ID 생성 */
export const createID = () => {
  return Math.random().toString(36).substring(2, 11);
};

/** 천단위에 콤마 찍기 함수 */
export const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** 숫자만 입력 받을 수 있게 적용하는 함수 */
export const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');

/** option 데이터 리스트를 만들어서 반환하는 함수 */
export function optionDataList(firstArray, secondArray, priceRef) {
  let dataList = [];
  let dataRow = {};
  let sizeArray = [];
  let colorArray = [];
  let cnt = 0;

  // 상품가격을 받아와서 저장
  const priceValue = priceRef.current.value;

  try {
    // firstArray, secondArray 둘중 누가 색상값을 가지고 있는지 확인
    firstArray[0].color
      ? ((colorArray = [...firstArray]), (sizeArray = [...secondArray]))
      : ((colorArray = [...secondArray]), (sizeArray = [...firstArray]));

    for (let i = 0; i < sizeArray.length; i++) {
      dataRow = new Object();
      for (let j = 0; j < colorArray.length; j++) {
        dataRow = new Object();
        dataRow.id = cnt;
        dataRow.size = sizeArray[i].value;
        dataRow.color = colorArray[j].color;
        dataRow.colorName = colorArray[j].value;
        dataRow.price = priceValue;
        dataRow.stockNow = 0;
        dataRow.stockAdd = 0;
        dataRow.status = '';
        dataList[cnt] = dataRow;
        cnt++; //카운트 1 증가
      }
    }
  } catch (e) {
    console.log(e);
  }

  return dataList;
}

/** Editor의 ref를 받아서 <img src=".."> 를 배열로 반환하는 함수 */
export function returnEditorImg(ref) {
  const content = ref.current.value;
  const result = Array.from(content.matchAll(/<img[^>]+src=["']([^'">]+)['"]/gi));
  let returnArray = [];

  console.log('result', result);

  for (let i = 0; i < result.length; i++) {
    const tempArray = result[i];
    //const tag = tempArray[0].replace(/&amp;/gi, '&'); // &amp 제거
    const url = tempArray[1].replace(/&amp;/gi, '&'); // &amp 제거
    returnArray[i] = url;
  }

  return returnArray;
}

export function limitTextAreaLine(e, maxRows) {
  // 10줄 이상 키보드 입력 엔터 막기
  const lines = e.target.value.split('\n').length;
  console.log(lines);
  if (lines > maxRows - 1 && e.key === 'Enter') {
    e.preventDefault();
  }
}

/** inputText에서 금액을 입력할 때, 천단위 숫자를 찍어주는 함수 */
export function inputNumberFormat(obj) {
  obj.current.value = comma(uncomma(obj.current.value));
}

/** 콤마 씌우기 */
export function comma(str) {
  str = String(str);
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

/** 콤마 지우기 */
export function uncomma(str) {
  str = String(str);
  return str.replace(/[^\d]+/g, '');
}

/* -------------------------------- */
/*    firebase, storage 관련 함수    */
/* -------------------------------- */

/** firebase Storage에 이미지를 업로드하는 Promise 반환 함수 */
export const imageFileUpload = async (paraFile, filePath) => {
  return new Promise((resolve, reject) => {
    /** <스토리지(저장소) 참조 생성 => 작업하려는 클라우드 파일에 대한 포인터 역할>
     *  firebase/storage에서 ref함수를 가져오고 파라미터로
     *  (저장소 서비스), (파일경로)를 인수로 전달함 */
    const storageRef = ref(storage, filePath);
    /**  uploadBytesResumable()에 인스턴스를 전달하여 업로드 작업을 만듬.*/
    const uploadTask = uploadBytesResumable(storageRef, paraFile);

    /** state_changed 이벤트에는 3가지 콜백함수가 있다
     *  1번째 콜백함수 : 업로드 진행 상황 추적, 진행 상태 업로드
     *  2번째 콜백함수 : 업로드 실패 시 오류를 처리
     *  3번째 콜백함수 : 업로드가 완료되면 실행되고, 다운로드 URL을 가져오고 콘솔에 표시
     *                  fireStore 데이터베이스에 저장해도 됨.
     */
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //퍼센트 값 = 반올림(지금까지 성공적으로 업로드된 byte 수 / 업로드할 총 byte 수)
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (err) => {
        // promise reject
        reject(err.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          resolve(url);
        });
      }
    );
  });
};

/** 차집합 계산 후, 서버에 필요없는 이미지를 삭제하는 함수 */
export function deleteServerImage(quillArray, urlData) {
  console.log('array, 현재 quill에 보여지는 이미지', quillArray);
  console.log('urldata, 현재 서버에 저장된 이미지', urlData);

  const url_DELETE = quillArray
    .filter((x) => !urlData.includes(x))
    .concat(urlData.filter((x) => !quillArray.includes(x)));

  for (let i = 0; i < url_DELETE.length; i++) {
    const httpsRef = ref(storage, url_DELETE[i]);

    deleteObject(httpsRef)
      .then(() => {
        console.log(url_DELETE[i] + ' 파일삭제됨');
      })
      .catch((err) => {
        console.log('에러코드 ' + err.code);
      });
  }
}

export function uploadData(uploadArray) {
  console.log('uploadArray', uploadArray);
}
