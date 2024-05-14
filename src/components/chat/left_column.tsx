import {useEffect, useState} from "react";
import { request } from "../../utils/network";
import {Divider, message, Modal, Spin} from "antd";
import { isBrowser } from "../../utils/store";
import {store} from "../../utils/store";
import MessageItem from "./message_item";
import { setgroups } from "process";


const LeftColumn = (props: any) => {
    const [id, setId] = useState(0);
    const [load, setload] = useState(false);
    const [groups, setGroups] = useState([]);
    const clearList = (conversation_id: number) => {
        if (props.list.filter((session: any) => session.conversation_id === conversation_id)[0])
            props.list.filter((session: any) => session.conversation_id === conversation_id)[0].unread_count = 0;
        else if (props.groups.filter((session: any) => session.conversation_id === conversation_id)[0])
            props.groups.filter((session: any) => session.conversation_id === conversation_id)[0].unread_count = 0;
    }
    useEffect(() => {
        if (!load) {
            request(
                "GET",
                "user/get_private_conversations",
                "",
                {
                    Authorization: store.getState().token,
                }
            ).then((res) => {
                if (res) {
                    if (res.code === 0) {
                        props.setList(res.conversations);
                        setload(true);
                    } else {
                        message.error(res.message);
                    } 
                }
                
            });
            
        }
    }, [load,props.refresh]);


    useEffect(() => {
        if (!load) {
            request(
                "GET",
                "user/get_group_conversations",
                "",
                {
                    Authorization: store.getState().token,
                }
            ).then((res) => {
                if (res) {
                    if (res.code === 0) {
                        props.setGroups(res.groups);
                        setload(true);
                    } else {
                        message.error(res.message);
                    } 
                }
                
            });
            
        }
    }, [load, props.refresh]);
    
    const handleRead = (res: any) => {
        res = JSON.parse(res.data);
        if (res.type === 'notify') {
            //message.info('TEST');
            if (res.sender_id !== store.getState().userId){
                const updatedList = props.list.map((session:any) => {
                    if (session.conversation_id === res.conversation_id) {
                        return { ...session, unread_count: session.unread_count + 1 };
                    }
                    return session;
                });
                const updatedGroups = props.groups.map((session:any) => {
                    if (session.conversation_id === res.conversation_id) {
                        return { ...session, unread_count: session.unread_count + 1 };
                    }
                    return session;
                });
        
                if (props.list.find((session:any) => session.conversation_id === res.conversation_id)) {
                    props.setList(updatedList);
                } else if (props.groups.find((session:any) => session.conversation_id === res.conversation_id)) {
                    props.setGroups(updatedGroups);
                }
            }
            
        }
    };

    useEffect(() => {
        const socket: any = store.getState().webSocket;
        if (isBrowser && socket != null) {
            if (socket.readyState !== 1) {
                console.log("socket connect");
                store.dispatch({
                    type: 'socketConnect',
                    data: new WebSocket("wss://django-dream.app.secoder.net/ws/?username=" + store.getState().username)
                });

            }
            // socket.addEventListener("message", handleSend); 是原来的状态，要在新的socket添加监听
            if (socket.readyState === 1) {
                //message.info("add listener");
                console.log("socket addeventlistener");
                socket.removeEventListener('message', handleRead);
                socket.addEventListener("message", handleRead);
            }
    
            
        }
        return () => {
            if (socket && socket.removeEventListener) {
                socket.removeEventListener('message', handleRead);
                
            }// 检查 socket 和 removeEventListener 方法是否存在
        };
    }, [props.list,props.groups]);

    function handleClick(conversation: any) {
        return () => {
            // to call the api to get the conversation, so as to mark read
            const header = {
                Authorization: store.getState().token,
            };
            request(
                "GET",
                `user/conversation/` + conversation.conversation_id,
                "",
                header
            );
            console.log(props.list.length);
            setId(conversation.conversation_id);
            props.setConversation(conversation);
            if(conversation.is_group)
                props.setMembers(conversation.members.map((member: any) => member.member_id));
            clearList(conversation.conversation_id);
        }
    }

    return (
        <div>
            {
                props.list.map((conversation: any) => (
                    <div key={conversation.conversation_id} onClick={handleClick(conversation)}>
                        <MessageItem conversation={conversation}/>
                    </div>
                ))
            }
            {
                 props.groups.map((conversation: any) => (
                    <div key={conversation.conversation_id} onClick={handleClick(conversation)}>
                        <MessageItem conversation={conversation}/>
                    </div>
                ))
            }
        </div>
    );
};

export default LeftColumn;