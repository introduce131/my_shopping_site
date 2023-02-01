import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { fireStore } from '../firebase.js';
import * as common from '../common.js';

const MenuContainer = styled.div`
  position: absolute;
  right: 10px;
  width: 15%;
  display: flex;
  flex-flow: column nowrap;
  gap: 20px;

  @media screen and (max-width: 1350px) {
    display: none;
  }
`;

const MenuItem = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-left: -9px;
  width: 100%;
  height: auto;
  background-color: white;
  border: 2px solid #999;
`;

// 커스텀 Label
const CustomLabel = styled.label`
  font-family: 'GmarketSans', sans-serif;
  color: rgb(100, 100, 100);
  font-size: 14px;
  font-weight: 400;
  width: 80%;
  text-align: left;
  margin: 10px auto 0px auto;
  margin-left: 15px;
`;

// 커스텀 카테고리 Label
const CustomCatePath = styled(CustomLabel)`
  font-family: 'Source Sans Pro', sans-serif;
`;

// Input type = "text" 커스텀
const InputText = styled.input.attrs({ type: 'text', spellCheck: 'false' })`
  font-family: 'GmarketSans', sans-serif;
  height: auto;
  width: 85%;
  width: ${(props) => props.width};
  margin: 0 auto;
  line-height: normal;
  padding: 0.7em 0.5em 0.5em 0.5em;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 2px solid #999;
  outline-style: none;
  background-color: white;
`;

// 커스텀 Select-option
const CustomOption = styled.select`
  font-family: 'GmarketSans', sans-serif;
  color: rgb(100, 100, 100);
  font-size: 14.5px;
  width: 90%;
  margin: 0 auto;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 2px solid #999;
  padding: 5px 0px 4px 5px;
  margin-top: 5px;
`;

// 카테고리 styled-component
const Category = styled.div`
  display: flex;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
`;

// 카테고리의 메인메뉴 styled-component
const MainMenu = styled.ul`
  list-style: none;
  padding-left: 10px;
  font-size: 14px;
  line-height: 19px;
  width: 50%;

  & > li {
    width: 85%;
    padding-left: 5px;
  }

  & > li:hover {
    background-color: rgb(175, 175, 175);
    color: white;
  }
`;

// 카테고리의 서브메뉴 styled-component
const SubMenu = styled.ul`
  list-style: none;
  padding-left: 8px;
  font-size: 13px;
  line-height: 19px;
  border-left: 1px solid black;
  width: 50%;

  & > li {
    width: 85%;
    padding-left: 5px;
  }

  & > li:hover {
    background-color: rgb(175, 175, 175);
    color: white;
  }
`;

const CustomCheck = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 10px;
`;

const CheckLabel = styled(CustomLabel)`
  margin: 0;
  font-size: 13px;
`;

const CheckMenu = (props) => {
  return (
    <CustomCheck>
      <input type="checkbox" id={props.id} name={props.id} style={{ margin: 0 }} value="O" />
      <CheckLabel htmlFor={props.id} style={{ fontSize: '12px' }}>
        {props.content}
      </CheckLabel>
    </CustomCheck>
  );
};

