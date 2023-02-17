import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
  const { orderCount, setOrderCount } = props;

  return (
    <CustomInputNumber>
      <div className="wrapper">
        <label
          className="minus"
          onClick={() => {
            if (orderCount > 0) {
              setOrderCount(orderCount - 1);
            }
          }}
        >
          --
        </label>
        <input
          ref={ref}
          type="number"
          className="order-number"
          value={orderCount}
          onKeyDown={(e) => {
            console.log(e.target.value);
          }}
          onChange={(e) => {
            if (e.target.value > 0 && e.target.value < 100) {
              setOrderCount(Number(e.target.value));
            }
          }}
        />
        <label
          className="plus"
          onClick={() => {
            if (orderCount < 100) {
              setOrderCount(orderCount + 1);
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
  setOrderCount: PropTypes.func.isRequired,
  orderCount: PropTypes.number.isRequired,
};

export default NumberCustom;
