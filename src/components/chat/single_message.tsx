import styles from "@/styles/chat.module.css"
import {useEffect, useState} from "react";
import TextBoard from "@/components/chat/text";
import {store} from "@/utils/store";


const SingleMessage = (props: any) => {
    const [myName, setMyName] = useState("");
    
    useEffect(() => {
        setMyName(store.getState().username);
    }, []);
    return (
        <div >
            <TextBoard text={props.text} setMessages={props.setMessages} setText={props.setText}
                conversation_id={props.conversation_id} members={props.members} reply={props.reply} myName={myName}
                setIsReply={props.setIsReply} isReply={props.isReply} ReplyText={props.ReplyText}
                setReplyText={props.setReplyText} setClear={props.setClear}/>
        </div>

    );
}

export default SingleMessage;