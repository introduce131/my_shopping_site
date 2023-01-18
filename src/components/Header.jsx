import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import styled from 'styled-components';
import { fireStore } from '../firebase.js';
import styles from '../css/Header.module.css';

// 상단 메뉴아이템 선택 flex container
const MenuConatiner = styled.div`
  display: flex;
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
`;

const MainMenu = styled.ul`
  /* 하나의 item도 컨테이너처럼 flex를 해준다*/
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 1 6%;
  list-style: none;
  text-align: center;
  height: 34px;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 0;
  margin-bottom: 0;
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

const SubMenu = styled.ul`
  position: absolute;
  width: 100%;
  list-style: none;
  text-align: left;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0;
  padding-left: 5px;
  top: 37px;
  left: -4px;
  border: 1px solid black;
  display: none;

  li {
    background-color: rgb(255, 255, 255);
    line-height: 2em;
  }

  & > li:hover {
    color: rgb(161, 161, 161);
  }
`;

//작대기 3개로 이루어진 전체보기 메뉴 버튼입니더. by Component
function MenuButton() {
  return (
    <div>
      <input type="checkbox" id="menu_icon" />
      <label htmlFor="menu_icon">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </label>
    </div>
  );
}

//Header Components Function
const Header = () => {
  const categoryRef = collection(fireStore, 'shopping_category');
  const resultQuery = query(categoryRef, orderBy('CATE_RANK', 'asc'));
  const [cateList, setCateList] = useState([]); // 카테고리 전부를 저장하는 state
  const [parentCate, setParentCate] = useState([]); // filter로 메인 카테고리를 저장하는 state
  const [childCate, setChildCate] = useState([]); // filter로 서브 카테고리를 저장하는 state
  const subMenuRef = useRef([]);

  // 메인 메뉴의 하위메뉴인 서브메뉴를 설정함
  const setSubMenu = (parentName, idx) => {
    const childData = [...childCate].filter((item) => item.CATE_PARENT === parentName);

    return childData.map((item, idx) => <li key={idx}>{item.CATE_NAME}</li>);
  };

  // 메인메뉴 위에 마우스를 올려놨을 때 이벤트
  const mainMenuMouseEnter = (e) => {
    e.target.children[0].children[0].style.display = 'block';
  };

  // 메인메뉴 위에 마우스를 올려놨을 때 이벤트
  const mainMenuMouseLeave = (e) => {
    e.target.children[0].children[0].style.display = 'none';
  };

  // 서브메뉴 위에 마우스를 올려놨을 때 이벤트
  const subMenuMouseEnter = (e) => {
    console.log(e);
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
      <img
        id={styles.insta_img}
        src="https://www.freepnglogos.com/uploads/instagram-icon-png/black-hd-instagram-icon-simple-black-design-9.png"
        alt=""
      />
      {/* 상단 상품 카테고리 선택 flex container */}
      <MenuConatiner>
        <div className={styles.menu_item}>
          <MenuButton />
        </div>
        {parentCate.map((item, idx) => (
          <MainMenu key={idx} onMouseEnter={mainMenuMouseEnter} onMouseLeave={mainMenuMouseLeave}>
            <li className="main-menu-item">
              {item.CATE_NAME}
              <SubMenu
                ref={(ele) => (subMenuRef.current[idx] = ele)}
                onMouseEnter={subMenuMouseEnter}
              >
                {setSubMenu(item.CATE_NAME, idx)}
              </SubMenu>
            </li>
          </MainMenu>
        ))}
      </MenuConatiner>
    </div>
  );
};

export default Header;
