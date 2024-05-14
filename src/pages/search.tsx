import Column from "../components/search/column";
import Profile from "../components/friend/profile";
import SideBar from "../components/chat/side_bar";
import styles from "../styles/layout.module.css";
import { useState } from "react";

export interface ProfileType {
    user_id: number;
    username: string;
    email: string;
    phone: string;
    avatar_base64: string;
    is_friend: boolean;
}

function Friend() {
    const [profile, setProfile] = useState<ProfileType>({
        user_id: -1,
        username: "None",
        email: "None",
        phone: "None",
        avatar_base64: "None",
        is_friend: false,
    });

    return (
        <div className={styles.container}>
            <SideBar/>
            <Column setProfile={setProfile} page="search"/>
            <div className={styles.content}>
                {
                    profile.user_id === -1
                        ?
                        <div>

                        </div>
                        :
                        <Profile user_id={profile.user_id} username={profile.username}
                            email={profile.email} phone={profile.phone}
                            avatar_base64={profile.avatar_base64} req_type="any"
                        is_friend={profile.is_friend}/>
                }
            </div>
        </div>
    );
}

export default Friend;