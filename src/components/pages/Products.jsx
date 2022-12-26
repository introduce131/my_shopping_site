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
  margin: 70px auto;
`;

const ItemDetailContentDiv = styled.div`
  flex: 1 1 50%;
  & > img {
    width: 500px;
    height: 600px;
  }

  & > .colorBox {
    width: 24px;
    height: 5px;
    border: 1px solid lightgray;
    background-color: ${(props) => props.$boxColor};
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
          {Item.ITEMS_NAME}
          <br />
          <div className={'colorBox'} />
          <br />
          <br />
          {Item.ITEMS_PRICE}
          <br />
          {Item.ITEMS_FABRIC}
          <br />
          {Item.ITEMS_SIZE}
          <br />
          {Item.ITEMS_MADEIN}
          <br />
          {Item.ITEMS_CONTENTS}
          <br />
        </ItemDetailContentDiv>
      </ItemDetailContainerDiv>
    </div>
  );
}

export default Products;
