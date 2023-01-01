import React from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CustomEditor = styled(ReactQuill)`
  width: 70%;
  min-width: 700px;
  margin: 10px auto;
  .ql-container {
    font-size: 16px;
  }
`;

export default function Editor() {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      [{ align: [] }, { color: [] }, { background: [] }],
      ['clean'],
    ],
  };
  return (
    <div>
      <CustomEditor modules={modules}></CustomEditor>
    </div>
  );
}
