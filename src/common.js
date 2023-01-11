import React from 'react';

// 천단위에 콤마 찍기 함수
export const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// 숫자만 입력 받을 수 있게 적용하는 함수
export const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');

// option 데이터 리스트를 만들어서 반환하는 함수
export function optionDataList(sizeArray, colorArray) {
  let dataList = [];
  let dataRow = {};
  let cnt = 0;

  for (let i = 0; i < sizeArray.length; i++) {
    dataRow = new Object();
    for (let j = 0; j < colorArray.length; j++) {
      dataRow = new Object();
      dataRow.size = sizeArray[i].value;
      dataRow.color = colorArray[j].color;
      dataRow.colorName = colorArray[j].value;
      dataRow.price = 0;
      dataRow.stockNow = 0;
      dataRow.stockAdd = 0;
      dataRow.status = '';
      dataList[cnt] = dataRow;
      cnt++; //카운트 1 증가
    }
  }

  return dataList;
}

// inputText에서 금액을 입력할 때, 천단위 숫자를 찍어주는 함수
export function inputNumberFormat(obj) {
  obj.current.value = comma(uncomma(obj.current.value));
}

export function comma(str) {
  str = String(str);
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

export function uncomma(str) {
  str = String(str);
  return str.replace(/[^\d]+/g, '');
}
