import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import '../css/slick.css';
import '../css/slick-theme.css';

const Image = styled.img`
  margin: auto;
  width: 1103px;
  height: 612px;
`;

const MainSlideImage = () => {
  const settings = {
    slide: 'div', //슬라이드 되어야 할 태그 ex) div, li
    dots: true, //슬라이드 밑에 점 보이게(페이지네이션 여부)
    infinite: true, //무한 반복 옵션
    speed: 500, //다음 버튼 누르고 다음 슬라이드 뜨는 시간(ms)
    slidesToShow: 1, //한 화면에 보여질 컨텐츠 개수
    slidesToScroll: 1, //스크롤 한번에 움직일 컨텐츠 개수
    autoplay: true, //자동 스크롤 사용 여부
    autoplaySpeed: 10000, //자동 스크롤 시 다음 슬라이드 뜨는 시간(ms)
    vertical: false, //세로 방향 옵션 true:세로, false:가로
    arrows: true, //옆으로 이동하는 화살표 표시 여부
    prevArrow: <img src={`${process.env.PUBLIC_URL}/images/left-arrow.png`} />,
    nextArrow: <img src={`${process.env.PUBLIC_URL}/images/right-arrow.png`} />,
    dotsClass: 'slick-dots', //아래 나오는 점(페이지네이션) css class 지정
    dragable: 'true', //드래그 가능 여부
  };

  return (
    <div>
      <Slider {...settings}>
        <div>
          <Image src={process.env.PUBLIC_URL + '/images/sale.jpg'} />
        </div>
        <div>
          <Image src={process.env.PUBLIC_URL + '/images/image02.jpg'} />
        </div>
        <div>
          <Image src={process.env.PUBLIC_URL + '/images/image03.jpg'} />
        </div>
      </Slider>
    </div>
  );
};

export default MainSlideImage;
