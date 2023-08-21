import React from 'react';
import styled from 'styled-components';
import { IoCall } from 'react-icons/io5';

const CompanyInfo = () => {
  const Container = styled.div`
    height: 250px;
    border: 1px solid #999;
    display: flex;
    margin: 0 auto;
    justify-content: center;
    width: 1100px;
    border-left: none;
    border-right: none;
    position: relative;

    /* 겹치기용 div임. 유남생? */
    > .bg__container {
      position: absolute;
      top: -0.5%; /* 선 안겹치려고 살짝 위로 뗀거임 */
      height: 250px;
      width: 2500px;
      border: 1px solid #999;
      border-left: none;
      border-right: none;
    }

    > div {
      border-right: 1px solid black;
      border-color: #999;
      text-align: left;
      margin: auto 0;
      height: 180px;
      padding-left: 20px;
      padding-right: 20px;

      /* 서브 타이틀 스타일, CUSTOMER CENTER 같은 */
      > p:first-child {
        margin-bottom: 16px;
        font-size: 0.85rem;
        color: black;
      }

      /* 세부 내용 스타일 */
      > p {
        color: rgb(77, 77, 77);
        font-size: 0.8rem;
        line-height: 14px;
      }
    }

    > div:last-child {
      border-right: none;
    }
  `;

  return (
    <div>
      <Container>
        {/* 이 div는 그냥 겹치기용임. 뒤에 올거임*/}
        <div className="bg__container"></div>
        {/* CUSTOMER CENTER */}
        <div>
          <p className="title">CUSTOMER CENTER</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IoCall size="20" />
            <p style={{ fontSize: '2rem', margin: '0px' }}>1588-0000</p>
          </div>
          <p>평일 오전 11:00 ~ 오후 5:00 / 점심시간 오후 12:30 ~ 오후 1:30</p>
          <p>토 / 일 / 공휴일 휴무</p>
        </div>
        {/* ACCOUT INFO */}
        <div>
          <p className="title">ACCOUNT INFO</p>
          <p>기업 1671425-12-01016</p>
          <p>예금주 : 주식회사 OO</p>
        </div>
        {/* FAVORITE MENU */}
        <div>
          <p className="title">FAVORITE MENU</p>
          <p>로그인 / 회원가입</p>
          <p>관심상품</p>
          <p>장바구니</p>
          <p>주문조회</p>
          <p>마이페이지</p>
        </div>
        {/* RETURN / EXCHANGE */}
        <div>
          <p className="title">RETURN / EXCHANGE</p>
          <p>경기도 광명시 피곤로 피로길 기절빌딩 4층</p>
          <p>자세한 교환·반품절차 안내는 문의란 및 공지사항을 참고해주세요</p>
        </div>
      </Container>
    </div>
  );
};

export default CompanyInfo;
