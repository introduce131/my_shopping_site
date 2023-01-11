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

const Table = styled.table`
  font-family: 'GmarketSans', sans-serif;
  margin: 0 auto;
  width: 65%;
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

  @media screen and (max-width: 1100px) {
    width: 750px;
  }
`;

const CustomOption = styled.select`
  font-family: 'GmarketSans', sans-serif;
  color: rgb(100, 100, 100);
  font-size: 14.5px;
  font-weight: 400;
  width: 15%;
  height: 100%;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 2px solid #999;
  padding-top: 5px;
  padding-left: 5px;
  margin-left: 7px;
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
            <td>{item.size}</td>
            <td>{item.colorName}</td>
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
            <td style={{ borderBottom: '2px solid #999' }}>
              <InputText
                width="70%"
                style={{ borderBottom: 'none' }}
                autoComplete="off"
                defaultValue={item.stockNow}
              />
            </td>
            <td style={{ borderBottom: '2px solid #999' }}>
              <InputText
                width="60%"
                style={{ borderBottom: 'none' }}
                autoComplete="off"
                defaultValue={item.stockAdd}
              />
            </td>
            <td>
              <CustomOption>
                <option value="1">판매중</option>
                <option value="2">판매대기</option>
                <option value="3">판매아님</option>
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
