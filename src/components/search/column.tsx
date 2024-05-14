import { useEffect, useState } from "react";
import { request } from "../../utils/network";
import styles from "../../styles/layout.module.css";
import { useCookies } from "react-cookie";
import {Avatar, Skeleton, Spin, message} from "antd";
import { store } from "../../utils/store";

interface User {
	user_id: number,
    username: string,
    avatar_base64: string,
}

interface UserListProps {
	list?: User[],
	setProfile?: any,
}


const FriendList = (props: UserListProps) => {
	const List: any[] = [];
    const header = {
        Authorization: store.getState().token,
    };
    const handleSelect = async (e: any) => {
        //alert("handleSelect");
        const header = {
            Authorization: store.getState().token,
        };
        const id = e.currentTarget.id; // 获取用户 ID
        const selectedUser = props.list?.find(user => user.user_id.toString() === id);
        if (selectedUser) {
            const username = selectedUser.username; // 获取用户昵称
            const url = "user/profile/" + username; // 构建请求 URL
            try {
                const response = await request("GET",url, "", header); // 发送请求
                //props.setProfile(response?.profile);
                const profile = {
                    user_id: response?.user_id,
                    username: response?.username,
                    email: response?.email,
                    phone: response?.phone,
                    avatar_base64: response?.avatar_base64,
                    is_friend: response?.is_friend,
                };
                props.setProfile(profile);
            }
            catch (err) {
                console.log(err);
            }
        }
    };
    if (props.list?.length) {
        for (let i = 0; i < props.list?.length; i++) {
            const item = props.list[i];
            List.push(
                <div className={styles.column_item} key={item.user_id.toString()}
                    id={item.user_id.toString()} onClick={handleSelect}>
                    <img className={styles.column_item_left} src={item.avatar_base64}/>
                    {item.username}
                </div>
            );
        }
    }
	return (
        <div>
			{List}
        </div>
    )
    ;
};

interface ColumnProps {
    setProfile?: any;
    page: string;
}

function Column(props: ColumnProps) {
	const [query, setQuery] = useState("");
	const [users, setUsers] = useState<User[]>();

	const handleQuery = async () => {
		const url = "user/search_friends?" + new URLSearchParams({keyword: query}).toString();
		// const body = {
		// 	keyword: query,
		// };
		const header = {
            Authorization: store.getState().token,
        };
        if (query === "") {
            message.info("Please enter a valid keyword");
            return;
        }
        try {
            //alert("GET" + url + JSON.stringify(body) + JSON.stringify(header));
            //alert(JSON.stringify(body));
            const response = await request(
				"GET",
                url,
                "",
				header,
            );
			setUsers(response?.data);
			//setLoad(true);
        }
 catch(err) {
            console.log(err);
        }
	};


	return props.page==="search" ?
		(
		<div className={styles.column}>
			<div className={styles.column_search}>
				<input className={styles.search_bar}
                    type="text"
					placeholder="Press Enter to Search"
                    onChange={(e) => { setQuery(e.target.value); }}
					onKeyDown={(e) => { if (e.key === "Enter") handleQuery(); }}
                    value={query}
				/>
			</div>
			<FriendList list={users} setProfile={props.setProfile}/>
		</div>
		)
		:
		(
			<div className={styles.column}>
				<FriendList list={users} setProfile={props.setProfile}/>
			</div>
		)
		;
}

export default Column;