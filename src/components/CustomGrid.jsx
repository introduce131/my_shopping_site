import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  font-family: 'GmarketSans', sans-serif;
  margin: 0 auto;
  width: 65%;
  background-color: white;
  border: 1px solid black;

  & > .header {
    width: 100%;
  }

  @media screen and (max-width: 1100px) {
    width: 750px;
  }
`;

const ReactTbody = (props) => {
  return (
    <tr>
      <td></td>
    </tr>
  );
};

const CustomGrid = (props) => {
  return (
    <Table>
      <thead className="header">
        <tr>
          <td>크기</td>
          <td>색상</td>
          <td>옵션가격</td>
          <td>재고</td>
          <td>상태</td>
        </tr>
      </thead>
    </Table>
  );
};

export default CustomGrid;
