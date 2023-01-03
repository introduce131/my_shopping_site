import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

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

// 상품 옵션 Contatiner div
const ParentContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 20px;
  width: 65%;
  height: 35px;
  border: 1px solid black;
  margin: 0 auto;

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
`;

const OptionContainer = styled.div`
    display:flex;
    flex-flow: row nowrap;
    gap: 6px;
    width: 51.5%;
    
    li {
        display: flex;
        gap: 6px;
        align-items:center;        
        font-family: "GmarketSans", sans-serif;
        font-size: 14.5px;
        font-weight: 600;
        color: rgb(100, 100, 100);
        border: 1px solid #999;
        list-style: none;
        background-color: rgb(222, 222, 222);
        padding: 0px 5px 0px 5px;
      
        label {
            font-weight: 200;
            color: rgb(100, 100, 100);
        }
    }
    & > #option-input-text {
        flex: 1 1 auto;
        overflow: hidden;
    }
  }
`;

const Option = () => {
  const [textValue, setTextValue] = useState('');
  const [option, setOption] = useState([]);

  //option state의 동기적 처리를 위함
  useEffect(() => {
    const InputText = document.querySelector('#option-input-text');
    const TextWidth = InputText.clientWidth;
    console.log('TextWidth', TextWidth);

    if (TextWidth < 50) {
      InputText.style.display = 'none';
    }
  }, [option]);

  //Enter 클릭 이벤트
  const onKeyPress = (e) => {
    if (e.key == 'Enter' && e.target.value !== '') {
      setOption((option) => [...option, textValue]);
      setTextValue('');
      e.target.value = '';
    }
  };

  return (
    <ParentContainer>
      <CustomOption>
        <option>기본</option>
        <option>색상</option>
      </CustomOption>
      <OptionInputText width="14%" maxLength="6" />
      <OptionContainer>
        {option.map((item, idx) => {
          return (
            <li key={idx} className="option-list">
              {item}
              <label>X</label>
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
        />
      </OptionContainer>
    </ParentContainer>
  );
};

export default Option;
