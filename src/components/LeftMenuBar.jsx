import React from 'react';
import styled from 'styled-components';

const MenuContatinerDiv = styled.div`
  position: fixed;
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
  width: 165px;
  height: 100%;
  background-color: #999;
`;

const MenuItemDiv = styled.div`
  flex: 0 1 10%;
`;

const LeftMenuBar = () => {
  return (
    <div>
      <MenuContatinerDiv>
        <MenuItemDiv>아이템 1</MenuItemDiv>
        <MenuItemDiv>아이템 2</MenuItemDiv>
        <MenuItemDiv>아이템 3</MenuItemDiv>
        <MenuItemDiv>아이템 4</MenuItemDiv>
        <MenuItemDiv>아이템 5</MenuItemDiv>
        <MenuItemDiv>아이템 6</MenuItemDiv>
        <MenuItemDiv>아이템 7</MenuItemDiv>
        <MenuItemDiv>아이템 8</MenuItemDiv>
        <MenuItemDiv>아이템 9</MenuItemDiv>
        <MenuItemDiv>아이템 10</MenuItemDiv>
      </MenuContatinerDiv>
    </div>
  );
};

export default LeftMenuBar;
