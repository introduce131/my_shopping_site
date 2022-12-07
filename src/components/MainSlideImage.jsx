import styles from "../css/MainSlideImage.module.css";

function MainSlideImage() {
  const MainImageCnt = 7;
  let imgsrc = "";

  // section
  //  └ <div> class(slidewrap)
  //   └ <div> class(slidelist)
  //     └ <ul> class(slidelist)
  //       └ <li>
  //         └ <a>
  //           └ <label> class(left)
  //           └ <img> src="imgsrc.."
  //           └ <label> class(right)
  //       └ <li>
  //         └ <a>
  //           └ <label> class(left)
  //           └ <img> src="imgsrc.."
  //           └ <label> class(right)
  //       └ <li>
  //         └ <a>
  //           └ <label> class(left)
  //           └ <img> src="imgsrc.."
  //           └ <label> class(right)

  //최상위 부모 div class="section"
  let div_ele_section = document.createElement("div");
  div_ele_section.className = styles.section;

  // section의 하위 div class="slidewrap"
  let div_ele_slidewrap = document.createElement("div");
  div_ele_slidewrap.className = styles.slidewrap;

  // slidewrap의 하위 ul class="slidelist"
  let ul_ele_slidelist = document.createElement("ul");
  ul_ele_slidelist.className = styles.slidelist;

  // MainImageCnt만큼 ul slidelist의 하위 li 생성
  // label, img, label > a > li > 순
  for (let cnt = 0; cnt < MainImageCnt; cnt++) {
    let li_ele_default = document.createElement("li");
    let a_ele_default = document.createElement("a");
    let label_ele_left = document.createElement("label");
    let img_ele_default = document.createElement("img");
    let label_ele_right = document.createElement("label");

    //이전 이미지(왼쪽)로 이동
    label_ele_left.className = "left";

    if (cnt === 0) {
      //첫번째 이미지일때 처리방법
      label_ele_left.setAttribute("for", `slide0${MainImageCnt}`); //왼쪽(아이콘)을 누르면 맨 마지막 이미지로 이동
    } else {
      label_ele_left.setAttribute("for", `slide0${cnt}`); //첫번째 이미지가 아니라면 그냥 이전 이미지를 보여준다.
    }

    //현재 순서에 해당하는 이미지 표기
    imgsrc = `/images/image0${cnt + 1}.jpg`;
    img_ele_default.setAttribute("src", "https://source.unsplash.com/random");

    //다음 이미지(오른쪽)로 이동
    label_ele_right.className = "right";
    if (cnt === 6) {
      //마지막 이미지일때 처리방법
      label_ele_right.setAttribute("for", `slide0${MainImageCnt - cnt}`); //오른쪽(아이콘)을 누르면 다시 첫번째 이미지로 이동한다.
    } else {
      label_ele_right.setAttribute("for", `slide0${cnt + 2}`); //마지막 이미지가 아니라면 ? 그냥 다음 이미지를 보여준다.
    }

    //a 태그에 자식요소 (이전, 현재, 다음) 슬라이드 추가
    a_ele_default.appendChild(label_ele_left);
    a_ele_default.appendChild(img_ele_default);
    a_ele_default.appendChild(label_ele_right);

    //li에 a태그를 자식요소로 추가
    li_ele_default.appendChild(a_ele_default);

    //ul에 li태그를 자식요소로 추가. 슬라이드 이미지 끝
    ul_ele_slidelist.appendChild(li_ele_default);
  }

  for (let i = 0; i < MainImageCnt; i++) {
    let newInputRadio = document.createElement("input");
    newInputRadio.setAttribute("type", "radio");
    newInputRadio.setAttribute("name", "slide");
    newInputRadio.setAttribute("id", `slide0${i + 1}`);

    div_ele_section.appendChild(newInputRadio);
  }

  div_ele_slidewrap.appendChild(ul_ele_slidelist);
  div_ele_section.appendChild(div_ele_slidewrap);
  document.body.appendChild(div_ele_section); //마지막 body에 자식노드 추가
}

export default MainSlideImage;
