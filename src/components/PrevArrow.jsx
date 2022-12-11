import styled from "styled-components";

const prevArrowLabel = styled.img`
  content: url(${process.env.PUBLIC_URL}/images/left-arrow.png);
`;

const PrevArrow = () => {
  return (
    <div>
      <prevArrowLabel />
    </div>
  );
};

export default PrevArrow;
