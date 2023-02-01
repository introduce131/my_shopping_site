import React, { useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as common from '../common.js';

const CustomEditor = styled(ReactQuill)`
  margin: 10px auto;
  width: 95%;
  .ql-container {
    font-size: 16px;
  }
`;

const Editor = React.forwardRef(function optionEditor(props, quillRef) {
  const [quillURL, setQuillURL] = useState([]);

  useEffect(() => {
    // base64 url을 방지하기 위한 이미지 핸들러
    const imageHandler = () => {
      const getEditor = quillRef.current.getEditor();
      const input = document.createElement('input');

      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
      input.onchange = async () => {
        const file = input && input.files ? input.files[0] : null;
        const range = getEditor.getSelection(true); // 현재 커서 위치 저장

        // 서버에 올려질때까지 표시할 로딩 gif
        getEditor.insertEmbed(range.index, 'image', `${process.env.PUBLIC_URL}/images/Loading.gif`);

        try {
          // 파이어베이스 'files/posts' bucket에 올리고 사진을 받아옴.
          const url = await common.imageFileUpload(file, `files/posts/${file.name}`);

          // 정상적으로 업로드 됐다면 로딩 gif 삭제
          getEditor.deleteText(range.index, 1);

          // 받아온 url을 이미지 태그에 삽입
          getEditor.insertEmbed(range.index, 'image', url);

          // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
          getEditor.setSelection(range.index + 1);

          setQuillURL((prev) => [...prev, url]); // 마지막에 url 저장하기
        } catch (e) {
          getEditor.deleteText(range.index, 1); // 에러나면 보여주지 않는다. 당연하지만
        }
      };
    };
    const toolbar = quillRef.current.getEditor().getModule('toolbar');
    toolbar.addHandler('image', imageHandler);
  }, []);

  // 부모 컴포넌트(Admin.jsx)로 저장된 urlData를 보낸다.
  useEffect(() => {
    props.getUrlData(quillURL);
  }, [quillURL]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image'],
          [{ align: [] }, { color: [] }, { background: [] }],
          ['clean'],
        ],
      },
    }),
    []
  );

  return (
    <div>
      <CustomEditor
        ref={quillRef}
        modules={modules}
        onChange={(contents) => {
          console.log(contents);
        }}
      ></CustomEditor>
    </div>
  );
});

export default Editor;

Editor.propTypes = {
  getUrlData: PropTypes.func.isRequired,
};