const RightMenuBar = () => {
  const categoryRef = collection(fireStore, 'shopping_category');
  const resultQuery = query(categoryRef, orderBy('CATE_RANK', 'asc'));
  const [cateList, setCateList] = useState([]);
  const [parentCate, setParentCate] = useState([]);
  const [childCate, setChildCate] = useState([]);
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const subMenuRef = useRef();

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

  /* 부모/자식 카테고리를 나누어서 state에 저장하는 작업 */
  useEffect(() => {
    // 최상위 카테고리(LEVEL 1)를 parent state에 저장
    const parentArray = cateList.filter((item) => item.CATE_LEVEL === '1');
    setParentCate([...parentArray]);

    // 그 외에 하위 카테고리(LEVEL 2)를 전부 한 배열에 때려넣는다. 나중에 알아서 가져다쓰기
    const childArray = cateList.filter((item) => item.CATE_LEVEL === '2');
    setChildCate([...childArray]);
  }, [cateList]);

  /* 메인 메뉴 값이 바뀌었을 때, useEffect로 동기적으로 처리해줌
     메인 메뉴를 클릭하면, 서브메뉴의 스타일을 기본스타일로 일괄적용 */
  useEffect(() => {
    if (subMenuRef.current.children.length > 0) {
      for (let i = 0; i < subMenuRef.current.children.length; i++) {
        subMenuRef.current.children[i].style.color = 'black';
        subMenuRef.current.children[i].style.backgroundColor = 'white';
      }
    }
  }, [parentName]);

  /* 메인 메뉴의 하위메뉴인 서브메뉴를 설정함 */
  const setSubMenu = (menuName) => {
    const childData = [...childCate].filter((item) => item.CATE_PARENT === menuName);

    return childData.map((item, idx) => (
      <li key={idx} onClick={subMenuOnClick}>
        {item.CATE_NAME}
      </li>
    ));
  };

  /* 메인메뉴의 아이템 onClick 이벤트 */
  const mainMenuOnClick = (e) => {
    setParentName(e.target.textContent); // 메인메뉴 이름을 state에 저장

    // MainMenu의 Item을 클릭하면 SubMenu값이 초기화 되어야 한다.
    // 하지만, 내가 현재 선택한 메인메뉴를 중복으로 클릭할 시는 초기화 안해도 됨.
    if (!(parentName == e.target.textContent)) setChildName('');

    // 클릭 이벤트가 들어오면, 형제(li)요소를 기본 style 값으로 돌림
    for (let i = 0; i < e.target.parentElement.children.length; i++) {
      e.target.parentElement.children[i].style.color = 'black';
      e.target.parentElement.children[i].style.backgroundColor = 'white';
    }
    // 그리고 target으로 들어온 li에만 style 적용
    e.target.style.backgroundColor = 'rgb(175, 175, 175)';
    e.target.style.color = 'white';
  };

  /* 서브메뉴(자식)의 아이템 onClick 이벤트 */
  const subMenuOnClick = (e) => {
    setChildName(e.target.textContent); // 서브메뉴 이름을 state에 저장
    // 클릭 이벤트가 들어오면, 형제(li)요소를 기본 style 값으로 돌림
    for (let i = 0; i < e.target.parentElement.children.length; i++) {
      e.target.parentElement.children[i].style.color = 'black';
      e.target.parentElement.children[i].style.backgroundColor = 'white';
    }
    // 그리고 target으로 들어온 li에만 style 적용
    e.target.style.backgroundColor = 'rgb(175, 175, 175)';
    e.target.style.color = 'white';
  };

  // 숫자만 입력받는 OnChange Event
  const handleOnChange = (e) => {
    e.target.value = common.removeNonNumeric(Number(e.target.value));
  };

  return (
    <div>
      <MenuContainer>
        {/* 카테고리, 원산지, 제조사, 브랜드 입력란*/}
        <MenuItem>
          <CustomLabel style={{ marginBottom: '10px' }}>카테고리</CustomLabel>
          <Category>
            {/* 메인 메뉴 */}
            <MainMenu>
              {parentCate.map((item, idx) => (
                <li onClick={mainMenuOnClick} key={idx}>
                  {item.CATE_NAME}
                </li>
              ))}
            </MainMenu>

            {/* 서브 메뉴 */}
            <SubMenu ref={subMenuRef}>{setSubMenu(parentName)}</SubMenu>

            {/* 저장할 카테고리를 Label에 표시 */}
          </Category>
          <CustomCatePath>{parentName + '  >  ' + childName}</CustomCatePath>
          <br />
          <CustomLabel>원산지</CustomLabel>
          <InputText placeholder="예) Made in Korea" />
          <br />
          <br />
          <CustomLabel>제조사</CustomLabel>
          <InputText placeholder="예) LG의류" />
          <br />
          <br />
          <CustomLabel>브랜드</CustomLabel>
          <InputText placeholder="예) LINDA" />
          <br />
        </MenuItem>

        {/* 상품 상태, 구매 설정(최소 구매수량, 1인-1회 구매시 최대수량) */}
        <MenuItem style={{ marginBottom: '10px', paddingBottom: '10px' }}>
          <CustomLabel>상품 상태</CustomLabel>
          <CustomOption>
            <option value="new">신상품</option>
            <option value="used">중고 상품</option>
            <option value="return">반품 상품</option>
          </CustomOption>
          <br />
          <CustomLabel>구매 설정</CustomLabel>
          <CustomLabel style={{ fontSize: '13px' }}>최소 구매수량</CustomLabel>
          <InputText
            onChange={handleOnChange}
            placeholder="숫자만 입력"
            defaultValue="0"
            maxLength="3"
          />
          <br />
          <CustomLabel style={{ fontSize: '13px' }}>1회 구매시 최대수량</CustomLabel>
          <InputText
            onChange={handleOnChange}
            placeholder="숫자만 입력"
            defaultValue="0"
            maxLength="3"
          />
          <br />
          <CustomLabel style={{ fontSize: '13px' }}>1인 구매시 최대수량</CustomLabel>
          <InputText
            onChange={handleOnChange}
            placeholder="숫자만 입력"
            defaultValue="0"
            maxLength="3"
          />
          <br />
          <CheckMenu id="ITEMS_BEST" content="OUR BEST ITEMS" />
          <br />
          <CheckMenu id="ITEMS_SPECIAL" content="SPECIAL ITEMS" />
          <br />
          <CheckMenu id="ITEMS_ALSO_LIKE" content="ALSO LIKE" />
        </MenuItem>
      </MenuContainer>
    </div>
  );
};

CheckMenu.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default RightMenuBar;
