import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { fireStore } from '../../../src/firebase';
import Header from '../Header';

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

    & > .colorBox {
      width: 20px;
      height: 5px;
      border: 1px solid lightgray;
      margin-top: -5px;
      background-color: ${(props) => props.$boxColor};
    }
  }

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

  & > .ITEM_CONTENT_INFO {
    border-top: 1px solid lightgray;
    padding-left: 15px;
    padding-top: 20px;
    & > label {
      white-space: pre-wrap;
      line-height: 150%;
      color: rgb(110, 110, 110);
    }
  }

  & > img {
    width: 500px;
    height: 700px;
    margin-right: 25px;
  }
`;

function Products() {
  const param = useParams();
  const [Item, setItem] = useState({});

  useEffect(() => {
    const pId = Object.values(param)[0];
    /** doc(fireStore, collection명, document명)*/
    const docRef = doc(fireStore, 'shopping_items', pId);
    const getOnlyOneItem = async () => {
      const resultData = await getDoc(docRef); //object
      setItem(resultData.data());
    };
    getOnlyOneItem();
  }, []);

  return (
    <div>
      <Header />
      <ItemDetailContainerDiv>
        <ItemDetailContentDiv>
          <img src={Item.ITEMS_IMGURL} alt="" />
        </ItemDetailContentDiv>

        <ItemDetailContentDiv $boxColor={Item.ITEMS_COLOR}>
          {/* 상품명, 상품 대표색상 */}
          <div className="ITEM_TOP_INFO">
            <label className="ITEM_TITLE">{Item.ITEMS_NAME}</label>
            <div className={'colorBox'} />
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
              {String(Math.round(Item.ITEMS_PRICE / 100))
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              &nbsp;(1%)
            </label>
            <label className="label_title">fabric</label>
            <label style={{ 'white-space': 'pre-wrap' }}>{Item.ITEMS_FABRIC}</label>
            <label className="label_title">size</label>
            <label>{Item.ITEMS_SIZE}</label>
            <label className="label_title">color</label>
            <label>{Item.ITEMS_COLOR}</label>
            <label className="label_title">made in</label>
            <label>{Item.ITEMS_MADEIN}</label>
          </div>
          {/* 상품 간단 설명 */}
          <div className="ITEM_CONTENT_INFO">
            <label>{Item.ITEMS_CONTENTS}</label>
          </div>
        </ItemDetailContentDiv>
      </ItemDetailContainerDiv>
    </div>
  );
}

export default Products;
