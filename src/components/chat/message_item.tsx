import styles from "@/styles/chat.module.css";
import { useEffect, useRef, useState } from "react";
import {Avatar, Badge} from "antd";

const MessageItem = (props: any) => {
    



    return (
        <div className={
           styles.message_item}>
    
            <div className={styles.message_item_mid}>
                <div className={styles.message_item_title}>
                    {props.conversation.name}
                    
                    
                </div>
               
            </div>
            {
                props.conversation.unread_count !== 0 ?
                <div style={{ color: 'blue' }}>
                未读消息：[{props.conversation.unread_count}]
                </div> :
                <div></div>
            }
            
            
        </div>
    )
};

export default MessageItem;