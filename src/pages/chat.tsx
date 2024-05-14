import React, {useState,useEffect} from "react";
import Sidebar from "../components/chat/side_bar";
import styles from "../styles/layout.module.css";
import LeftColumn from "../components/chat/left_column";
import ChatBoard from "@/components/chat/chat_board";
import UpperBar from "@/components/chat/upper_bar";

const Chat = () => {
    
    const [conversation, setConversation] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [list, setList] = useState<any>([-1]);
    const [groups, setGroups] = useState<any>([-1]);
    const [members, setMembers] = useState<any>([-1]);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.column}>
                <UpperBar setRefresh={setRefresh}/>
                <LeftColumn setConversation={setConversation} refresh={refresh}
                    list={list} setList={setList} groups={groups} setGroups={setGroups}
                members={members} setMembers={setMembers}/>
            </div>
            {
                conversation === null ? <div></div> :
                    <div className={styles.content}>
                        <ChatBoard list={list} groups={groups} conversation={conversation} setRefresh={setRefresh}
                           setList={setList} setGroups={setGroups} setConversation={setConversation} members={members}/>
                    </div>
            }
        </div>
    );
};

export default Chat;