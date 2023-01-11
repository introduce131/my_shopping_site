import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as common from '../common.js';

// 커스텀 Label
const CustomLabel = styled.label`
  font-family: 'GmarketSans', sans-serif;
  color: rgb(100, 100, 100);
  font-size: 14.5px;
  font-weight: 400;
`;

// Input type = "text" 커스텀
const InputText = styled.input.attrs({ type: 'text' })`
  font-family: 'GmarketSans', sans-serif;
  height: auto;
  width: ${(props) => props.width};
  line-height: normal;
  padding: 0.5em 0.5em;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 2px solid #999;
  outline-style: none;
  background-color: white;
`;

// 커스텀 <table>, Grid 대용
const Table = styled.table`
  font-family: 'GmarketSans', sans-serif;
  margin: 0 auto;
  background-color: white;

  /* header, body 다중 선택자 "," */
  & > .header,
  .body {
    width: 100%;

    tr {
      font-size: 1em;

      td {
        padding-top: 3px;
      }
    }
  }

  & > .header td {
    color: rgb(100, 100, 100);
  }

  & > .body tr:hover {
  }

  @media screen and (max-width: 1100px) {
    width: 750px;
  }
`;

// 커스텀 Select, option
const CustomOption = styled.select`
  font-family: 'GmarketSans', sans-serif;
  color: rgb(100, 100, 100);
  font-size: 14.5px;
  font-weight: 400;
  width: 90%;
  height: 100%;
  border: none;
  padding-top: 5px;
  padding-left: 5px;
  margin-left: 7px;
`;

// 커스텀 색상표, 색상-옵션값 앞에 추가할 styled-component
const InputColor = styled.input.attrs({ type: 'color' })`
  appearance: none;
  border: none;
  background-color: white;
  width: 20px;
  height: 20px;
`;

const CustomGrid = (props) => {
  // 천단위 콤마, 숫자만 입력받게 input에 적용하는 핸들러 함수
  const handleChange = (event) => {
    event.target.value = common.addCommas(common.removeNonNumeric(event.target.value));
  };

  return (
    <Table style={{ borderSpacing: '10px 5px' }}>
      {console.log(props.dataList)}

      {/* 헤더 */}
      <thead className="header">
        <tr>
          <td width="8%">
            <input type="checkbox" />
          </td>
          <td width="12%">크기</td>
          <td width="17%">색상</td>
          <td width="18%">옵션가격</td>
          <td width="15%">재고 [현]</td>
          <td width="15%">재고 [추가]</td>
          <td width="15%">상태</td>
        </tr>
      </thead>

      {/* 데이터[body] */}
      <tbody className="body">
        {props.dataList.map((item, idx) => (
          <tr key={idx}>
            <td>
              <input type="checkbox" />
            </td>
            {/* [사이즈] */}
            <td>{item.size}</td>
            {/* [색상] */}
            <td>
              <div style={{ paddingBottom: '2px' }}>
                <InputColor value={item.color} disabled />
                {item.colorName}
              </div>
            </td>
            {/* [옵션가격] */}
            <td style={{ borderBottom: '2px solid #999' }}>
              <CustomLabel style={{ fontWeight: '600' }}>￦</CustomLabel>
              <InputText
                width="70%"
                style={{ borderBottom: 'none' }}
                autoComplete="off"
                onChange={handleChange}
                defaultValue={item.price}
              />
            </td>
            {/* [ 재고[현] ] */}
            <td style={{ borderBottom: '2px solid #999' }}>
              <InputText
                width="70%"
                style={{ borderBottom: 'none' }}
                autoComplete="off"
                defaultValue={item.stockNow}
                readOnly
              />
            </td>
            {/* [ 재고[추가] ] */}
            <td style={{ borderBottom: '2px solid #999' }}>
              <InputText
                width="60%"
                style={{ borderBottom: 'none' }}
                autoComplete="off"
                onChange={(event) => {
                  event.target.value = common.removeNonNumeric(event.target.value);
                }}
                defaultValue={item.stockAdd}
              />
            </td>
            {/* [상태] */}
            {/* 1:판매중, 2:판매대기, 3:품절 */}
            <td style={{ borderBottom: '2px solid #999' }}>
              <CustomOption>
                <option value="1">판매중</option>
                <option value="2">판매대기</option>
                <option value="3">품 절</option>
              </CustomOption>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

CustomGrid.propTypes = {
  dataList: PropTypes.array.isRequired,
};

export default CustomGrid;
