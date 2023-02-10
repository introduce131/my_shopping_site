import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import styled, { createGlobalStyle } from 'styled-components';
import { fireStore } from '../firebase.js';
import styles from '../css/Header.module.css';

// 상단 메뉴아이템 선택 flex container
const MenuConatiner = styled.div`
  display: flex;
  position: relative;
  /* 메뉴 컨테이너 최소/최대크기 지정 */
  margin: auto;
  width: 1100px;
  max-width: 1100px;
  min-width: 900px;
  /* End .. */
  height: 34px;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: flex-start;
  background-color: rgb(255, 255, 255);
  border: 1.5px solid rgb(192, 192, 192);
  border-top: 1.5px solid black;
`;

// 메인컨테이너의 item, 하위 서브메뉴를 보여줘야해서 ul로 작성
const MainMenu = styled.ul`
  /* 하나의 item도 컨테이너처럼 flex를 해준다*/
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 1 6%;
  list-style: none;
  text-align: center;
  height: 100%;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 0;
  margin-bottom: 50px;
  cursor: pointer;
  border: none;
  z-index: 1;

  &:hover {
    color: rgb(161, 161, 161);
    border-bottom: 1px solid black;
  }

  &:hover > .main-menu-item ul {
    color: black;
  }
`;

// 서브메뉴. li를 부모로 삼음
const SubMenu = styled.div`
  position: absolute;
  width: 110%;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0;
  top: 34px;
  left: -4px;
  border: 1px solid black;
  display: none;
  background-color: white;

  &.before-after:after {
    border-color: white transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    content: '';
    display: block;
    left: 50%;
    transform: translate(-50%, 0%);
    position: absolute;
    top: -7px;
    width: 0;
    z-index: 1;
  }

  &.before-after:before {
    border-color: black transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    content: '';
    display: block;
    left: 50%;
    transform: translate(-50%, 0%);
    position: absolute;
    top: -8px;
    width: 0;
    z-index: 0;
  }

  ul {
    list-style: none;
    text-align: left;
    padding-left: 5px;
    padding-top: 3px;
  }

  ul li {
    background-color: rgb(255, 255, 255);
    line-height: 2em;
  }

  & > ul li:hover {
    color: rgb(161, 161, 161);
  }
`;

// 헤더가 화면에 꽉차보이기 위해 만든 가짜 div. Z-index는 헤더 컨테이너보다 낮은값
const FakeContainer = styled.div`
  position: absolute;
  top: 55%;
  width: 100vw;
  min-width: 1100px;
  height: 34px;
  background-color: rgb(255, 255, 255);
  border: 1.5px solid rgb(192, 192, 192);
  border-top: 1.5px solid black;
  z-index: 0;
`;

// 전역 스타일링, body
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;
//Header Components Function
const Header = () => {
  const categoryRef = collection(fireStore, 'shopping_category');
  const resultQuery = query(categoryRef, orderBy('CATE_RANK', 'asc'));
  const [cateList, setCateList] = useState([]); // 카테고리 전부를 저장하는 state
  const [parentCate, setParentCate] = useState([]); // filter로 메인 카테고리를 저장하는 state
  const [childCate, setChildCate] = useState([]); // filter로 서브 카테고리를 저장하는 state
  const [isSub, setIsSub] = useState();
  const subMenuRef = useRef([]);

  // 메인 메뉴의 하위메뉴인 서브메뉴를 설정함
  const setSubMenu = (parentName) => {
    const childData = [...childCate].filter((item) => item.CATE_PARENT === parentName);

    return childData.map((item, idx) => (
      <ul key={idx}>
        <li key={idx}>{item.CATE_NAME}</li>
      </ul>
    ));
  };

  // 메인메뉴 위에 마우스를 올려놨을 때 이벤트
  const mainMenuMouseEnter = (idx) => {
    subMenuRef.current[idx].style.display = 'block';
    // 하위 서브메뉴가 없으면 border : none, 'before-after' 클래스 지우기
    if (!subMenuRef.current[idx].children[0]) {
      subMenuRef.current[idx].style.border = 'none';
      subMenuRef.current[idx].classList.remove('before-after');
    }
  };

  // 메인메뉴 위에 마우스가 벗어났을 때 이벤트
  const mainMenuMouseLeave = (idx) => {
    subMenuRef.current[idx].style.display = 'none';
  };

  // 첫 마운트 시, fireStore에서 카테고리 데이터 전체를 불러온 후 cateList state에 저장
  useEffect(() => {
    const getItems = async () => {
      const data = await getDocs(resultQuery);
      data.forEach((doc) => {
        setCateList((array) => [...array, doc.data()]);
      });
    };
    getItems();
  }, []);

  // cateList의 동기적 처리를 위함
  useEffect(() => {
    // 최상위 카테고리(LEVEL 1)를 parent state에 저장
    const parentArray = cateList.filter((item) => item.CATE_LEVEL === '1');
    setParentCate([...parentArray]);

    // 그 외에 하위 카테고리(LEVEL 2)를 전부 한 배열에 때려넣는다. 나중에 알아서 가져다쓰기
    const childArray = cateList.filter((item) => item.CATE_LEVEL === '2');
    setChildCate([...childArray]);
  }, [cateList]);

  return (
    <div style={{ position: 'relative' }}>
      <div id={styles.logo}>c h a r l o t t e</div> {/*로고*/}
      {/* 글로벌 스타일 body 지정 */}
      <GlobalStyle />
      {/* 상단 상품 카테고리 선택 flex container */}
      <FakeContainer />
      <MenuConatiner>
        <img
          id={styles.insta_img}
          src={process.env.PUBLIC_URL + '/images/instagram-icon.png'}
          alt=""
        />
        <MainMenu></MainMenu>
        {parentCate.map((item, idx) => (
          <MainMenu
            key={idx}
            onMouseEnter={() => {
              mainMenuMouseEnter(idx);
            }}
            onMouseLeave={() => {
              mainMenuMouseLeave(idx);
            }}
          >
            <li className="main-menu-item">
              {item.CATE_NAME}
              <SubMenu ref={(ele) => (subMenuRef.current[idx] = ele)} className="before-after">
                {setSubMenu(item.CATE_NAME)}
              </SubMenu>
            </li>
          </MainMenu>
        ))}
      </MenuConatiner>
    </div>
  );
};

export default Header;
