import React from 'react';

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
      dataList[cnt] = dataRow;
      cnt++;
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
