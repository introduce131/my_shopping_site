import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { fireStore } from '../firebase.js';
import * as common from '../common.js';
import Header from '../components/Header.jsx';
import NumberCustom from '../components/NumberCustom.jsx';

const ItemDetailContainerDiv = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  max-width: 1100px;
  min-width: 900px;
  width: 1100px;
  margin: 60px auto;
`;

const ItemDetailContentDiv = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 13px;

  /* 상단_값_표시_부분 */
  & > .ITEM_TOP_INFO {
    padding-left: 10px;
    height: 60px;
    width: 95%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    border-top: 2px solid black;
    margin-left: 15px;
    border-bottom: 1px solid lightgray;

    & > .ITEM_TITLE {
      font-size: 16px;
      font-weight: 500;
      color: rgb(20, 20, 20);
    }

    & > .colorBoxContainer {
      display: flex;
      gap: 7px;

      .colorBox {
        width: 20px;
        height: 5px;
        border: 1px solid gray;
        margin-top: -8px;
      }
    }
  }

  /* 기본_정보_값_표시_부분 */
  & > .ITEM_BASIS_INFO {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: row wrap;
    width: 95%;
    padding-left: 20px;
    margin-bottom: 20px;

    & > label {
      flex: 1 1 50%;
      word-wrap: break-word;
      padding-top: 20px;
    }
  }

  /* 상품_설명_값_표시_부분 */
  & > .ITEM_CONTENT_INFO {
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    padding-left: 15px;
    padding-top: 20px;
    padding-bottom: 20px;

    & > label {
      white-space: pre-wrap;
      line-height: 150%;
      color: rgb(110, 110, 110);
    }
  }

  /* 옵션_값_표시_부분 */
  & > .ITEM_OPTION_INFO {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: row wrap;
    width: 95%;
    padding: 0px 15px 20px 15px;
    border-bottom: 1px solid lightgray;

    & > label {
      flex: 1 1 30%;
      word-wrap: break-word;
      padding-top: 20px;
    }

    & > .div_option_section {
      flex: 1 1 70%;
      word-wrap: break-word;
      padding-top: 20px;

      & > select {
        padding-left: 7px;
        width: 95%;
        height: 25px;
        font-size: 0.725rem;
      }
    }
  }

  /* 최소_최대_구매수량_표시_부분 */
  & > .ITEM_BUY_GUIDE_INFO {
    display: flex;
    justify-content: left;
    flex-flow: row wrap;
    width: 95%;
    padding: 0px 20px 10px 10px;
    border-bottom: 1px solid lightgray;

    label {
      font-size: 0.715rem;
      padding-top: 10px;
      color: #555;
    }
  }

  /* 구매할_상품(상품명, 수량, 가격)_표시_부분 */
  & > .ITEM_WILL_BUY_INFO {
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 1px solid lightgray;

    & > .total-section {
      padding: 10px 10px 0px 0px;
      text-align: right;
      border-top: 1px solid lightgray;

      .total-label {
        font-size: 1rem;
      }
    }
  }

  /* 바로구매_장바구니_관싱상품_표시_부분 */
  & > .ITEM_COMMIT_INFO {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-flow: row wrap;
    width: 95%;
    padding: 10px 15px 20px 15px;

    button {
      height: 50px;
      width: 165px;
      border: 2px solid lightgray;
      background-color: white;
      font-size: 0.9rem;
      color: #555;
    }

    button.item_buy {
      height: 50px;
      width: 165px;
      border: 2px solid #444;
      background-color: #444;
      font-size: 0.9rem;
      color: white;
    }

    button:hover {
      background-color: white;
      color: #555;
      border: 2px solid black;
      transition-duration: 0.3s;
    }
  }

  & > img {
    width: 500px;
    height: 700px;
    margin-right: 25px;
  }
`;

const OrderSheet = styled.table`
  border-collapse: separate;
  border-spacing: 0 4px;
  width: 100%;

  & > thead {
    height: 30px;

    td {
      border: 1px solid lightgray;
      padding-left: 10px;
    }
  }

  & > tbody {
    tr {
      height: 30px;
      td {
        padding-left: 8px;

        .order-name {
          display: flex;
          gap: 5px;
          .order-item {
            display: flex;
            align-items: center;
            width: 90%;
            min-height: 17px;
            height: auto;
            padding: 5px 5px 5px 10px;
            background-color: rgb(170, 170, 170);
            border-radius: 2px;
            color: white;
          }
          /* 삭제 버튼 */
          .delete_btn {
            display: block;
            margin: auto 0;
            width: 15px;
            label {
              cursor: pointer;
              padding-bottom: 1px;
              border: 1px solid black;
              display: block;
              height: 12px;
              width: 12px;
              font-size: 0.5rem;
              text-align: center;
            }
          }
        }
      }
      td.order-price {
        font-size: 0.73rem;
      }
    }
  }
`;

