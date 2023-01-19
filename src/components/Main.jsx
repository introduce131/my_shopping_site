import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import MainSlideImage from './MainSlideImage';
import styled from 'styled-components';
import { fireStore } from '../../src/firebase'; //firebase.js에서 내보낸 fireStore
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { useState } from 'react';

// Slider 세팅
const settings = {
  slide: 'div', //슬라이드 되어야 할 태그 ex) div, li
  dots: true, //슬라이드 밑에 점 보이게(페이지네이션 여부)
  rows: 2, //세로로 몇줄할건지 정하는 옵션
  slidePerRow: 4, //slidesToShow, Scroll 과 같은 옵션인것 같다.
  infinite: true, //무한 반복 옵션
  speed: 1000, //다음 버튼 누르고 다음 슬라이드 뜨는 시간(ms)
  slidesToShow: 4, //한 화면에 보여질 컨텐츠 개수
  slidesToScroll: 4, //스크롤 한번에 움직일 컨텐츠 개수
  autoplay: true, //자동 스크롤 사용 여부
  autoplaySpeed: 7500, //자동 스크롤 시 다음 슬라이드 뜨는 시간(ms)
  vertical: false, //세로 방향 옵션 true:세로, false:가로
  arrows: true, //옆으로 이동하는 화살표 표시 여부
  dotsClass: 'slick-dots', //아래 나오는 점(페이지네이션) css class 지정
  dragable: 'true', //드래그 가능 여부
};

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

const StyledSlider = styled(Slider)`
  max-width: 1100px;
  min-width: 900px;
  width: 1100px;
  height: 650px;
  margin: 35px auto;

  & img {
    width: 230px;
    height: 315px;
    margin: 0 auto 15px auto;
  }

  & img:hover {
    opacity: 0.7;
    cursor: pointer;
  }

  .slick-dots {
    bottom: -25px;
  }
`;

const SiteIntroBox = () => {
  return (
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
    </ContainerIntroDiv>
  );
};

const Main = () => {
  /** fireStore의 collection에서 "shopping_itmes" 라는 document를 찾아서 저장된 값 */
  const itemsRef = collection(fireStore, 'shopping_items');
  /** query메서드를 사용할 때, 인수 1번째는 document, 2번째는 where절
   *  한주간의 인기상품만 보이게 조건 적용 */
  const resultQuery = query(itemsRef, where('ITEMS_SHOWMAIN', '==', 'O'));
  const [ItemsList, setItemsList] = useState([]);

  // 첫 Loading시에만 적용
  useEffect(() => {
    const TmpItemList = [];
    const getItems = async () => {
      const data = await getDocs(resultQuery);
      data.forEach((doc) => {
        const itemObj = doc._document.data.value.mapValue.fields;
        const DOCUMENT_ID = { stringValue: doc.id };
        itemObj.DOCUMENT_ID = DOCUMENT_ID;
        TmpItemList.push(doc.data());
        setItemsList(TmpItemList);
      });
    };
    getItems();
  }, []);

  return (
    <div>
      <MainSlideImage /> {/*메인화면을 장식할 slide*/}
      <SiteIntroBox /> {/*사이트 소개.Box 4개 flex로 작성*/}
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
        한 주간의 인기상품을 만나보세요
      </p>
      {/*1-1 End..*/}
      <StyledSlider {...settings}>
        {ItemsList.map((ele, idx) => (
          <div key={idx}>
            <Link to={`/products/${ele['DOCUMENT_ID']}`}>
              <img src={ele['ITEMS_IMGURL']} alt="" />
            </Link>
          </div>
        ))}
      </StyledSlider>
    </div>
  );
};

export default Main;
