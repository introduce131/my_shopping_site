import React from 'react';

// 천단위에 콤마 찍기 함수
export const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// 숫자만 입력 받을 수 있게 적용하는 함수
export const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');

// option 데이터 리스트를 만들어서 반환하는 함수
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

// inputText에서 금액을 입력할 때, 천단위 숫자를 찍어주는 함수
export function inputNumberFormat(obj) {
  obj.current.value = comma(uncomma(obj.current.value));
}

// 콤마 씌우기
export function comma(str) {
  str = String(str);
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

// 콤마 지우기
export function uncomma(str) {
  str = String(str);
  return str.replace(/[^\d]+/g, '');
}