const LabelFabric = styled.label`
  white-space: pre-wrap;
`;

const ItemsColorBox = (props) => {
  const colorArray = props.colorRGB.split('^');
  colorArray.pop(); // 마지막 한개 공백이라서 지움
  return (
    <div className="colorBoxContainer">
      {colorArray.map((ele, idx) => (
        <div key={idx} className="colorBox" style={{ backgroundColor: ele }} />
      ))}
    </div>
  );
};

const Products = () => {
  const param = useParams(); // url에 있는 fireStore의 document id 파라미터를 가져오기 위함
  const [Item, setItem] = useState({}); // 서버에서 불러온 Item의 모든 정보를 저장하는 state
  const [buyItems, setBuyItems] = useState([]); // 상품명/상품수/가격을 객체 형태로 저장하는 state array
  const [buyCounts, setBuyCounts] = useState([]); // 자식컴포넌트에 보낼 구매수량 카운트
  const colorRef = useRef(); // [color] select의 ref
  const sizeRef = useRef(); // [size] select의 ref
  const orderCountRef = useRef([]); // [상품수] input number의 ref array
  const priceRef = useRef([]); // [가 격] label의 ref array
  const totalLabelRef = useRef();

  useEffect(() => {
    let sumCount = 0;

    // 구매할 상품수량을 지역변수 subCount에 저장.
    buyCounts.forEach((count) => {
      sumCount += count;
    });

    // 상품 수 X 원가를 해서 상품금액 합계를 sumPrice에 저장.
    const sumPrice = common.comma(common.uncomma(Item.ITEMS_PRICE) * sumCount);

    // 1% 만큼 포인트를 구해서 subPoint에 저장
    const newPoint = String(Math.round(Number(common.uncomma(Item.ITEMS_PRICE)) / 100) * sumCount);
    const sumPoint = newPoint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    totalLabelRef.current.textContent = `TOTAL : ${sumPrice}원 [${sumCount}개] (${sumPoint}P)`;
  }, [buyCounts]);

  // 첫 렌더링 시에만 서버에서 데이터 불러옴
  useEffect(() => {
    const docuId = Object.values(param)[0];
    /** doc(fireStore, collection명, document명)*/
    const docRef = doc(fireStore, 'shopping_items', docuId);
    const getOnlyOneItem = async () => {
      const resultData = await getDoc(docRef); //object
      setItem(resultData.data());
    };
    getOnlyOneItem();
  }, []);

  // state에 orderList를 중복없이 저장하는 함수
  const setOrderList = (e) => {
    if (colorRef.current.value !== 'none') {
      const optionObj = {
        color: colorRef.current.value,
        size: e.target.value,
        price: Item.ITEMS_PRICE,
      };

      const prevArr = [...buyItems];

      // 중복된 오더가 있는지 필터로 체크한다.
      const newArr = prevArr.filter(
        (item) => item.color == optionObj.color && item.size == optionObj.size
      );

      // 중복된 오더 상품이 있다면, 에러 메시지, 없으면 state에 저장
      if (newArr.length > 0) {
        const errorText = `'${optionObj.color}/${optionObj.size}' 상품은 이미 리스트에 있습니다.`;
        Swal.fire({ icon: 'error', text: errorText });
      } else {
        setBuyItems((prev) => [...prev, optionObj]);
      }
    }
  };

  return (
    <div>
      <Header />
      <ItemDetailContainerDiv>
        <ItemDetailContentDiv>
          <img src={Item.ITEMS_IMG1} alt="" />
        </ItemDetailContentDiv>

        <ItemDetailContentDiv $boxColor={Item.ITEMS_COLOR}>
          {/* 상품명, 상품 대표색상 */}
          <div className="ITEM_TOP_INFO">
            <label className="ITEMS_NAME">{Item.ITEMS_NAME}</label>
            <ItemsColorBox colorRGB={Item.ITEMS_COLOR || ''} />
          </div>
          {/* 상품 기본정보 (가격, 포인트, 재질, 사이즈, 색상, madein) */}
          <div className="ITEM_BASIS_INFO">
            <label className="label_title">price</label>
            <label>
              {String(Item.ITEMS_PRICE)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </label>
            <label className="label_title">point</label>
            <label>
              {String(Math.round(Number(common.uncomma(Item.ITEMS_PRICE)) / 100))
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              &nbsp;(1%)
            </label>
            <label className="label_title">fabric</label>
            <LabelFabric>{Item.ITEMS_FABRIC}</LabelFabric>
            <label className="label_title">size</label>
            <label>{common.removeDeli(Item.ITEMS_SIZE || '')}</label>
            <label className="label_title">color</label>
            <label>{common.removeDeli(Item.ITEMS_COLORNAME || '')}</label>
            <label className="label_title">made in</label>
            <label>{Item.ITEMS_MADE}</label>
          </div>
          {/* 상품 간단 설명 */}
          <div className="ITEM_CONTENT_INFO">
            <label>{Item.ITEMS_SUMMARY}</label>
          </div>
          <div className="ITEM_OPTION_INFO">
            {/* 색상 옵션 선택 */}
            <label className="label_title">{'>'} color</label>
            <div className="div_option_section">
              {/* color 선택 select-option */}
              <select
                ref={colorRef}
                onChange={() => {
                  // 사이즈 select 초기화하기.
                  sizeRef.current.value = 'none';
                }}
              >
                <option value="none">{'======= color 선택 ======='}</option>
                <option value="none" disabled>
                  {'--------------------------'}
                </option>
                {(Item.ITEMS_COLORNAME || '')
                  .split('^')
                  .filter((item) => item !== '')
                  .map((item, idx) => (
                    <option key={idx}>{item}</option>
                  ))}
              </select>
            </div>
            {/* 사이즈 옵션 선택 */}
            <label className="label_title">{'>'} size</label>
            <div className="div_option_section">
              {/* size 선택 select-option */}
              <select onChange={setOrderList} ref={sizeRef}>
                <option value="none">{'======= size 선택 ======='}</option>
                <option value="none" disabled>
                  {'--------------------------'}
                </option>
                {(Item.ITEMS_SIZE || '')
                  .split('^')
                  .filter((item) => item !== '')
                  .map((item, idx) => (
                    <option key={idx}>{item}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className="ITEM_BUY_GUIDE_INFO">
            <label>{`최소 주문수량 ${Item.ITEMS_MIN_AMOUNT} 개 이상, 최대 주문 수량은 ${Item.ITEMS_MAX_AMOUNT} 개까지입니다.`}</label>
          </div>
          <div className="ITEM_WILL_BUY_INFO">
            <OrderSheet>
              <thead>
                <tr>
                  <td width="60%">상품명</td>
                  <td width="15%">상품수</td>
                  <td width="25%">가 격</td>
                </tr>
              </thead>
              <tbody>
                {buyItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="order-name">
                        <div className="order-item">
                          <label>{`${item.color}/${item.size}/(교환/반품 불가에 동의)`}</label>
                        </div>
                        <div className="delete_btn">
                          <label>X</label>
                        </div>
                      </div>
                    </td>
                    <td className="order-count">
                      <NumberCustom
                        ref={(ref) => {
                          orderCountRef.current[idx] = ref;
                        }}
                        priceRef={priceRef}
                        idx={idx}
                        price={Item.ITEMS_PRICE}
                        setBuyCounts={setBuyCounts}
                        maxBuyCounts={Item.ITEMS_MAX_AMOUNT}
                      />
                    </td>
                    <td className="order-price">
                      <label ref={(ref) => (priceRef.current[idx] = ref)}>
                        {`${Item.ITEMS_PRICE}원 (${String(
                          Math.round(Number(common.uncomma(Item.ITEMS_PRICE)) / 100)
                        )
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P)`}
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </OrderSheet>
            <div className="total-section">
              <label className="total-label" ref={totalLabelRef}></label>
            </div>
          </div>
          <div className="ITEM_COMMIT_INFO">
            <button className="item_buy" onClick={() => {}}>
              바로구매
            </button>
            <button>장바구니</button>
            <button>관심상품</button>
          </div>
        </ItemDetailContentDiv>
      </ItemDetailContainerDiv>
    </div>
  );
};

ItemsColorBox.propTypes = {
  colorRGB: PropTypes.string.isRequired,
};

export default Products;
