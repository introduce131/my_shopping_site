import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as common from '../common.js';
import { useRef } from 'react';
import { useEffect } from 'react';

// 커스텀 Label
const CustomLabel = styled.label`
  font-family: 'GmarketSans', sans-serif;
  color: rgb(100, 100, 100);
  font-size: 14.5px;
  font-weight: 400;
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

// 커스텀 <table>, Grid 대용
const Table = styled.table`
  font-family: 'GmarketSans', sans-serif;
  margin: 0 auto;
  background-color: white;

  /* header, body 다중 선택자 "," */
  & > .header,
  .body {
    width: 100%;

    tr {
      font-size: 1em;

      td {
        padding-top: 3px;
      }
    }
  }

  & > .header td {
    color: rgb(100, 100, 100);
  }

  & > .body tr:hover {
  }

  @media screen and (max-width: 1100px) {
    width: 750px;
  }
`;

// 커스텀 Select, option
const CustomOption = styled.select`
  font-family: 'GmarketSans', sans-serif;
  color: rgb(100, 100, 100);
  font-size: 14.5px;
  font-weight: 400;
  width: 90%;
  height: 100%;
  border: none;
  padding-top: 5px;
  padding-left: 5px;
  margin-left: 7px;
`;

// 커스텀 색상표, 색상-옵션값 앞에 추가할 styled-component
const InputColor = styled.input.attrs({ type: 'color' })`
  appearance: none;
  border: none;
  background-color: white;
  width: 20px;
  height: 20px;
`;

const ContextMenu = styled.div`
  position: absolute;
  border: 1px solid black;
  width: 90px;
  height: 90px;
  font-family: 'GmarketSans', sans-serif;
  font-size: 14.5px;
  display: none;
  background-color: white;
  text-align: center;

  & > ul {
    list-style: none;
    padding: 0px;
    margin: 0px;
    display: flex;
    flex-flow: column nowrap;
    gap: 5px;
    padding-top: 5px;

    li:hover {
      background-color: rgb(222, 222, 222);
    }
  }
