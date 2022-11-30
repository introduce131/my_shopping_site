import styles from "../css/Header.module.css";
function Header() {
  return (
    <div>
      <div id={styles.logo}>c h a r l o t t e</div> {/*로고*/}
      <img
        id={styles.insta_img}
        src="https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-instagram-icon-download-icons-12.png"
      />
      <div className={styles.menu_container}>
        <div className={styles.menu_item}>TOP</div>
        <div className={styles.menu_item}>BOTTOM</div>
        <div className={styles.menu_item}>OUTER</div>
        <div className={styles.menu_item}>SKIRT/OPS</div>
        <div className={styles.menu_item}>ACC</div>
        <div className={styles.menu_item}>SALE</div>
        <div className={styles.menu_item}>BEST</div>
      </div>
    </div>
  );
}

export default Header;
