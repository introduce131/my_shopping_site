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
  const [number, setNumber] = useState(1);

  const { priceRef, count, idx, price, setBuyCounts, maxBuyCounts } = props;

  useEffect(() => {
    const newPrice = common.comma(common.uncomma(price) * number);
    const newPoint = `(${String(Math.round(Number(common.uncomma(price)) / 100) * number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P)`;

    // 가격 레이블 업데이트
    priceRef.current[idx].textContent = `${newPrice}원 ${newPoint}`;

    // 상품 수량을 부모 컴포넌트로 전달
    setBuyCounts((prev) => {
      const newState = [...prev];
      newState[idx] = number;
      return newState;
    });
  }, [number, price, idx, priceRef, setBuyCounts]);

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
          value={count}
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
  count: PropTypes.number.isRequired,
  idx: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
  setBuyCounts: PropTypes.func.isRequired,
  maxBuyCounts: PropTypes.string.isRequired,
};

export default NumberCustom;
