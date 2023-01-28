import React, { useRef, useMemo, useEffect } from 'react';
import styled from 'styled-components';
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

export default React.forwardRef(function Editor(props, ref) {
  const quillRef = useRef();

  useEffect(() => {
    // base64 url을 방지하기 위한 이미지 핸들러
    const imageHandler = () => {
      const input = document.createElement('input');

      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
      input.onchange = async () => {
        const file = input && input.files ? input.files[0] : null;
        const range = quillRef.current.getEditor().getSelection(true); // 현재 커서 위치 저장

        // 서버에 올려질때까지 표시할 로딩 gif
        quillRef.current
          .getEditor()
          .insertEmbed(range.index, 'image', `${process.env.PUBLIC_URL}/images/Loading.gif`);

        try {
          // 파이어베이스 스토리지에 올리고 사진을 받아옴.
          const url = await common.imageFileUpload(file, `temp/${file.name}`);
          quillRef.current.getEditor().deleteText(range.index, 1); // 정상적으로 업로드 됐다면 로딩 gif 삭제
          quillRef.current.getEditor().insertEmbed(range.index, 'image', url); // 받아온 url을 이미지 태그에 삽입
          quillRef.current.getEditor().setSelection(range.index + 1); // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
        } catch (e) {
          quillRef.current.getEditor().deleteText(range.index, 1);
          console.log(e);
        }
      };
    };
    const toolbar = quillRef.current.getEditor().getModule('toolbar');
    toolbar.addHandler('image', imageHandler);
  }, []);

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
      <CustomEditor ref={quillRef} modules={modules}></CustomEditor>
    </div>
  );
});