`;

const CustomGrid = (props) => {
  const [checkList, setCheckList] = useState([]); //check한 <tr>을 저장하는 state
  const [dataList, setDataList] = useState([]); // props.dataList를 저장할 state
  const contextRef = useRef(); //custom context menu의 ref
  const chkListRef = useRef([]); // checkbox의 ref.배열
  const contextMenuList = [
    { id: 1, item: '삭제하기' },
    { id: 2, item: '삭제하는' },
    { id: 3, item: '방법밖에' },
    { id: 4, item: '없습니다' },
  ]; // context menu에 들어갈 아이템 목록
  const tableRef = useRef();

  // 첫 마운트 시, 받아온 props.dataList를 dataList state에 초기화해준다
  useEffect(() => {
    setDataList([...props.dataList]);
  }, [props.dataList]);

  // 천단위 콤마, 숫자만 입력받게 input에 적용하는 핸들러 함수
  const handleChange = (event) => {
    event.target.value = common.addCommas(common.removeNonNumeric(event.target.value));
  };

  // Grid 오른쪽 마우스 클릭 이벤트
  const tableRightClickEvent = (event) => {
    event.preventDefault();

    contextRef.current.style.top = event.nativeEvent.layerY + 'px';
    contextRef.current.style.left = event.nativeEvent.layerX + 'px';
    contextRef.current.style.display = 'block';
  };

  // Grid 왼쪽 마우스 클릭 이벤트
  const tableLeftClickEvent = () => {
    contextRef.current.style.display = 'none';
  };

  // checkBox onChange 이벤트
  const checkChangedEvent = (e, idx) => {
    const isChecked = e.target.checked; // 체크 상태 확인
    if (isChecked) {
      // 체크하면 배열에 넣고
      setCheckList([...checkList].concat(idx));
    } else {
      // 체크상태가 아니면 배열에서 삭제
      const newArray = [...checkList].filter((ele) => ele !== idx);
      setCheckList(newArray);
    }
  };

  // checkBox 전체선택 onClick 이벤트
  const checkAllClickEvent = (e) => {
    const isAllChecked = e.target.checked; // 체크여부 저장
    let copyArray = [];

    if (isAllChecked) {
      // true, 체크박스 전부 checked, checkList state에도 저장
      for (let i = 0; i < chkListRef.current.length; i++) {
        chkListRef.current[i].checked = true;
        copyArray[i] = i;
      }
      setCheckList(copyArray);
    } else {
      // false, 체크박스 전부 unChecked, checkList state에도 저장
      for (let i = 0; i < chkListRef.current.length; i++) {
        chkListRef.current[i].checked = false;
        copyArray = [];
      }
      setCheckList(copyArray);
    }
  };

  // context menu onClick 이벤트
  const contextMenuOnclick = (item) => {
    switch (item.id) {
      // '삭제하기' 선택
      case 1: {
        let dataArray = [...dataList];

        // dataList와 checkList를 비교하여 데이터 삭제
        for (let i = 0; i < dataArray.length; i++) {
          for (let j = 0; j < checkList.length; j++) {
            if (dataArray[i].id === checkList[j]) {
              dataArray.splice(i, 1);
              i--;
            }
          }
        }
        setDataList([...dataArray]); // state 저장
        setCheckList([]); // checkList 초기화
      } // 삭제하기 End
    }
  };

  // checkList의 비동기 처리를 위한 useEffect
  useEffect(() => {
    console.log(checkList);
  }, [checkList]);

  return (
    <React.Fragment>
      <div style={{ position: 'relative' }}>
        <ContextMenu ref={contextRef} onContextMenu={(e) => e.preventDefault()}>
          <ul>
            {contextMenuList.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  contextMenuOnclick(item);
                }}
              >
                {item.item}
              </li>
            ))}
          </ul>
        </ContextMenu>
        <Table
          style={{ borderSpacing: '10px 5px' }}
          onClick={tableLeftClickEvent}
          onContextMenu={tableRightClickEvent}
        >
          {/* 헤더 */}
          <thead className="header">
            <tr>
              <td width="8%">
                <input type="checkbox" onClick={checkAllClickEvent} />
              </td>
              <td width="12%">{props.header.first}</td>
              <td width="17%">{props.header.second}</td>
              <td width="18%">옵션가격</td>
              <td width="15%">재고 [현]</td>
              <td width="15%">재고 [추가]</td>
              <td width="15%">상태</td>
            </tr>
          </thead>

          {/* 데이터[body] */}
          <tbody className="body" ref={tableRef}>
            {dataList.map((item, idx) => (
              <tr key={idx}>
                {/* [체크박스] */}
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => checkChangedEvent(e, idx)}
                    ref={(ele) => (chkListRef.current[idx] = ele)}
                  />
                </td>
                {/* [사이즈] */}
                <td>{item.size}</td>
                {/* [색상] */}
                <td>
                  <div style={{ paddingBottom: '2px' }}>
                    <InputColor value={item.color} disabled />
                    {item.colorName}
                  </div>
                </td>
                {/* [옵션가격] */}
                <td style={{ borderBottom: '2px solid #999' }}>
                  <CustomLabel style={{ fontWeight: '600' }}>￦</CustomLabel>
                  <InputText
                    width="70%"
                    style={{ borderBottom: 'none' }}
                    autoComplete="off"
                    onChange={handleChange}
                    defaultValue={item.price}
                  />
                </td>
                {/* [ 재고[현] ] */}
                <td style={{ borderBottom: '2px solid #999' }}>
                  <InputText
                    width="70%"
                    style={{ borderBottom: 'none' }}
                    autoComplete="off"
                    defaultValue={item.stockNow}
                    readOnly
                  />
                </td>
                {/* [ 재고[추가] ] */}
                <td style={{ borderBottom: '2px solid #999' }}>
                  <InputText
                    width="60%"
                    style={{ borderBottom: 'none' }}
                    autoComplete="off"
                    onChange={(event) => {
                      event.target.value = common.removeNonNumeric(event.target.value);
                    }}
                    defaultValue={item.stockAdd}
                  />
                </td>
                {/* [상태] */}
                {/* 1:판매중, 2:판매대기, 3:품절 */}
                <td style={{ borderBottom: '2px solid #999' }}>
                  <CustomOption>
                    <option value="1">판매중</option>
                    <option value="2">판매대기</option>
                    <option value="3">품 절</option>
                  </CustomOption>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </React.Fragment>
  );
};

CustomGrid.propTypes = {
  dataList: PropTypes.array.isRequired,
  header: PropTypes.object.isRequired,
};

export default CustomGrid;
