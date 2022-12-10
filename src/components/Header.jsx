import styles from "../css/Header.module.css";
import MainSlideImage from "./MainSlideImage";

//작대기 3개로 이루어진 전체보기 메뉴 버튼입니더. by Component
function MenuButton() {
  return (
    <div>
      <input type="checkbox" id="menu_icon" />
      <label for="menu_icon">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </label>
    </div>
  );
}

//Header Components Function
function Header() {
  return (
    <div>
      <div id={styles.logo}>c h a r l o t t e</div> {/*로고*/}
      <img
        id={styles.insta_img}
        src="https://www.freepnglogos.com/uploads/instagram-icon-png/black-hd-instagram-icon-simple-black-design-9.png"
        alt=""
      />
      {/* 상단 상품 카테고리 선택 flex container */}
      <div className={styles.menu_container}>
        <div className={styles.menu_item}>
          <MenuButton />
        </div>
        <div className={styles.menu_item}>BEST</div>
        <div className={styles.menu_item}>TOP</div>
        <div className={styles.menu_item}>BOTTOM</div>
        <div className={styles.menu_item}>OUTER</div>
        <div className={styles.menu_item}>SKIRT/OPS</div>
        <div className={styles.menu_item}>ACC</div>
        <div className={styles.menu_item}>SALE</div>
      </div>
    </div>
  );
}

export default Header;
