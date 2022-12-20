import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import MainSlideImage from './MainSlideImage';
import styled from 'styled-components';
import { fireStore } from '../../src/firebase'; //firebase.js에서 내보낸 fireStore
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect } from 'react';

//사이트 소개 Box Contatiner Div (styledComponent)
const ContainerIntroDiv = styled.div`
  max-width: 1100px;
  min-width: 900px;
  width: 1100px;
  height: 180px;
  margin: 40px auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

//사이트 소개 Box Items Div (styledComponent)
const ItemIntroDiv = styled.div`
  width: 230px;
  height: 150px;
  border: 1px solid lightgray;
  padding-left: 25px;

  & > .colorBox {
    margin-top: 25px;
    width: 20px;
    height: 2.5px;
    background-color: ${(props) => props.$boxColor};
  }

  & > .title {
    font-size: 11px;
    color: gray;
  }

  & > .subtitle {
    font-weight: 600;
  }

  & > .contents {
    font-size: 11px;g
    color: gray;
  }
`;

//한주 인기상품 Container Div
const ContainerWeeklyShowDiv = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  border 1px solid black;
`;

//한주 인기상품 Item Div
const ItemWeeklyShowDiv = styled.div`
  flex: 1 1 25%;

  & > img {
    width: 235px;
    height: 300px;
  }
`;

const Main = () => {
  /** fireStore의 collection에서 "shopping_itmes" 라는 document를 찾아서 저장된 값 */
  const itemsRef = collection(fireStore, 'shopping_items');
  /** query메서드를 사용할 때, 인수 1번째는 document, 2번째는 where절
   *  한주간의 인기상품만 보이게 조건 적용 */
  const resultQuery = query(itemsRef, where('ITEMS_SHOWMAIN', '==', 'O'));
  let ItemsList = [];

  // 첫 Loading시에만 적용
  useEffect(() => {
    const getItems = async () => {
      const data = await getDocs(resultQuery);
      data.forEach((doc) => {
        ItemsList.push(doc.data());
      });
      console.log(ItemsList);
    };

    getItems();
  }, []);

  return (
    <div>
      <MainSlideImage /> {/*추천상품 7개 Slide 표시*/}
      {/*사이트 소개.Box 4개 flex로 작성*/}
      <ContainerIntroDiv>
        <ItemIntroDiv $boxColor="black">
          <div className={'colorBox'} />
          <p className={'title'}>POOMZIL BAD</p>
          <p className={'subtitle'}>WORST POOMZIL</p>
          <p className={'contents'}>
            흠 있는 저희의 상품을
            <br />
            자신있게 여러분께 선보입니다
          </p>
        </ItemIntroDiv>
        <ItemIntroDiv $boxColor={'grey'}>
          <div className={'colorBox'} />
          <p className={'title'}>SPEED OF DELIVERY</p>
          <p className={'subtitle'}>TAKES A LONG TIME</p>
          <p className={'contents'}>
            상품을 조심히 다뤄야 하기에,
            <br />
            배송에 오랜 시간이 걸립니다.
          </p>
        </ItemIntroDiv>
        <ItemIntroDiv $boxColor="blue">
          <div className={'colorBox'} />
          <p className={'title'}>NO REFUNDS</p>
          <p className={'subtitle'}>NEVER. NEVER.</p>
          <p className={'contents'}>
            '환불/교환 하지 않습니다.'
            <br />
            '환불/교환 해주지 않습니다.'
          </p>
        </ItemIntroDiv>
        <ItemIntroDiv $boxColor="green">
          <div className={'colorBox'} />
          <p className={'title'}>COST REDUCTION</p>
          <p className={'subtitle'}>BUT EXPENSIVE</p>
          <p className={'contents'}>
            '원가를 절감했습니다.'
            <br />
            '상품의 가격은 소폭 상승하였습니다.'
          </p>
        </ItemIntroDiv>
      </ContainerIntroDiv>{' '}
      {/*사이트 소개 Box..End*/}
      {/* 1. WEEKLY BEST ITEMS 인기상품 16개*/}
      {/* 1-1. 하이퍼링크 적용할 WEEKLY BEST ITEMS */}
      <h2 style={{ textAlign: 'center' }}>WEEKLY BEST ITEMS</h2>
      <p
        style={{
          textAlign: 'center',
          color: '#8A8989',
          marginTop: '-5px',
        }}
      >
        한주간의 인기상품을 만나보세요
      </p>
      {/*1-1 End..*/}
      <ContainerWeeklyShowDiv>
        <Link to="/products">
          <ItemWeeklyShowDiv>
            <img src={`${process.env.PUBLIC_URL}/images/image01.jpg`} />
          </ItemWeeklyShowDiv>
        </Link>
      </ContainerWeeklyShowDiv>
    </div>
  );
};

export default Main;
