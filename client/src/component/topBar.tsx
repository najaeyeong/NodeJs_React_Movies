import styles from "./css/TopBar.module.css"

export default function TopBar(){

    return<>
        <script src='./js/topvar.js'></script>
        <div id={styles.menu}>
            <div className={styles.hamburger}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>
            <div className={styles.menu_inner}>
                
                <ul>
                    <li>Menu Item</li>
                    <li>Menu Item</li>
                    <li>Menu Item</li>
                    <li>Menu Item</li>
                    <li>Menu Item</li>
                    <li>Menu Item</li>
                </ul>
            </div>

            <svg version="1.1" id="blob"xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <path id="blob-path" d="M60,500H0V0h60c0,0,20,172,20,250S60,900,60,500z"/>
            </svg>
        </div>


    <h2 className={styles.menu_h2} > hover close to the menu </h2>


    </>
}