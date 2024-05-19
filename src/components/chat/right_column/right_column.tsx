import {RightOutlined, UnorderedListOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import styles from "@/styles/right.module.css";
import { Divider, message,Modal } from "antd";
import { useState } from "react";
import ChatHistory from "./chat_history";
import { request } from "@/utils/network";
import { store } from "@/utils/store";
import UserList from "./user_list";
import AddMember from "./add_member";
import NoticeSetter from "./notice";
import Invitation from "./invitaion";
import NoticeHistory from "./notice_history";
const { confirm } = Modal;

export const MenuShow = (_: any) => {
    const handleClick = (_: any) => {
        //message.info("Menu clicked");
        const item = document.getElementById("mySidenav");
        if(item) {
            if (item.style.right === "-20rem") item.style.right = "0px";
            else if(item.style.right === "0px") item.style.right = "-20rem";
            else item.style.right = "0px";
        }
    }
    return (
        <UnorderedListOutlined onClick={handleClick}> </UnorderedListOutlined>
    );
}

const RightColumn = (props: any) => {
    const [openHistory, setOpenHistory] = useState(false);
    const [openAddGroup, setOpenAddGroup] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openNotice, setOpenNotice] = useState(false);
    const [openInvitation, setOpenInvitation] = useState(false);
    const [openAllNotice, setOpenAllNotice] = useState(false);

    const handleDelete = () => {
        confirm({
            title: '确定删除聊天记录吗？',
            icon: <ExclamationCircleFilled />,
            content: '删除后将无法恢复，请谨慎操作。',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                const id = props.conversation.conversation_id;
                request(
                    "POST",
                    "user/delete_records/" + id,
                    id,
                    {
                        Authorization: store.getState().token,
                    }
                ).then((res) => {
                    if (res) {
                        if (res.code === 0) {
                            message.success('聊天记录已删除');
                            //刷新本页面
                            window.location.reload();
                        } else {
                            message.error(res.message);
                        } 
                    }
                    
                });
                message.success('聊天记录已删除');
            },
            onCancel() {
                // 取消删除，不做任何操作
            },
        });
    }

    const handleHistory = () => setOpenHistory(true);

    const handleOpenAdd = () => setOpenAdd(true);

    const handleOpenNotice = () => setOpenNotice(true);
 
    const handleOpenInvitation = () => setOpenInvitation(true);
    
    const handleOpenAllNotice = () => setOpenAllNotice(true);

    const handleQuit = () => {
        confirm({
            title: '确定退出群聊吗？',
            icon: <ExclamationCircleFilled />,
            content: '退出后将无法恢复，请谨慎操作。',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                const id = props.conversation.conversation_id;
                request(
                    "POST",
                    "user/quit_group",
                    {
                        group_id: id,
                    },
                    {
                        Authorization: store.getState().token,
                    }
                ).then((res) => {
                    if (res) {
                        if (res.code === 0) {
                            message.success('已退出群聊');
                            //刷新本页面
                            window.location.reload();
                        } else {
                            message.error(res.message);
                        } 
                    }
                    
                });
                //message.success('');
            },
            onCancel() {
                // 取消删除，不做任何操作
            },
        });
    }
    const groupName = props.conversation.name.length > 10 
        ? props.conversation.name.substring(0, 10) + '...' 
        : props.conversation.name;
    
    return <div id="mySidenav" className={styles.sidenav}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {props.conversation.is_group ? (
                <div>
                    
                    <Divider>
                        群聊名称：{groupName}
                    </Divider>
                    
                    <Divider>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                群成员：
                                <UserList conversation={props.conversation} setConversation={props.setConversation} />
                            </div>
                        </div>
                    </Divider>
                </div>
            ) : (
                <div></div>
            )}
        </div>
        <div onClick={handleHistory}>
            消息记录
            <RightOutlined />
        </div>
        <ChatHistory open={openHistory} setOpen={setOpenHistory}  messages={props.messages}
            conversation={props.conversation} />
        <Divider>

        </Divider>
         <div onClick={handleDelete}>
            删除聊天记录
            <RightOutlined />
        </div>
        <Divider>

        </Divider>
        {props.conversation.is_group ?
            <div>
                <div onClick={handleQuit}>
                退出群聊
                <RightOutlined />
                </div>
                <Divider>
                        
                </Divider>
                {(props.conversation.owner_id === store.getState().userId ||
                props.conversation.admins_ids.includes(store.getState().userId)) ?
                    <div onClick={handleOpenNotice}>
                    设置群公告
                    <RightOutlined />
                    </div> :
                    <div>
                    </div>}
                <Divider>
                        
                </Divider>
                {(props.conversation.owner_id === store.getState().userId ||
                props.conversation.admins_ids.includes(store.getState().userId)) ?
                    <div onClick={handleOpenInvitation}>
                    查看进群邀请
                    <RightOutlined />
                    </div> :
                    <div>
                    </div>}
            </div>
            :
            <div>
            </div>   
        }
        <Divider>

        <AddMember open={openAdd} setOpen={setOpenAdd} members={props.members} conversation={props.conversation} />    
        <NoticeSetter open={openNotice} setOpen={setOpenNotice}  
            conversation={props.conversation} />
        <Invitation open={openInvitation} setOpen={setOpenInvitation}  
            conversation={props.conversation} />
        <NoticeHistory open={openAllNotice} setOpen={setOpenAllNotice}  
            conversation={props.conversation} />
        </Divider>
        {props.conversation.is_group ?
            <div>
                <div onClick={handleOpenAdd}>
                邀请新成员
                <RightOutlined />
                </div>
                <Divider>
                        
                </Divider>
                <div onClick={handleOpenAllNotice}>
                查看历史群公告
                <RightOutlined />
                </div>
            </div>
            :
            <div>
            </div>   
        }
    </div>
}

export default RightColumn;
