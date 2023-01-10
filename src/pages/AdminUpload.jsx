/* 이 파일은 /admin 화면입니다. */
/* 컴포넌트 이름이 긴 것은 어쩔 수 없습니다 ^^ */
import React, { useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { fireStore, storage } from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import * as common from '../common.js';
import Editor from '../components/Editor.jsx';
import Option from '../components/Option.jsx';
import LeftMenuBar from '../components/LeftMenuBar.jsx';
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
  resize: none;
  margin-top: 7px;
`;

// Input type = "text" 커스텀
const InputText = styled.input.attrs({ type: 'text' })`
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

  & > .item_info_section {
    background-color: white;
    padding: 0 10px 10px 10px;
    border: 2px solid #999;
    width: 41.5%;
  }

  & > .image_upload_section {
    position: relative;
    border: 2px solid #999;
    width: 303px;
    height: 282px;
    background-color: white;
    padding: 0 10px 10px;
  }

  @media screen and (max-width: 1100px) {
    width: 750px;

    .item_info_section {
      width: 312px;
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

const AdminUpload = () => {
  const itemsCollectionRef = collection(fireStore, 'shopping_items');
  const [percent, setPercent] = useState(0);
  const [imgURL, setImgURL] = useState('');
  const [Content, setContent] = useState('');
  const [Uploadfile, setUploadfile] = useState([]);
  const [showImages, setShowImages] = useState([]);
  const [sizeOptionData, setSizeOptionData] = useState([]);
  const [colorOptionData, setColorOptionData] = useState([]);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    console.log(dataList);
  }, [dataList]);

  // Option.jsx(자식 컴포넌트)에서 사이즈 option값을 가져옴
  const getSizeOptionData = (data) => {
    setSizeOptionData(data);
  };

  // Option.jsx(자식 컴포넌트)에서 색상 option값을 가져옴
  const getColorOptionData = (data) => {
    setColorOptionData(data);
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

  // fireStore/Storage 이미지 업로드 함수
  function handleUpload() {
    //파일이 비어있지 않은지 먼저 확인
    if (!Uploadfile[0]) {
      alert('이미지 파일을 먼저 선택해주세요');
    }
    /** <스토리지(저장소) 참조 생성 => 작업하려는 클라우드 파일에 대한 포인터 역할>
     *  firebase/storage에서 ref함수를 가져오고 파라미터로
     *  (저장소 서비스), (파일경로)를 인수로 전달함 */

    // 로직으로 사진은 최대 2장으로 한정했음
    for (let i = 0; i < Uploadfile.length; i++) {
      const storageRef = ref(storage, `files/${Uploadfile[i].name}`);
      /**  uploadBytesResumable()에 인스턴스를 전달하여 업로드 작업을 만듬.*/
      const uploadTask = uploadBytesResumable(storageRef, Uploadfile[i]);

      /** state_changed 이벤트에는 3가지 콜백함수가 있다
       *  1번째 콜백함수 : 업로드 진행 상황 추적, 진행 상태 업로드
       *  2번째 콜백함수 : 업로드 실패 시 오류를 처리
       *  3번째 콜백함수 : 업로드가 완료되면 실행되고, 다운로드 URL을 가져오고 콘솔에 표시
       *                  fireStore 데이터베이스에 저장해도 됨.
       */
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          //퍼센트 값 = 반올림(지금까지 성공적으로 업로드된 byte 수 / 업로드할 총 byte 수)
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

          setPercent(percent);
        },
        (err) => {
          setImgURL(err.code);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setImgURL(url); //imgURL state에 저장
            console.log('이미지 경로', url);
          });
        }
      );
    }
  }

  // 상품추가하기
  const addItems = async () => {
    //이부분 수정해야됨. ITEMS_SHOWMAIN이 전부 O로 나옴 2022-12-27
    const ItemChkShowMain = document.querySelector('input[name=ITEMS_SHOWMAIN]').value;
    const ItemName = document.querySelector('#ITEMS_NAME').value;
    const ItemPrice = document.querySelector('#ITEMS_PRICE').value;
    const ItemFabric = document.querySelector('#ITEMS_FABRIC').value;
    const ItemSizeList = document.querySelectorAll('input[name=ITEM_SIZE]:checked');
    let ItemSize = '';
    ItemSizeList.forEach((chk) => {
      // 사이즈가 2종류 이상이면, "," 구분자 추가
      ItemSizeList > 1 ? (ItemSize += chk.value + ', ') : (ItemSize += chk.value);
    });
    const ItemColor = document.querySelector('#ITEMS_COLOR').value;
    const ItemMadein = document.querySelector('#ITEMS_MADEIN').value;
    const ItemContent = Content; //useState 변수 Content
    const ItemImgURL = imgURL; //useState 변수 imgURL

    try {
      //addDoc("컬렉션에 대한 참조", "데이터가 포함된 Object")
      const _res_ = await addDoc(itemsCollectionRef, {
        ITEMS_NAME: ItemName,
        ITEMS_PRICE: parseInt(ItemPrice),
        ITEMS_FABRIC: ItemFabric,
        ITEMS_SIZE: ItemSize,
        ITEMS_COLOR: ItemColor,
        ITEMS_MADEIN: ItemMadein,
        ITEMS_CONTENTS: ItemContent,
        ITEMS_SHOWMAIN: ItemChkShowMain,
        ITEMS_IMGURL: ItemImgURL,
      });
      console.log('콘텐츠내용', ItemContent);
      //throw new Error('에러발생');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {/* 전역 스타일링 적용 */}
      <GlobalStyle />

      {/* 왼쪽 고정된 Navigation Bar */}
      <LeftMenuBar />

      <ItemInfoFlexContainer>
        {/* 상품명, 상품 요약설명 div */}
        <div className="item_info_section">
          <br />
          <CustomLabel htmlFor="ITEMS_NAME">상품명</CustomLabel>
          <br />
          <InputText
            id="ITEMS_NAME"
            width="95%"
            placeholder="상품명은 2~20자입니다"
            autoComplete="off"
          />
          <br />
          <br />
          <CustomLabel htmlFor="ITEMS_CONTENTS">상품 요약 설명</CustomLabel>
          <br />
          <InputTextArea
            id="ITEMS_CONTENTS"
            onChange={(e) => {
              let contents = e.target.value;
              setContent(contents);
            }}
            placeholder="요약 설명은 최대 10줄입니다."
            rows="10"
            cols="34"
            style={{ width: '97%' }}
          />
        </div>

        {/* 대표 이미지 업로드 div*/}
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
          {showImages.map((image, id) => (
            <div
              key={id}
              style={{
                position: 'relative',
                height: '130px',
                border: '2px solid black',
                marginLeft: '11.5px',
                marginTop: '55px',
                display: 'inline-block',
              }}
            >
              <img src={image} style={{ width: '130px', height: '130px' }} />
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
          <br />
          <CustomLabel style={{ position: 'absolute', top: '77%', left: '5%' }}>
            미리보기 사진은 최대 2장까지 가능합니다.
          </CustomLabel>
          <br />
          <AddImageLabel
            style={{ position: 'absolute', bottom: '10px', right: '10px' }}
            onClick={handleUpload}
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
              width: '55%',
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
        <Editor />
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
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
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
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
          />
        </div>
      </PriceInputContainer>
      <br />

      {/* 옵션 입력 div */}
      <OptionInputContainer>
        <CustomLabel style={{ position: 'absolute', top: '7px', left: '7px' }}>옵션</CustomLabel>
        <br />
        <Option getOptionData={getSizeOptionData} />
        <Option getOptionData={getColorOptionData} />
      </OptionInputContainer>
      <br />
      <button
        onClick={() => {
          const data = common.optionDataList(sizeOptionData, colorOptionData);
          setDataList(data);
        }}
      >
        그리드 추가
      </button>
      <br />
      <CustomGrid />
      <br />
      {/* 상품 재질 입력란 */}
      <CustomLabel htmlFor="ITEMS_FABRIC">재질</CustomLabel>
      <InputTextArea id="ITEMS_FABRIC" rows="5" cols="30" />
      <br />
      {/*  */}
      <CustomLabel htmlFor="ITEMS_SHOWMAIN">
        <input type="checkbox" id="ITEMS_SHOWMAIN" name="ITEMS_SHOWMAIN" value="O" />
        메인화면 추천상품 적용
      </CustomLabel>
      <br />
      <br />
      <br />
      <button onClick={addItems}>추가하기</button>
    </div>
  );
};

export default AdminUpload;
