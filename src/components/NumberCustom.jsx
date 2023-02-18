import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as common from '../common.js';

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
  const [number, setNumber] = useState(1); // 상품 수량의 기본값은 1개다. 금액계산해야지

  // (1)가격 label의 ref, (2)map 함수의 idx, (3) 상품의 기본 판매가
  // 4)부모 컴포넌트로 보낼 상품개수 setState, (5) 최대 주문 수량
  const { priceRef, idx, price, setBuyCounts, maxBuyCounts } = props;

  // 수량이 바뀌면 부모컴포넌트에서 가져온 가격표도 바뀌어야겠지?
  useEffect(() => {
    const newPrice = common.comma(common.uncomma(price) * number);
    const newPoint = `(${String(Math.round(Number(common.uncomma(price)) / 100) * number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P)`;
    priceRef.current[idx].textContent = `${newPrice}원 ${newPoint}`;
    setBuyCounts((prev) => {
      const newState = [...prev];
      newState[idx] = number;
      return newState;
    });
  }, [number]);

  return (
    <CustomInputNumber>
      <div className="wrapper">
        <label
          className="minus"
          onClick={() => {
            if (number > 1) {
              setNumber(number - 1);
            }
          }}
        >
          --
        </label>
        <input
          ref={ref}
          type="number"
          className="order-number"
          value={number}
          onChange={(e) => {
            if (e.target.value > 0 && e.target.value <= Number(maxBuyCounts)) {
              setNumber(Number(e.target.value));
            }
          }}
        />
        <label
          className="plus"
          onClick={() => {
            if (number < Number(maxBuyCounts)) {
              setNumber(number + 1);
            }
          }}
        >
          +
        </label>
      </div>
    </CustomInputNumber>
  );
});
NumberCustom.displayName = 'NumberCustom';

NumberCustom.propTypes = {
  priceRef: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
  setBuyCounts: PropTypes.func.isRequired,
  maxBuyCounts: PropTypes.string.isRequired,
};

export default NumberCustom;
