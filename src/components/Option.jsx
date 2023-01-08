import React, { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

  @media screen and (max-width: 1100px) {
    width: 750px;
  }
`;

const OptionConatiner = styled.div`
  /* option-container div */
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

const InputColor = styled.input.attrs({ type: 'color' })`
  appearance: none;
  border: none;
  width: 20px;
  height: 20px;
`;

// 옵션값에 색상을 추가하기 위한 이벤트핸들러
const onClickAddColorEvent = (e) => {
  e.preventDefault(); //기존 이벤트는 막음처리
  const bounds = e.target.getBoundingClientRect();
  const x = e.clientX - bounds.left;
  const y = e.clientY - bounds.top;
  console.log('x:', x);
  console.log('y:', y);
};

const Option = (props) => {
  const [textValue, setTextValue] = useState('');
  const [option, setOption] = useState([]);
  const optionContainerRef = useRef();
  const optionListRef = useRef([]);
  const inputTextRef = useRef();
  const returnValue = new Array(); //옵션값을 컴포넌트 밖으로 보낼 배열

  //option state의 동기적 처리를 위함
  useEffect(() => {
    let refWidth = 0;

    // li 태그들의 width를 구함
    for (let i = 0; i < optionListRef.current.length; i++) {
      const ref = optionListRef.current[i];

      if (ref !== null) {
        //null은 제외, 옵션(li태그)의 width를 refWidth변수에 중첩저장.
        refWidth += Math.round(ref.getBoundingClientRect().width);
        returnValue[i] = String(ref.textContent).slice(0, -1); //마지막 X 값은 지우고 값을 배열에 저장
      }
    }
    props.getOptionData(returnValue); //부모 컴포넌트에게 옵션값이 저장된 배열 내보내기
    const containerWidth = Math.round(optionContainerRef.current.clientWidth * 0.9);

    // li(옵션)들의 width의 총 길이가 부모div의 90%를 넘으면 마지막으로 추가한 요소를 삭제한다
    if (refWidth >= containerWidth) {
      const copyArray = [...option];
      const popResult = copyArray.pop();

      alert(`방금 입력하신 옵션 '${popResult}' 은(는) 자릿수 초과로 지워집니다`);
      setOption(copyArray); //자릿수 초과한 요소를 지우고 option state에 반영해줌.
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

  return (
    <div>
      <ParentContainer>
        <CustomOption>
          <option>기본</option>
          <option>색상</option>
        </CustomOption>

        <OptionInputText width="14%" maxLength="6" style={{ paddingBottom: '5px' }} />

        <OptionConatiner ref={optionContainerRef}>
          {option.map((item, idx) => {
            return (
              <div key={idx} style={{ display: 'flex' }}>
                <InputColor />
                <li
                  key={idx}
                  ref={(ele) => (optionListRef.current[idx] = ele)}
                  onContextMenu={onClickAddColorEvent}
                >
                  {item}
                  <label
                    onClick={() => {
                      const copyArray = [...option];
                      copyArray.splice(idx, 1); //해당 인덱스 1개만
                      setOption(copyArray);
                    }}
                  >
                    X
                  </label>
                </li>
              </div>
            );
          })}
          <InputText
            id="option-input-text"
            ref={inputTextRef}
            onKeyPress={onKeyPress}
            onChange={(e) => {
              setTextValue(e.target.value);
            }}
            style={{ borderBottom: 'none' }}
            width="auto"
            autoComplete="off"
          />
        </OptionConatiner>
      </ParentContainer>
    </div>
  );
};

Option.propTypes = {
  getOptionData: PropTypes.func.isRequired,
};

export default Option;
