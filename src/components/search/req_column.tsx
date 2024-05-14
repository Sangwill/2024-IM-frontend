import { useEffect, useState } from "react";
import { request } from "../../utils/network";
import styles from "../../styles/layout.module.css";
import { useCookies } from "react-cookie";
import {Avatar, Skeleton, Spin} from "antd";
import { store } from "../../utils/store";

interface UserReq {
    request_id: number,
	user_id: number,
    username: string,
    avatar_base64: string,
    status: string,
}

interface UserListProps {
    send_list?: UserReq[],
    receive_list?: UserReq[],
	setProfile?: any,
}

interface RequestFrom {
    request_id: number,
    sender_id: number,
    sender_name: string,
    sender_avatar: string,
    status: string,
    sent_time: string
}

interface RequestTo {
    request_id: number,
    receiver_id: number,
    receiver_name: string,
    receiver_avatar: string,
    status: string,
    sent_time: string
}

const FriendList = (props: UserListProps) => {
	const List: any[] = [];
    const header = {
        Authorization: store.getState().token,
    };
    const handleSelect = async (e: any, request_type:string) => {
        //alert("handleSelect");
        const header = {
            Authorization: store.getState().token,
        };
        const id = e.currentTarget.id; // 获取用户 ID
        //alert(id);
        const UserInSend = props.send_list?.find(user => user.user_id.toString() === id);
        const UserInReceive = props.receive_list?.find(user => user.user_id.toString() === id);
        const req_type = request_type === "to" ? "send" : "receive";
        const selectedUser = request_type === "to" ? UserInSend : UserInReceive;
        if (selectedUser) {
            const profile = {
                user_id: selectedUser.user_id,
                username: selectedUser.username,
                avatar_base64: selectedUser.avatar_base64,
                req_type,
                req_id: selectedUser.request_id,
                status: selectedUser.status,
                is_friend: selectedUser.status == "accept" ? true : false,
            };
            props.setProfile(profile);
        }

    };
    List.push(
        <div className={styles.column_item} key={"request_to"}
            id={"request_to"} >
            <h3>Request To</h3>
        </div>
    );
    if (props.send_list?.length) {
        for (let i = 0; i < props.send_list?.length; i++) {
            const item = props.send_list[i];
            List.push(
                <div className={styles.column_item} key={item.user_id.toString()}
                    id={item.user_id.toString()} onClick={(e)=>handleSelect(e,"to")}>
                    <img className={styles.column_item_left} src={item.avatar_base64}/>
                    {item.username}
                    {/* {item.status}
                    {item.request_id} */}
                </div>
            );
        }
    }
    List.push(
        <div className={styles.column_item} key={"request_from"}
            id={"request_from"} >
            <h3>Request From</h3>
        </div>
    );
    if (props.receive_list?.length) {
        for (let i = 0; i < props.receive_list?.length; i++) {
            const item = props.receive_list[i];
            List.push(
                <div className={styles.column_item} key={item.user_id.toString()}
                    id={item.user_id.toString()} onClick={(e)=>handleSelect(e,"from")}>
                    <img className={styles.column_item_left} src={item.avatar_base64}/>
                    {item.username}
                    {/* {item.status}
                    {item.request_id} */}
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
	const [users, setUsers] = useState<UserReq[]>();
    const [send, setSend] = useState<UserReq[]>();
    const [receive, setReceive] = useState<UserReq[]>();

    const HandleRequest = async () => {
        const header = {
            Authorization: store.getState().token,
        };
        try {
            const response = await request(
                "GET",
                "user/friend_requests",
                "",
                header
            );
            const requestFrom = response?.requests;
            const requestTo = response?.sent_requests;
            const fromList: any[] = [];
            if (requestFrom) {
                for (const item of requestFrom) {
                    fromList.push({
                        request_id: item.request_id,
                        user_id: item.sender_id,
                        username: item.sender_name,
                        avatar_base64: item.sender_avatar,
                        status: item.status,
                    });
                }
            }
            const toList: any[] = [];
            if (requestTo) {
                for (const item of requestTo) {
                    toList.push({
                        request_id: item.request_id,
                        user_id: item.receiver_id,
                        username: item.receiver_name,
                        avatar_base64: item.receiver_avatar,
                        status: item.status,
                    });
                }
            }
            setSend(toList);
            setReceive(fromList);
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        HandleRequest();
    }, []);

	return (
			<div className={styles.column}>
				<FriendList send_list={send} receive_list={receive} setProfile={props.setProfile}/>
			</div>
		)
		;
}

export default Column;