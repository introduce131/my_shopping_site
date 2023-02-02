import React from 'react';
import styled from 'styled-components';

const MenuContatinerDiv = styled.div`
  position: fixed;
  display: flex;
  flex-flow: column nowrap;
  width: 11%;
  min-width: 175px;
  margin-left: -9px;
  height: 100%;
  background-color: rgb(70, 70, 70);

  @media screen and (max-width: 1100px) {
    display: none;
  }
`;

const MenuItemDiv = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid white;
  color: white;
  height: 5%;
`;

const LeftMenuBar = () => {
  return (
    <div>
      <MenuContatinerDiv>
        <div>아이콘</div>
        <MenuItemDiv>사용자 관리</MenuItemDiv>
        <MenuItemDiv>상품 관리</MenuItemDiv>
        <MenuItemDiv>주문 관리</MenuItemDiv>
        <MenuItemDiv>반품 관리</MenuItemDiv>
        <MenuItemDiv>교환 관리</MenuItemDiv>
        <MenuItemDiv>문의 관리</MenuItemDiv>
        <MenuItemDiv>쿠폰 관리</MenuItemDiv>
        <MenuItemDiv>통계 확인</MenuItemDiv>
        <MenuItemDiv>고객 지원</MenuItemDiv>
      </MenuContatinerDiv>
    </div>
  );
};

export default LeftMenuBar;
