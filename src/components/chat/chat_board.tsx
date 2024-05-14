import { useEffect, useRef, useState } from "react";
import SingleMessage from "@/components/chat/single_message";
import styles from "@/styles/chat.module.css"
import { isBrowser } from "@/utils/store";
import { store } from "@/utils/store";
import { MenuProps, Modal } from 'antd';
import { Avatar, Dropdown, Image, message, Skeleton, Spin, Tooltip } from 'antd';
import RightColumn from "@/components/chat/right_column/right_column";
import { request } from "@/utils/network";
import { MenuShow } from "./right_column/right_column";

const msg_items: MenuProps['items'] = [
    {
        key: '1',
        label: (<div>回复</div>),
    },
    {
        key: '2',
        label: (<div>删除</div>)
    },
];

const reply_msg_items: MenuProps['items'] = [
    {
        key: '-1',
        label: (<div>定位到原文位置</div>),
    },
    {
        key: '1',
        label: (<div>回复</div>),
    },
    {
        key: '2',
        label: (<div>删除</div>)
    },
];

const ChatBoard = (props: any) => {

    const [messages, setMessages] = useState<any>([]);
    const [members, setMembers] = useState<any>([]);
    const [height, setHeight] = useState(0);
    const [iload, setIload] = useState(false);
    const [mload, setMload] = useState(false);
    const [memload, setMemload] = useState(false);
    const [newinfo, setNewinfo] = useState(false);
    const [newmsg, setNewmsg] = useState(false);
    const [newpull, setNewpull] = useState(false);
    const [count, setCount] = useState(0);
    const [role, setRole] = useState(2);
    const [reply, setReply] = useState(-1);
    const [getReply, setGetReply] = useState(-1);
    const [text, setText] = useState("");
    const [messageLoad, setmessageLoad] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [ReplyText,setReplyText]=useState("");
    const conversationId = useRef(props.conversation.conversation_id);
    const [clear, setClear] = useState(false);
    const [LastReadMap, setLastReadMap] = useState<any[]>([]);
    const messageEndRef = useRef<HTMLDivElement>(null); // 指向消息列表末尾的引用，用于自动滚动
    const chatPanelRef = useRef(null);

    const onDropDownClick: any = (content: string, msg_id: number, sender_id: number, create_time: any, reply_id:number) => {
        return ({ key }: any) => {
            //message.info("+++")
            if (key === '-1') {
                setGetReply(reply_id);
            } else if (key === '1') {
                setReply(msg_id);
                setReplyText(
                    "回复" + 
                    store.getState().memberMap[sender_id] + " " + create_time +
                    "\n" +
                    content + "\n"
                )
                setIsReply(true);
            }
            else if (key === '2') {
                //删除这条消息
                Modal.confirm({
                    title: '确认删除消息',
                    content: '您确定要删除这条消息吗？',
                    onOk() {
                        // 用户确认删除后，调用删除消息的函数
                        const id = props.conversation.conversation_id;
                        request(
                            "POST",
                            "user/delete_message",
                            {
                                conversation_id: id,
                                message_id: msg_id,  
                            },
                            {
                                Authorization: store.getState().token,
                            }
                        ).then((res) => {
                            if (res) {
                                if (res.code === 0) {
                                    message.success('已删除');
                                    setMessages((_messages: any) => [...(_messages.filter((_message: any) => _message.msg_id !== msg_id))]);
                                } else {
                                    message.error("删除失败");
                                } 
                            }
                            
                        });
                    },
                    onCancel() {
                        console.log('取消删除消息');
                    },
                });
            }
        }
    };
 
    const handleSend = (res: any) => {
        res = JSON.parse(res.data);
        if (res.type === 'notify') {
            //message.info('TEST');
            if (res.conversation_id === props.conversation.conversation_id) {
                setLastReadMap(res.last_read_map);
                if (res.sender_name === store.getState().username) {
                    //message.info("set");
                    setMessages((messages: any) => messages.map((message: any) => {
                        return message.msg_id === -1 
                            ?
                            {
                                content: message.content,
                                //renderedMessage: message.content,
                                msg_id: res.message_id,
                                sender_id: res.sender_id,
                                sender_name: res.sender_name,
                                create_time: res.timestamp,
                                sender_avatar: res.sender_avatar,   
                                reply_to: res.reply_to,
                                //reply: res.reply_to,
                            }
                            : message;
                    }))
                } else {
                    //message.info("set");
                    setMessages((messages: any) => {
                        const newMessage = {
                            content: res.content,
                            msg_id: res.message_id,
                            sender_id: res.sender_id,
                            sender_name: res.sender_name,
                            create_time: res.timestamp,
                            sender_avatar: res.sender_avatar,   
                            reply_to: res.reply_to,
                        };
                    
                        // 否则直接追加新消息，并返回更新后的消息列表
                        return [...messages, newMessage];
                    });
                    if (res.reply_to !== null) {
                        
                        setMessages((messages: any) => {
                            return messages.map((message: any) => {
                                if (message.msg_id === res.reply_to.msg_id) {
                                    // 增加 reply_count
                                    return { ...message, reply_count: (message.reply_count || 0) + 1 };
                                }
                                return message;
                            });
                        });
                    }
                }
            }
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
        else if (res.type === "read") {
            //message.info('TEST');
            setLastReadMap(res.last_read_map);
        }
    };
    
    // useEffect(() => {
    //     if( messages.length !== 0 ) {
    //         store.dispatch(
    //             { type: 'addMessage',
    //                     message: {key: props.conversation.conversation_id, value: messages}
    //             });
    //     }
    // }, [messages]);


    const scroll = () => {
        const board: any = document.getElementById('board');
        if (board.scrollTop === 0) {
            setHeight(board.scrollHeight);
            if (!newpull) setCount(count => count + 1);
            setNewpull(true);
            setNewinfo(true);
        }
    };

    useEffect(() => {
        conversationId.current = props.conversation.conversation_id;
    }, [props.conversation.conversation_id]);


    useEffect(() => {
        if (members.length !== 0) {
            let isTrue = true;
            for (let i = 0; i < members.length; ++i)
                if (store.getState().imgMap.hasOwnProperty(members[i].id)) isTrue = false;
            if (isTrue) setIload(true);
        }
    }, [store.getState().imgMap, props.conversation.conversation_id]);

    

    useEffect(() => {
        const board = document.getElementById('board');
        if (mload && board) board.addEventListener('scroll', scroll);
        return () => {
            if (board) board.removeEventListener('scroll', scroll);
        }
    }, [props.conversation.conversation_id, mload]);


    useEffect(() => {
        //message.info("socket");
        const socket: any = store.getState().webSocket;
        if (isBrowser && socket != null) {
            if (socket.readyState !== 1) {
                console.log("socket connect");
                store.dispatch({
                    type: 'socketConnect',
                    data: new WebSocket("wss://django-dream.app.secoder.net/ws/?username=" + store.getState().username)
                });
                // const webSocket:any = store.getState().webSocket;
                // if (webSocket) {
                //     webSocket.removeEventListener('message', handleSend);
                //     webSocket.addEventListener("message", handleSend);
                // }
            }
            // socket.addEventListener("message", handleSend); 是原来的状态，要在新的socket添加监听
            if (socket.readyState === 1) {
                //message.info("add listener");
                console.log("socket addeventlistener");
                socket.removeEventListener('message', handleSend);
                socket.addEventListener("message", handleSend);
            }
    
            // if (store.getState().message[props.conversation.conversation_id]) {
            //     console.log("socket get message");
            //     setMessages(store.getState().message[props.conversation.conversation_id]);
            // }
            
        }
        return () => {
            if (socket && socket.removeEventListener) {
                socket.removeEventListener('message', handleSend);
                
            }// 检查 socket 和 removeEventListener 方法是否存在
        };
    }, [props.conversation.conversation_id, store.getState().webSocket,props.list,props.groups]);
    

    useEffect(() => {
        const header = {
            Authorization: store.getState().token,
        };
        request(
            "GET",
            `user/conversation/`+props.conversation.conversation_id,
            "",
            header
        ).then((response) => {
            if (response)
            {
                if (response.code === 0) {
                setMembers(response.members);
                setMessages(response.messages);
                    setmessageLoad(true);
                    setLastReadMap(response.last_read_map);
                for (const each of response.members) {
                    store.dispatch({type: "addImage", data: {key: each.member_id, value: each.member_avatar}});
                    store.dispatch({type: "addMember", data: {mem_key: each.member_id, mem_value: each.member_name}});
                    
                }
            }}
            else {
                //message.error('不在会话中！');
            }
        });
    },[props.conversation.conversation_id]);
        
    useEffect(() => {
        if (getReply !== -1) {
            console.log(getReply);
            console.log(messages);
            if (messages.filter((message: any) => message.msg_id === getReply).length === 0) {
                const board: any = document.getElementById('board');
                board.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
            else {
                const message: any = document.getElementById(getReply.toString());
                console.log(message);
                message.scrollIntoView({ behavior: "smooth" });
                setGetReply(-1);
            }
        }
    }, [getReply, messages]);

    const setInterval = () => {
        return setTimeout(() => {
            console.log("timeout");
            messageEndRef.current?.scrollIntoView({
                behavior: messages.length > 50 ? 'instant' : 'smooth',
            });
            return true;
        }, 10);
    };
    
    useEffect(() => {
        let isTrue = true;
        setInterval();
        isTrue = false;
    }, [props.conversation.conversation_id,messages]);

    useEffect(() => {
        if (clear) {
            const updatedList = props.list.map((session:any) => {
                if (session.conversation_id === props.conversation.conversation_id) {
                    return { ...session, unread_count: 0 };
                }
                return session;
            });
            const updatedGroups = props.groups.map((session:any) => {
                if (session.conversation_id === props.conversation.conversation_id) {
                    return { ...session, unread_count: 0 };
                }
                return session;
            });
    
            if (props.list.find((session:any) => session.conversation_id === props.conversation.conversation_id)) {
                props.setList(updatedList);
            } else if (props.groups.find((session:any) => session.conversation_id === props.conversation.conversation_id)) {
                props.setGroups(updatedGroups);
            }
        }
        setClear(false);
    }, [clear,props.list,props.groups]);

    return messageLoad ? (
        <div className={styles.container}>
            <div className={styles.title_bar}>
                {props.conversation.name}
            </div>
            <div className={styles.menu_show}>
                <MenuShow />
            </div>
            <div ref={chatPanelRef} id="board" className={styles.display_board}>
                {messages.map((message: any, index: any) => message.msg_id!==-1?
                    (message.sender_id === store.getState().userId ? (
                        <div className={styles.message} key={index + 1} id={message.msg_id}>
                            <div className={styles.headshot_right}>
                                    <Avatar src={
                                        store.getState().imgMap[message.sender_id]
                                    } />
                            </div>
                            <Tooltip title={
                                (store.getState().memberMap[message.sender_id])+" "+message.create_time + (message.reply_count?(" " + message.reply_count + "条回复"): " ")

                            } trigger={"hover" } arrow={false} placement="topRight" color="rgba(100,100,100,0.5)">
                                <Dropdown menu={{
                                    items: message.reply_to === null ? msg_items : reply_msg_items,
                                    onClick: onDropDownClick(message.content, message.msg_id, message.sender_id, message.create_time,
                                        message.reply_to === null ? -1 : message.reply_to.msg_id)
                                 
                                }}
                                    placement="bottomLeft" trigger={['contextMenu']}>
                                    {

                                        <div className={styles.message_right}>
                                            {message.content}

                                        </div>

                                    }
                                </Dropdown>
                            </Tooltip>
                            <Tooltip title={
                                    members
                                        .filter((member: any) => LastReadMap[member.member_id] >= message.msg_id)
                                        .map((member: any, index: any) => (
                                            <div key={index}>
                                                <Avatar src={
                                                        store.getState().imgMap[member.member_id]
                                                } />
                                                &nbsp;&nbsp;
                                                {member.member_name}
                                                <br />
                                            </div>
                                        ))
                                } trigger="hover" overlayInnerStyle={{ color: "rgb(50,50,50)" }}
                                    arrow={false} placement="bottomRight" color="rgba(255,255,255,0.5)">
                                    <div className={styles.read_right}>
                                        {
                                            members.filter((member: any) => LastReadMap[member.member_id] >= message.msg_id).length
                                        }
                                        /
                                        {
                                            members.length
                                        }
                                        &thinsp;已读
                                    </div>
                                </Tooltip>
                        </div>
                    ) : (
                        <div className={styles.message} key={index + 1} id={message.msg_id}>
                            <div className={styles.headshot_left}>
                                    <Avatar src={
                                        store.getState().imgMap[message.sender_id]
                                    } />
                            </div>
                            <Tooltip
                                    title={
                                        (store.getState().memberMap[message.sender_id])+" "+message.create_time + (message.reply_count?(" " + message.reply_count + "条回复"): " ")

                                }
                                trigger="hover"
                                arrow={false} placement="topLeft" color="rgba(100,100,100,0.5)">
                                <Dropdown menu={{
                                        items: message.reply_to === null ? msg_items : reply_msg_items,
                                        onClick: onDropDownClick(message.content, message.msg_id, message.sender_id, message.create_time,
                                            message.reply_to === null ? -1 : message.reply_to.msg_id)
                                    
                                }}
                                    placement="bottomLeft" trigger={['contextMenu']}>
                                    {

                                        <div className={styles.message_left}>
                                            {message.content}
                                        </div>

                                    }
                                </Dropdown>
                            </Tooltip>
                            <Tooltip title={
                                     members
                                     .filter((member: any) => LastReadMap[member.member_id] >= message.msg_id)
                                     .map((member: any, index: any) => (
                                         <div key={index}>
                                             <Avatar src={
                                                     store.getState().imgMap[member.member_id]
                                             } />
                                             &nbsp;&nbsp;
                                             {member.member_name}
                                             <br />
                                         </div>
                                     ))
                                } trigger="hover" overlayInnerStyle={{ color: "rgb(50,50,50)" }}
                                    arrow={false} placement="bottomLeft" color="rgba(255,255,255,0.5)">
                                    <div className={styles.read_left}>
                                        {
                                            members.filter((member: any) => LastReadMap[member.member_id] >= message.msg_id).length
                                        }
                                        /
                                        {
                                            members.length
                                        }
                                        &thinsp;已读
                                    </div>
                                </Tooltip>  
                        </div>
                    )):<div key={-1}></div>)}
                <div ref={messageEndRef} /> {/* 用于自动滚动到消息列表底部的空div */}
            </div>
            <div id="THEEND"/>
            <div >
            <SingleMessage conversation_id={props.conversation.conversation_id} setMessages={setMessages}
                    members={members} reply={reply} text={text} setText={setText} setIsReply={setIsReply}
                    isReply={isReply} ReplyText={ReplyText} setReplyText={setReplyText} setClear={setClear}/>
            <RightColumn conversation={props.conversation} messages={messages} list={props.list} groups={props.groups}
                    setConversation={props.setConversation} setMessages={setMessages} members={props.members} />
            </div>
            
        </div>
    ) : (
            <Skeleton />
        );
    
        
};

export default ChatBoard;
