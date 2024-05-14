import { useEffect, useState } from 'react';
import { isBrowser, store } from "@/utils/store";
//import CircularJson from "circular-json";
import { MentionsInput, Mention } from 'react-mentions';

import styles from "@/styles/chat.module.css";
import { Button,message,Input } from "antd";
import { request } from '@/utils/network';

const TextBoard = (props: any) => {
    const socket: any = store.getState().webSocket;
    const [text, setText] = useState(""); // 用于保存输入框中的文本
    const [reply_text, setReplyText] = useState("");
    useEffect(() => {
        setText(props.text)
    }, [props.text]);
    
    
    useEffect(() => {
        if (props.isReply)
            setReplyText(props.ReplyText);
    }, [props.ReplyText,props.isReply]);

    if (socket.readyState !== 1) {
        store.dispatch(
            {
                type: 'socketConnect',
                data: new WebSocket("wss://django-dream.app.secoder.net/ws/?username="+store.getState().username)
            }
        )
    }
    // 发送文本信息
    const handleClick = (e: any) => {
        //alert(text);
       console.log(socket.readyState);
        //if (isBrowser && socket !== null && socket.readyState === 1) {
            
            if (text !== "") {
                const message_tosend = {
                    //type: "send",
                    //id: store.getState().userId,
                    conversation_id: props.conversation_id,
                    //timestamp: Date.now(),
                    content: reply_text+text, // 使用文本框中的文本
                    //messageType: "text",
                    reply_to_id: props.reply
                };
                const addM = {
                    "sender_name": props.myName,
                    //"sender_id": store.getState().userId,
                    "create_time": Date.now(),
                    "msg_id": -1,
                    "content": reply_text+text, // 使用文本框中的文本
                    //"messageType": "text",
                    "reply_to": {},
                    "renderedMessage": text, // 使用文本框中的文本
                }
                //socket.send(CircularJson.stringify(message));
                const header = {
                    Authorization: store.getState().token,
                };
                if (props.isReply) {
                    message_tosend.reply_to_id = props.reply;
                    addM.reply_to = {
                        msg_id: props.reply,
                    };
                    props.setIsReply(false);
                    request(
                        "POST",
                        `user/reply_message`,
                        message_tosend,
                        header
                    ).then((response) => {
                        if( response.code === 0 ) {
                            message.success("succeed");
                            props.setMessages((messages: any) => {
                                return messages.map((message: any) => {
                                    if (message.msg_id === props.reply) {
                                        // 增加 reply_count
                                        return { ...message, reply_count: (message.reply_count || 0) + 1 };
                                    }
                                    return message;
                                });
                            });
                        }
                    });
                } else request(
                    "POST",
                    `user/send_message`,
                    message_tosend,
                    header
                ).then((response) => {
                    if (response) {
                        if (response.code === 0) {
                            //message.success("succeed")
                        } else if (response.code === 26 || response.code === 31){
                            message.error('对方不是你的好友');
                        }
                    }
                });
                props.setMessages((message: any) => [...message, addM]);
                setText(""); // 发送完消息后清空文本框
                setReplyText("");
                props.setText("");
                props.setReplyText("");
                props.setClear(true);
            }
        //}
    };

    return (
        <div className={styles.writing_box}>
            {
                props.isReply && (
                    <div >
                        <span>{reply_text}</span>
                    </div>
                )
            }
            <Input.TextArea
                className={styles.input}
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                onPressEnter={(e) => {
                    // 按下Enter键时发送消息，除非同时按下了Shift或Ctrl
                    if (!e.shiftKey && !e.ctrlKey) {
                      e.preventDefault(); // 阻止默认事件
                      e.stopPropagation(); // 阻止事件冒泡
                      handleClick(e);
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Backspace' && text === '') {
                        
                        setReplyText('');
                        props.setIsReply(false);
                    }
                }}
                rows={3}
                autoSize={false} // 关闭自动调整大小
            />
            <div className={styles.send}>
                <Button onClick={handleClick} >发送</Button>
            </div>
        </div>
    )
};

export default TextBoard;
