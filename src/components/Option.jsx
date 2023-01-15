import React, { useState, useRef, useEffect } from 'react';
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
  position: relative;
  flex-flow: row nowrap;
  gap: 20px;
  width: 100%;
  height: 35px;
  background-color: white;
  padding-top: 35px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const OptionConatiner = styled.div`
  /* option-container div */
  display: flex;
  flex-flow: row nowrap;
  gap: 6px;
  width: 58%;
  border-bottom: 1px solid #999;

  /* li라 쓰고 옵션 아이템이라 읽는다 */
  li {
    display: flex;
    gap: 5px;
    align-items: center;
    font-family: 'GmarketSans', sans-serif;
    font-size: 14.5px;
    font-weight: 600;
    color: rgb(100, 100, 100);
    list-style: none;
    background-color: rgb(222, 222, 222);
    padding: 2px 5px 0px 5px;
    white-space: nowrap;
    height: 80%;

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
  padding-left: 5px;
  margin-left: 7px;
`;

// 커스텀 색상표, 색상-옵션값 앞에 추가할 styled-component
const InputColor = styled.input.attrs({ type: 'color' })`
  appearance: none;
  border: none;
  background-color: rgb(222, 222, 222);
  width: 29px;
  height: 29px;
`;

// 커스텀 Label
const CustomLabel = styled.label`
  position: absolute;
  font-family: 'GmarketSans', sans-serif;
  color: rgb(100, 100, 100);
  font-size: 0.8rem;
  font-weight: 400;
`;

// in-line style로 작성된 옵션값 css
const option_div_style = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #999',
  backgroundColor: 'rgb(222, 222, 222)',
};

const Option = React.forwardRef(function optionFunc(props, ref) {
  const [textValue, setTextValue] = useState(''); // 입력받은 텍스트를 저장할 state
  const [option, setOption] = useState([]); //옵션값으로 쓸 객체배열 state
  const [isColor, setIsColor] = useState(false); // 옵션타입이 색상인지 구분하는 stat
  const optionContainerRef = useRef(); // 옵션을 감싼 div 컨테이너.ref
  const optionListRef = useRef([]); // 옵션값을 감싼 div 컨테이너.ref
  const inputTextRef = useRef(); // 옵션값을 작성하는 text박스.ref
  const returnValue = []; // 저장된 옵션값을 컴포넌트 밖으로 보낼 배열

  useEffect(() => {});

  //option state의 동기적 처리를 위함
  useEffect(() => {
    let refWidth = 0;

    // li 태그들의 width를 구함
    for (let i = 0; i < optionListRef.current.length; i++) {
      const ref = optionListRef.current[i];

      if (ref !== null) {
        const optionData = {};
        // null은 제외, 옵션(li태그)의 width를 refWidth변수에 중첩저장.
        refWidth += Math.round(ref.getBoundingClientRect().width);

        // 옵션타입이 색상이면 {color, value}, 기본이면 {value}으로 설정
        if (isColor) {
          optionData.color = ref.children[0].value;
          optionData.value = String(ref.children[1].textContent).slice(0, -1); //마지막 X 값은 지우고 값을 배열에 저장
        } else {
          optionData.value = String(ref.children[0].textContent).slice(0, -1); //마지막 X 값은 지우고 값을 배열에 저장
        }

        returnValue[i] = optionData;
      }
    }
    props.getOptionData(returnValue); //부모 컴포넌트에게 옵션값이 저장된 배열 내보내기
    const containerWidth = Math.round(optionContainerRef.current.clientWidth * 0.9);

    // li(옵션)들의 width의 총 길이가 부모div의 90%를 넘으면 마지막으로 추가한 요소를 삭제한다
    if (refWidth >= containerWidth) {
      const copyArray = [...option];
      const popResult = copyArray.pop();

      alert(`방금 입력하신 옵션 '${popResult.value}' 은(는) 자릿수 초과로 지워집니다`);
      setOption(copyArray); //자릿수 초과한 요소를 지우고 option state에 반영해줌.
    }
  }, [option]);

  // useEffect(() => {
  //   props.getHeader(optionName);
  // }, [optionName]);

  // 로딩(mount)시, 한번만 실행되게
  useEffect(() => {
    // option state의 초기값으로 {color:'', value:''} 를 주었기 때문에, 옵션값이 1개 있는것처럼 취급됨
    // 그래서 useEffect로 로딩될때, option state를 초기화해주었음.
    setOption([]);
  }, []);

  //Enter 클릭 이벤트 처리 핸들러
  const onKeyPress = (e) => {
    const optionData = {
      value: textValue,
    };
    if (e.key == 'Enter' && e.target.value !== '') {
      setOption((option) => option.concat(optionData));
      setTextValue('');
      e.target.value = '';
    }
  };

  return (
    <div>
      <ParentContainer>
        {/* 옵션타입 {기본, 색상}*/}
        <CustomLabel style={{ top: '7px', left: '7px' }}>옵션타입</CustomLabel>
        <CustomOption
          onChange={(e) => {
            // 옵션타입이 color면 isColor state를 true 아니라면 false(기본)
            if (e.target.value === 'color') {
              setIsColor(true);
              setOption([]); // 기본-> 색상으로 전환시, option값[배열]을 초기화시켜버림.
            } else {
              setIsColor(false); // 색상 -> 기본으로 전환시는 option값[배열]을 비우지 않는다.
              const newArray = [...option];
              // 색상 -> 기본으로 전환 시, color key를 삭제해버림.
              newArray.forEach((item) => {
                delete item.color;
              });
              setOption(newArray);
            }
          }}
        >
          <option value="normal">기본</option>
          <option value="color">색상</option>
        </CustomOption>

        {/* 옵션명 */}
        <CustomLabel style={{ top: '7px', left: 'calc(20% - 10px)' }}>옵션명</CustomLabel>
        <OptionInputText ref={ref} width="14%" maxLength="6" style={{ paddingBottom: '5px' }} />

        {/* 옵션값 */}
        <CustomLabel style={{ top: '7px', left: 'calc(39% - 10px)' }}>옵션값</CustomLabel>
        <OptionConatiner ref={optionContainerRef}>
          {option.map((item, idx) => {
            return (
              <div
                key={idx}
                style={option_div_style}
                ref={(ele) => (optionListRef.current[idx] = ele)}
              >
                {/* 옵션타입이 색상이면 <inputColor>로 옵션값 맨앞에 색상표를 추가해줌 */}
                {isColor ? (
                  <InputColor
                    //오른쪽 마우스로 RGB 컬러를 저장한다.
                    onContextMenu={(e) => {
                      e.preventDefault(); // 기본 이벤트 막기
                      const newArray = [...option];
                      newArray[idx].color = e.target.value;
                      setOption(newArray);
                    }}
                  />
                ) : (
                  <></>
                )}
                <li>
                  {item.value}
                  <label
                    onClick={() => {
                      //선택된 인덱스 배열에서 1개 삭제
                      const copyArray = [...option];
                      copyArray.splice(idx, 1);
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
});

Option.propTypes = {
  getOptionData: PropTypes.func.isRequired,
};

export default Option;
