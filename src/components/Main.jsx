import MainSlideImage from "./MainSlideImage";
import styled from "styled-components";

const ContainerDiv = styled.div`
  max-width: 1100px;
  min-width: 900px;
  width: 1100px;
  height: 180px;
  margin: 40px auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const ItemDiv = styled.div`
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
    font-size: 11px;
    color: gray;
  }
`;

const Main = () => {
  return (
    <div>
      <MainSlideImage />
      <ContainerDiv>
        <ItemDiv $boxColor="black">
          <div className={"colorBox"} />
          <p className={"title"}>POOMZIL BAD</p>
          <p className={"subtitle"}>WORST POOMZIL</p>
          <p className={"contents"}>
            흠 있는 저희의 상품을
            <br />
            자신있게 여러분께 선보입니다
          </p>
        </ItemDiv>
        <ItemDiv $boxColor={"rgba(39, 255, 172, 0.753)"}>
          <div className={"colorBox"} />
          <p className={"title"}>SPEED OF DELIVERY</p>
          <p className={"subtitle"}>TAKES A LONG TIME</p>
          <p className={"contents"}>
            상품을 조심히 다뤄야 하기에,
            <br />
            배송에 오랜 시간이 걸립니다.
          </p>
        </ItemDiv>
        <ItemDiv $boxColor="blue">
          <div className={"colorBox"} />
          <p className={"title"}>NO REFUNDS</p>
          <p className={"subtitle"}>NEVER. NEVER.</p>
          <p className={"contents"}>
            '환불/교환 하지 않습니다.'
            <br />
            '환불/교환 해주지 않습니다.'
          </p>
        </ItemDiv>
        <ItemDiv $boxColor="green">
          <div className={"colorBox"} />
          <p className={"title"}>COST REDUCTION</p>
          <p className={"subtitle"}>BUT EXPENSIVE</p>
          <p className={"contents"}>
            '원가를 절감했습니다.'
            <br />
            '상품의 가격은 소폭 상승하였습니다.'
          </p>
        </ItemDiv>
      </ContainerDiv>
    </div>
  );
};

export default Main;
