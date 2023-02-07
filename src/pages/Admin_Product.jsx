/* 이 파일은 '상품 관리' 화면입니다. */
/* Admin - Product */
import React, { useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Swal from 'sweetalert2';
import * as common from '../common.js';
import Editor from '../components/Editor.jsx';
import Option from '../components/Option.jsx';
import LeftMenuBar from '../components/LeftMenuBar.jsx';
import RightMenuBar from '../components/RightMenuBar.jsx';
import CustomGrid from '../components/CustomGrid.jsx';
import { useEffect } from 'react';

// 전역 스타일링
const GlobalStyle = createGlobalStyle`
  body {
    background-color: rgb(243,243,243);
  }
`;

// 커스텀 Label
const CustomLabel = styled.label`
  font-family: 'GmarketSans', sans-serif;
  color: rgb(100, 100, 100);
  font-size: 14.5px;
  font-weight: 400;
`;

// "옵션 추가" Label
const AddOptionList = styled(CustomLabel)`
  color: rgb(61, 210, 186);
  &:hover {
    color: rgb(80, 230, 206);
  }
`;

// "이미지 추가" "이미지 저장" Label
const AddImageLabel = styled(CustomLabel)`
  color: rgb(61, 210, 186);
  &:hover {
    color: rgb(80, 230, 206);
  }
`;

// TextArea 커스텀
const InputTextArea = styled.textarea`
  font-family: 'GmarketSans', sans-serif;
  outline-style: none;
  background-color: white;
  rows: ${(props) => props.rows};
  cols: ${(props) => props.cols};
  border: 2px solid #999;
  overflow: hidden;
  resize: none;
  margin-top: 7px;
`;

// Input type = "text" 커스텀
const InputText = styled.input.attrs({ type: 'text', spellCheck: 'false' })`
  font-family: 'GmarketSans', sans-serif;
  height: auto;
  width: ${(props) => props.width};
  line-height: normal;
  padding: 0.5em 0.5em;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 2px solid #999;
  outline-style: none;
  background-color: white;
`;

const ItemInfoFlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row nowrap;
  align-items: center;
  width: 65%;
  min-width: 700px;
  margin: 0 auto;

  /* 상품명, 상품요약설명, 재질 */
  & > .item_info_section {
    position: relative;
    background-color: white;
    padding: 0 10px 10px 10px;
    border: 2px solid #999;
    width: 52%;
  }

  /* 대표이미지 */
  & > .image_upload_section {
    position: relative;
    border: 2px solid #999;
    height: 282px;
    width: 40%;
    background-color: white;
    padding: 0 10px 10px;

    /* 이미지 미리보기 */
    .image_preview_section {
      position: absolute;
      left: 0;
      top: 20%;
      display: flex;
      justify-content: space-around;
      width: 100%;
      height: 45%;

      /* 미리보기 이미지[아이템]에 적용될 스타일 */
      .image_preview_item {
        position: relative;
        border: 2px solid black;

        /* 각각의 이미지 사이즈 */
        .image_size {
          width: 128px;
          height: 128px;
        }
      }
    }
  }

  @media screen and (max-width: 1100px) {
    width: 750px;

    .item_info_section {
      width: 375px;
    }
    .item_info_section {
      width: 375px;
    }
  }
`;

// 상품 상세설명
const ItemsDetailDiv = styled.div`
  position: relative;
  width: 65%;
  background-color: white;
  margin: 15px auto;
  height: auto;
  border: 2px solid #999;

  @media screen and (max-width: 1100px) {
    width: 750px;
  }
`;

// 상품가격(KRW), 할인 전 가격(KRW)
const PriceInputContainer = styled.div`
  width: 65%;
  margin: auto;
  background-color: white;
  position: relative;
  border: 2px solid #999;

  & > .price_input_box {
    display: inline-block;
    width: 40%;
    margin 10px 0px 10px 0px;
    border-bottom: 2px solid #999;
  }

  & > .price_input_style {
    width: 250px;
    margin-bottom: -5px;
  }

  @media screen and (max-width: 1100px) {
    width: 750px;
  }
`;

const OptionInputContainer = styled.div`
  position: relative;
  border: 2px solid #999;
  margin: 0 auto;
  width: 65%;
  background-color: white;

  @media screen and (max-width: 1100px) {
    width: 750px;
  }
`;

// 상품 요약 설명, 상품 재질 설명 부분
const ContentContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

/* 저장 버튼, rightMenuBar.jsx에서 따로 저장버튼만 빼옴 */
const AddItemsButton = styled.button`
  position: absolute;
  top: 7px;
  right: 25px;
  width: 4%;
  z-index: 1;
  height: 25px;
  border: none;
  font-weight: 600;
  background-color: white;
  color: rgb(61, 210, 186);
  border: 1px solid rgb(61, 210, 186);

  &:hover {
    color: rgb(80, 230, 206);
  }

  @media screen and (max-width: 1350px) {
    display: none;
  }
`;

const Admin_Product = () => {
  const [percent, setPercent] = useState(0); // [대표이미지] [사진 업로드] 진행 퍼센트
  const [imgURL, setImgURL] = useState(''); // [대표이미지] [사진 업로드] 이미지를 성공적으로 저장 후, firebase에서 이미지 url을 받고 저장하는 state
  const [Uploadfile, setUploadfile] = useState([]); // [대표이미지] upload할 2개의 파일을 저장하는 state
  const [showImages, setShowImages] = useState([]); // [대표이미지] [이미지추가] 후 화면에 미리볼 이미지를 저장할 state
  const [firstOptionData, setFirstOptionData] = useState([]); // [옵션] 사이즈 옵션을 저장할 state
  const [SecondOptionData, setSecondOptionData] = useState([]); // [옵션] 색상 옵션을 저장할 state
  const [dataList, setDataList] = useState([]); // [옵션] 위 2개의 데이터를 받아 가공하여 테이블에 뿌려줄 데이터[{..}{..}]를 받아오는 state
  const [header, setHeader] = useState({ first: '', second: '' });
  const [urlData, setUrlData] = useState([]); // [상세설명]에 총 저장된 이미지 url을 저장하는 state
  const [childRef, setChildRef] = useState([]);
  /*--------------reference는 아래에 선언--------------*/
  const itemNameRef = useRef(); // [상품명]
  const itemSmryRef = useRef(); // [상품 요약 설명]
  const itemFbrcRef = useRef(); // [재질]
  const itemEditRef = useRef(); // [ReactQull]
  const itemPrceRef = useRef(); // [상품 가격]
  const itemCostRef = useRef(); // [할인 이전 가격(원가)]
  const firstOptRef = useRef(); // [옵션명1]
  const secndOptRef = useRef(); // [옵션명2]
  const gridRef = useRef();

  useEffect(() => {
    //Swal.fire('커스터마이징 alert');
  }, []);

  // 자식 컴포넌트에서 사용하는 ref를 긁어오는 함수
  const addChildRef = (childRef) => {
    setChildRef((prev) => [...prev, childRef]);
  };

  // 천단위 콤마, 숫자만 입력받게 input에 적용하는 핸들러 함수
  const handleChange = (event) => {
    event.target.value = common.addCommas(common.removeNonNumeric(event.target.value));
  };

  // Editor.jsx(자식 컴포넌트)에서 저장된 이미지 url 배열을 가져옴
  const getUrlData = (data) => {
    setUrlData(data);
  };

  // Option.jsx(자식 컴포넌트)에서 첫번째 option값을 가져옴
  const getFirstOptionData = (data) => {
    setFirstOptionData(data);
  };

  // Option.jsx(자식 컴포넌트)에서 두번째 option값을 가져옴
  const getSecondOptionData = (data) => {
    setSecondOptionData(data);
  };

  // 이미지 상대경로 저장
  const handleAddImages = (event) => {
    const imageList = event.target.files;
    let imageUrlLists = []; //초기화 해주자

    // createObjectURL로 url을 호출하면 revoke를 통해 제거해야함
    // 아니면 시스템 상 메모리 누수된다는데..
    for (let i = 0; i < imageList.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageList[i]);
      imageUrlLists.push(currentImageUrl);
    }

    // 파일 2개이상 선택 시 배열에서 제거해버림
    if (imageUrlLists.length > 2) {
      alert('파일은 2개까지 선택 가능합니다. 순서대로 선택한 2개파일만 적용됩니다.');
      imageUrlLists = imageUrlLists.slice(0, 2);
    }

    setShowImages(imageUrlLists);
    setPercent(0); //progress 0으로 초기화하기

    //createObjectURL 파기해버렸읍니다..
    for (let i = 0; i < imageList.length; i++) {
      URL.revokeObjectURL(imageList[i]);
    }
  };

  //이미지 옆 삭제버튼 클릭
  const handleDeleteImage = (id) => {
    setShowImages(showImages.filter((_, index) => index !== id));
    setUploadfile(Array.from(Uploadfile).filter((_, index) => index !== id));
  };

  // [이미지 추가] 클릭 시,
  const handleUpload = async (file) => {
    // 파일이 없으면 경고, 있으면 imageFileUpload 함수 호출해서 fireStorage에 저장
    let url = [];
    if (file.length > 0) {
      for (let i = 0; i < file.length; i++) {
        url[i] = await common.imageFileUpload(file[i], `files/${file[i].name}`);
      }
    } else {
      Swal.fire({ icon: 'error', text: '이미지 파일을 먼저 선택해주세요' });
    }
    setImgURL(url);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* 전역 스타일링 적용 */}
      <GlobalStyle />

      {/* 왼쪽 Nav 관리자 메뉴 */}
      {/* <LeftMenuBar /> */}

      {/* 저장 버튼 */}
      <AddItemsButton
        onClick={async () => {
          const parentRef = [
            itemNameRef.current,
            itemSmryRef.current,
            itemFbrcRef.current,
            imgURL,
            itemEditRef.current,
            itemPrceRef.current,
            itemCostRef.current,
            common.returnOptionData(gridRef),
          ];

          const uploadArray = [...parentRef, ...childRef[0].current];
          const result = await common.uploadData(uploadArray);
          Swal.fire(result);
        }}
      >
        저장
      </AddItemsButton>

      {/* 오른쪽 Nav, 카테고리, 원산지, 제조사, 브랜드, 상품상태, 구매설정*/}
      <RightMenuBar onRef={addChildRef} />

      <ItemInfoFlexContainer>
        {/* [상품명], [상품 요약설명] [재질] */}
        <div className="item_info_section">
          <br />
          <CustomLabel htmlFor="ITEMS_NAME">상품명</CustomLabel>
          <br />
          <InputText
            id="ITEMS_NAME"
            width="95%"
            placeholder="상품명은 2~20자입니다"
            autoComplete="off"
            ref={itemNameRef}
          />
          <br />
          <br />
          <CustomLabel htmlFor="ITEMS_CONTENTS">상품 요약 설명</CustomLabel>
          <br />
          <CustomLabel
            style={{ position: 'absolute', left: '52.5%', top: '30.5%' }}
            htmlFor="ITEMS_FABRIC"
          >
            재질
          </CustomLabel>
          <ContentContainer>
            <InputTextArea
              id="ITEMS_CONTENTS"
              onKeyPress={(e) => {
                common.limitTextAreaLine(e, 10);
              }}
              placeholder="요약 설명은 최대 10줄입니다."
              rows="10"
              cols="10"
              style={{ width: '47%' }}
              ref={itemSmryRef}
            />
            <InputTextArea
              placeholder="재질 설명은 최대 10줄입니다."
              id="ITEMS_FABRIC"
              onKeyPress={(e) => {
                common.limitTextAreaLine(e, 10);
              }}
              rows="5"
              cols="10"
              style={{ width: '47%' }}
              ref={itemFbrcRef}
            />
          </ContentContainer>
        </div>

        {/* [대표이미지] 업로드 */}
        <div className="image_upload_section">
          <CustomLabel style={{ position: 'absolute', top: '10px', left: '10px' }}>
            대표 이미지
          </CustomLabel>
          <AddImageLabel
            style={{ position: 'absolute', top: '10px', right: '10px' }}
            htmlFor="input-file"
            onChange={handleAddImages}
          >
            <input
              id="input-file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setUploadfile(e.target.files);
              }}
              multiple
              style={{ display: 'none' }}
            />
            이미지 추가
          </AddImageLabel>
          {/* [대표이미지] 이미지 미리보기 */}
          <div className="image_preview_section">
            {showImages.map((image, id) => (
              <div key={id} className="image_preview_item">
                <img src={image} className="image_size" />
                <img
                  src={process.env.PUBLIC_URL + '/images/delete-image.png'}
                  style={{
                    position: 'absolute',
                    top: '3px',
                    right: '3px',
                    width: '20px',
                    height: '20px',
                  }}
                  onClick={() => handleDeleteImage(id)}
                />
              </div>
            ))}
          </div>
          <br />
          <CustomLabel style={{ position: 'absolute', top: '77%', left: '5%' }}>
            미리보기 사진은 최대 2장까지 가능합니다.
          </CustomLabel>
          <br />
          <AddImageLabel
            style={{ position: 'absolute', bottom: '10px', right: '10px' }}
            onClick={() => handleUpload(Uploadfile)}
          >
            사진 업로드
          </AddImageLabel>
          <progress
            id="img_upload_prgs"
            value={percent}
            min="0"
            max="100"
            style={{
              position: 'absolute',
              bottom: '11px',
              left: '20px',
              width: '60%',
            }}
          />
        </div>
      </ItemInfoFlexContainer>

      {/* 상품 상세설명 */}
      <ItemsDetailDiv>
        <CustomLabel
          style={{
            position: 'absolute',
            top: '7px',
            left: '7px',
          }}
        >
          상세 설명
        </CustomLabel>
        <br />
        <Editor ref={itemEditRef} getUrlData={getUrlData} />
      </ItemsDetailDiv>

      {/* 상품 가격 입력 div*/}
      <PriceInputContainer>
        <CustomLabel style={{ position: 'absolute', top: '7px', left: '7px' }}>가격</CustomLabel>
        <br />
        <div className="price_input_box" style={{ marginLeft: '15px' }}>
          <CustomLabel htmlFor="ITEMS_PRICE">상품 가격</CustomLabel>
          <CustomLabel style={{ fontSize: '12.5px' }}> (KRW)</CustomLabel>
          <br />
          <CustomLabel style={{ fontSize: '12.5px' }}>(KRW)</CustomLabel>
          <InputText
            id="ITEMS_PRICE"
            style={{ borderBottom: 'none', marginLeft: '5px' }}
            autoComplete="off"
            onChange={handleChange}
            maxLength="10"
            width="78%"
            ref={itemPrceRef}
          />
        </div>
        <div className="price_input_box" style={{ marginLeft: '120px' }}>
          <CustomLabel htmlFor="ITEMS_PRICE_SALE">할인 이전 가격</CustomLabel>
          <CustomLabel style={{ fontSize: '12.5px' }}> (KRW)</CustomLabel>
          <br />
          <CustomLabel style={{ fontSize: '12.5px' }}>(KRW)</CustomLabel>
          <InputText
            id="ITEMS_PRICE_SALE"
            style={{ borderBottom: 'none', marginLeft: '5px' }}
            autoComplete="off"
            onChange={handleChange}
            maxLength="10"
            width="78%"
            ref={itemCostRef}
          />
        </div>
      </PriceInputContainer>
      <br />

      {/* 옵션 입력 div */}
      <OptionInputContainer>
        <CustomLabel style={{ position: 'absolute', top: '7px', left: '7px' }}>옵션</CustomLabel>
        <br />
        <Option ref={firstOptRef} getOptionData={getFirstOptionData} />
        <Option ref={secndOptRef} getOptionData={getSecondOptionData} />
        <br />
        {/* 옵션 추가 Label */}
        <AddOptionList
          onClick={() => {
            // 클릭 시, 1,2번째는 옵션 객체배열, 3,4번째는 옵션명, 5번째는 상품가격
            const data = common.optionDataList(firstOptionData, SecondOptionData, itemPrceRef);
            data ? setDataList(data) : alert('옵션값을 먼저 넣어주세요');
            setHeader({ first: firstOptRef.current.value, second: secndOptRef.current.value });
          }}
          style={{ position: 'absolute', top: '190px', right: '30px' }}
        >
          옵션 추가
        </AddOptionList>
        <br />
        <CustomGrid header={header} dataList={dataList} ref={gridRef} />
      </OptionInputContainer>
      <br />
      <br />
      <br />
      {/* 상품 재질 입력란 */}
      <br />
      <br />
      <button
        onClick={() => {
          const quillImgArray = common.returnEditorImg(itemEditRef);
          common.deleteServerImage(quillImgArray, urlData);
        }}
      >
        에디터 ref 콘솔에 출력하기
      </button>
    </div>
  );
};

export default Admin_Product;
