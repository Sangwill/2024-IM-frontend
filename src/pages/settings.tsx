import Sidebar from "../components/chat/side_bar";
import UserSetting from "../components/setting/user_setting";
import Profile from "../components/setting/profile";
import styles from "../styles/layout.module.css";

const Settings = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
                <Profile />
            </div>
            <div className={styles.content}>
                <UserSetting />
            </div>
        </div>
    );
};


export default Settings;