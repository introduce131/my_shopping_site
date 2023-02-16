import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';

const CustomInputNumber = styled.div`
  width: 70px;

  & > .wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid black;
    border-radius: 5px;

    .minus {
      position: absolute;
      left: 1px;
      border: none;
      width: 16px;
      height: 16px;
      line-height: 17px;
      text-align: center;
      background-color: white;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -2.5px;
    }
    .plus {
      position: absolute;
      right: 1px;
      border: none;
      width: 16px;
      height: 16px;
      line-height: 17px;
      text-align: center;
      background-color: white;
      font-size: 16px;
      font-weight: 800;
    }

    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }

    .order-number {
      width: 22px;
      height: 20px;
      border: none;
      text-align: center;
    }
  }
`;

const NumberCustom = React.forwardRef((props, ref) => {
  const [number, setNumber] = useState(1);

  return (
    <CustomInputNumber>
      <div className="wrapper">
        <label
          className="minus"
          onClick={() => {
            setNumber(number - 1);
          }}
        >
          --
        </label>
        <input ref={ref} type="number" className="order-number" value={number} />
        <label
          className="plus"
          onClick={() => {
            setNumber(number + 1);
          }}
        >
          +
        </label>
      </div>
    </CustomInputNumber>
  );
});
NumberCustom.displayName = 'NumberCustom';

export default NumberCustom;
