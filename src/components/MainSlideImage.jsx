function MainSlideImage() {
  const MainImageCnt = 7;

  for (let i = 0; i < MainImageCnt; i++) {
    var newInputRadio = document.createElement("input");
    newInputRadio.setAttribute("type", "radio");
    newInputRadio.setAttribute("name", "slide");
    newInputRadio.setAttribute("id", `slide0${i}`);
  }

  <div className="section"></div>;
}

export default MainSlideImage;
