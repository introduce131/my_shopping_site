import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { fireStore } from '../firebase.js';
import * as common from '../common.js';
import Header from '../components/Header.jsx';

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
        height: 6px;
        border: 1px solid black;
        margin-top: -5px;
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
    padding-left: 20px;
    padding-bottom: 20px;
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
        width: 95%;
        height: 25px;
      }
    }
  }

  & > img {
    width: 500px;
    height: 700px;
    margin-right: 25px;
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
  const param = useParams();
  const [Item, setItem] = useState({});
  const [optionData, setOptionData] = useState([]);

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

  // 첫 렌더링 시에 받아온 PKID를 기준으로 옵션데이터 (사이즈, 색상 등)를 받아온다.
  useEffect(() => {
    const getOption = async () => {
      const optionCollectionRef = collection(fireStore, 'shopping_option_data');
      const optionQuery = query(
        optionCollectionRef,
        where('ITEMS_PKID', '==', Item.ITEMS_PKID || '')
      );
      const optionData = await getDocs(optionQuery);
      optionData.forEach((doc) => {
        // "판매중"인 상품만 가져오기
        let newobj = [doc.data()].filter((data) => data.OPTION_STATUS == 'sale');
        setOptionData((data) => [...data, { ...newobj }]);
      });
    };

    getOption();
  }, [Item]);

  // 첫 렌더링 시에 받아온 옵션데이터를 또 다시 가공한다..이거 맞나 ㅋㅋ
  useEffect(() => {
    console.log('optionData', optionData);
  }, [optionData]);

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
              <select>
                <option value="none">{'======= color 선택 ======='}</option>
                <option value="none">{'--------------------------'}</option>
              </select>
            </div>
            {console.log(optionData)}
            {/* 사이즈 옵션 선택 */}
            <label className="label_title">{'>'} size</label>
            <div className="div_option_section">
              <select>
                <option value="none">{'======= size 선택 ======='}</option>
                <option value="none">{'--------------------------'}</option>
              </select>
            </div>
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
