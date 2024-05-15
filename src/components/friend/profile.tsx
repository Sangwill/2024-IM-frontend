import styles from "../../styles/profile.module.css";
import {Avatar, Button, Input, Space, Spin, message} from "antd";
import { request } from "../../utils/network";
import {useEffect, useState} from "react";
import { profile } from "console";
import { store } from "../../utils/store";

interface ProfileProps {
    user_id: number;
    username: string;
    email: string;
    phone: string;
    avatar_base64: string;
    is_friend: boolean;
    req_type?: string;
    req_id?: number;
    status?: string;
}

const send = async (id: number) => {
    const header = {
        Authorization: store.getState().token,
    };
    try {
        const response = await request(
            "POST",
            "user/send_friend_request",
            JSON.stringify({
                friend_id: id,
            }),
            header
        );
        if (response.code === 0) {
            message.success("Request sent");
        }
        console.log(response);
        location.reload();
    }
 catch(err) {
        console.log(err);
    }
};

const answer = async (requestid: number,res: string) => {
    const header = {
        Authorization: store.getState().token,
    };
    try {
        const response = await request(
            "POST",
            "user/respond_friend_request",
            JSON.stringify({
                request_id: requestid,
                response: res,
            }),
            header
        );
        if (response.code === 0) {
            message.success("Answer sent");
        }
        console.log(response);
        location.reload();
    }
 catch(err) {
        console.log(err);
    }
};

const move = async (id: number, group: string) => {
    const header = {
        Authorization: store.getState().token,
    };
    try {
        const response = await request(
            "POST",
            "user/add_friend_to_friend_group",
            JSON.stringify({
                friend_id: id,
                friend_group_name: group,
            }),
            header
        );
        if (response.code === 0) {
            message.success("Moved");
        }
        console.log(response);
        location.reload();
    }
 catch(err) {
        console.log(err);
    }
};

const DeleteFriend = async (id: number) => {
    const header = {
        Authorization: store.getState().token,
    };
    try {
        const response = await request(
            "POST",
            "user/delete_friend",
            JSON.stringify({
                friend_id: id,
            }),
            header
        );
        if (response.code === 0) {
            message.success("Deleted");
        }
        console.log(response);
        location.reload();
    }
 catch(err) {
        console.log(err);
    }
};

const createchat = async (id: number) => {
    const header = {
        Authorization: store.getState().token,
    };
    try {
        const response = await request(
            "POST",
            "user/create_private_conversation",
            JSON.stringify({
                friend_id: id,
            }),
            header
        );
        if (response.code === 0) {
            message.success("created");
        }
        console.log(response);
       // location.reload();
    }
 catch(err) {
        console.log(err);
    }
}

function Profile(props: ProfileProps) {
    const operation: any[] = [];
    const [group, setGroup] = useState("");
    if (!(props.req_type === "send" || props.req_type === "receive") && (props.is_friend === false)) {
        operation.push(
            <Button id={"1"} onClick={() => { send(props.user_id); }}>
                    Request
                </Button>
        );
    }
    if (props.req_type === "receive" && props.status === "pending") {
        operation.push(<br />);
        operation.push(
            <Button id={"2"} onClick={() => { answer(props.req_id??-1, "accept"); }}>
                Accept
            </Button>
        );
        operation.push(<br />);
        operation.push(
            <Button id={"3"} onClick={() => { answer(props.req_id??-1,"reject"); }}>
                Reject
            </Button>
        );
    }
    const emailAndPhone = !(props.req_type === "send" || props.req_type === "receive")&& (
        <div>
            Email: {props.email}
            <br />
            Phone: {props.phone}
            <br />
        </div>
    );
    const status = (props.req_type === "send" || props.req_type === "receive") && (
        <div>
        status: { props.status }
        </div>
    );
    const friend_buttons = (props.req_type === "friend") && (
        <div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <br />
                <Button id={"4"} style={{ marginRight: "10px" }} onClick={() => { DeleteFriend(props.user_id); }}>
                    Delete
                </Button>
                <br />
                <Button id={"5"} style={{ marginLeft: "10px" }} onClick={() => { createchat(props.user_id)}}>
                    Chat
                </Button>
                <br />
            </div>
            <br />
            <div id={"6"} style={{display: "flex"}}>
                <Input id={"7"} type="text"
                    onChange={(e) => { setGroup(e.target.value); }}
                    value={group}
                    maxLength={20}
                />
                <Button id={"8"} onClick={() => { move(props.user_id, group); }}>
                    Move
                </Button>
            </div>
        </div>
    );
    return (
        <div className={styles.profile}>
            <Avatar size={300} src={props.avatar_base64} />
            <br />
            Username: {props.username}
            <br />
            {emailAndPhone}
            {operation}
            <br />
            {status}
            {friend_buttons}
        </div>
    );
}

export default Profile;