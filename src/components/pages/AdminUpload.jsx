/* 이 파일은 Admin(관리자) 전용 화면입니다. */
/* 컴포넌트 이름이 긴 것은 어쩔 수 없습니다 ^^ */

import React, { useState } from 'react';
import styled from 'styled-components';
import { fireStore, storage } from '../../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

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

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-flow: row nowrap;
  align-items: center;
  width: 85%;
  margin: 0 auto;
`;

// 상품가격(KRW) 입력란 inline-style
const price_input_style = {
  borderBottom: '2px solid #999',
  width: '250px',
  marginBottom: '-5px',
};

const AdminUpload = () => {
  const itemsCollectionRef = collection(fireStore, 'shopping_items');
  const [percent, setPercent] = useState(0);
  const [imgURL, setImgURL] = useState('');
  const [Content, setContent] = useState('');
  const [Uploadfile, setUploadfile] = useState([]);
  const [showImages, setShowImages] = useState([]);

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
      <FlexContainer>
        {/* 상품명, 상품 요약설명 div */}
        <div className="item_info_section">
          <br />
          <CustomLabel htmlFor="ITEMS_NAME">상품명</CustomLabel>
          <br />
          <InputText id="ITEMS_NAME" width="300px" placeholder="상품명은 2~20자입니다" />
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
          />
        </div>

        {/* 대표 이미지 업로드 div*/}
        <div
          style={{
            position: 'relative',
            border: '2px solid #999',
            width: '303px',
            height: '270px',
          }}
        >
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
            style={{ position: 'absolute', bottom: '11px', left: '20px', width: '55%' }}
          />
        </div>
      </FlexContainer>

      {/* 상품 가격 입력 div*/}
      <div style={price_input_style}>
        <CustomLabel htmlFor="ITEMS_PRICE">상품 가격</CustomLabel>
        <CustomLabel style={{ fontSize: '12.5px' }}> (KRW)</CustomLabel>
        <br />
        <CustomLabel style={{ fontSize: '12.5px' }}>(KRW)</CustomLabel>
        <InputText id="ITEMS_PRICE" style={{ borderBottom: 'none', marginLeft: '5px' }} />
      </div>
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
      <CustomLabel>사이즈</CustomLabel>
      <CustomLabel>
        <input type="checkbox" name="ITEM_SIZE" value="S" />S
      </CustomLabel>
      <CustomLabel>
        <input type="checkbox" name="ITEM_SIZE" value="M" />M
      </CustomLabel>
      <CustomLabel>
        <input type="checkbox" name="ITEM_SIZE" value="L" />L
      </CustomLabel>
      <CustomLabel>
        <input type="checkbox" name="ITEM_SIZE" value="XL" />
        XL
      </CustomLabel>
      <CustomLabel>
        <input type="checkbox" name="ITEM_SIZE" value="FREE" />
        FREE
      </CustomLabel>
      <br />
      <CustomLabel htmlFor="ITEMS_COLOR">상품 색상</CustomLabel>
      <input type="color" id="ITEMS_COLOR" />
      <br />
      <CustomLabel htmlFor="ITEMS_MADEIN">MADE IN</CustomLabel>
      <InputText id="ITEMS_MADEIN" />
      <br />
      <br />
      <button onClick={addItems}>추가하기</button>
    </div>
  );
};

export default AdminUpload;
