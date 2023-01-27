import React, { useRef, useMemo } from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CustomEditor = styled(ReactQuill)`
  margin: 10px auto;
  width: 95%;
  .ql-container {
    font-size: 16px;
  }
`;

export default React.forwardRef(function Editor(props, ref) {
  const quillRef = useRef();

  const imageHandler = async () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input && input.files ? input.files[0] : null;
      const range = quillRef.current.getEditor().getSelection(true);
      const formData = new FormData();
      formData.append('image', file);

      console.log(formData);
    };
  };

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
        handlers: { image: imageHandler },
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
