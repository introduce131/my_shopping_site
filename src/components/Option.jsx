import React, { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

// Input type = "text" 커스텀
const InputText = styled.input.attrs({ type: 'text' })`
  font-family: 'GmarketSans', sans-serif;
  height: auto;
  id: ${(props) => props.id};
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

// 상품 옵션 Contatiner div
const ParentContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 20px;
  width: 65%;
  height: 35px;
  background-color: white;
  margin: 0 auto;

  /* option-container div */
  & > .option-container {
    display: flex;
    flex-flow: row nowrap;
    gap: 6px;
    width: 51.5%;

    /* li라 쓰고 옵션 아이템이라 읽는다 */
    li {
      display: flex;
      gap: 10px;
      align-items: center;
      font-family: 'GmarketSans', sans-serif;
      font-size: 14.5px;
      font-weight: 600;
      color: rgb(100, 100, 100);
      border: 1px solid #999;
      list-style: none;
      background-color: rgb(222, 222, 222);
      padding: 2px 5px 0px 5px;
      white-space: nowrap;

      /* label이라고 쓰고 옵션 옆 X 버튼이라고 읽는다 */
      label {
        font-weight: 200;
        color: rgb(100, 100, 100);
      }
    }

    /* 입력받는 input-text의 id */
    #option-input-text {
      flex: 1 1 auto;
      overflow: hidden;
    }
  }

  @media screen and (max-width: 1100px) {
    width: 750px;
  }
`;

// 상품 옵션 input Text
const OptionInputText = styled(InputText)`
  padding: 10px;
`;

// 커스텀 Select-option
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
`;

const Option = () => {
  const [textValue, setTextValue] = useState('');
  const [option, setOption] = useState([]);

  //option state의 동기적 처리를 위함
  useEffect(() => {
    // querySelector useRef로 수정하자
    const parentOfItemList = document.querySelector('.option-container');
    const itemList = document.querySelectorAll('.option-list');
    let itemWidth = 0;

    for (let i = 0; i < itemList.length; i++) {
      itemWidth += itemList[i].clientWidth;
    }

    console.log(itemList);

    // li의 width의 총 길이가 div의 90%를 넘으면 마지막으로 추가한 요소를 삭제한다
    // 코드 진짜 개판같은데 설명하자면 마지막 배열의 요소인 option-list{5}를 삭제하면
    // 다음에 그 자리에 생성되는 요소는 option-list{5}가 아닌 option-list{6}으로 생성됨
    // 그래서 삭제할 때 마다 RemoveCnt 상태를 1씩 증가시켜서
    // <<      option-list{인덱스} + {삭제한 요소의 수}로 계산      >>
    // 그래야지 querySelector로 제대로 된 DOM객체를 가져올 수 있게된다.
    // 일단은 개같이 쓰는데 다음에 무조건 수정
    if (itemWidth >= parentOfItemList.clientWidth * 0.9) {
      const copyArray = [...option];
      const popResult = copyArray.pop();

      alert(`방금 입력하신 옵션 '${popResult}' 은(는) 자릿수 초과로 지워집니다`);
      setOption(copyArray);
      document.querySelector('#option-input-text').disabled = true; //입력 막기
    } else {
      document.querySelector('#option-input-text').disabled = false; //입력 풀기
    }
  }, [option]);

  //Enter 클릭 이벤트 처리 핸들러
  const onKeyPress = (e) => {
    if (e.key == 'Enter' && e.target.value !== '') {
      setOption((option) => [...option, textValue]);
      setTextValue('');
      e.target.value = '';
    }
  };

  // 옵션을 옆에 "X", 삭제 이벤트 처리 핸들러
  // 아니 idx 넘겨받지도 않았는데 왜 작동하는거냐? 수정하자
  const deleteClickHandler = (idx) => {
    const copyArray = [...option];
    copyArray.splice(idx, 1); //해당 인덱스 1개만 삭제
    setOption(copyArray);
  };

  return (
    <ParentContainer>
      <CustomOption>
        <option>기본</option>
        <option>색상</option>
      </CustomOption>
      <OptionInputText width="14%" maxLength="6" style={{ paddingBottom: '5px' }} />
      <div className="option-container">
        {option.map((item, idx) => {
          return (
            <li id={'option-list' + idx} key={idx} className="option-list">
              {item}
              <label
                onClick={() => {
                  const copyArray = [...option];
                  copyArray.splice(idx, 1); //해당 인덱스 1개만 삭제
                  setOption(copyArray);
                }}
              >
                X
              </label>
            </li>
          );
        })}
        <InputText
          id="option-input-text"
          onKeyPress={onKeyPress}
          onChange={(e) => {
            setTextValue(e.target.value);
          }}
          style={{ borderBottom: 'none' }}
          width="auto"
          autoComplete="off"
        />
      </div>
    </ParentContainer>
  );
};

export default Option;
