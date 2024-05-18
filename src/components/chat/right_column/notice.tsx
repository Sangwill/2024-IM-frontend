import { stringToTimestamp } from "@/utils/utilities";
import { Divider, Modal, MenuProps, Menu, DatePicker, Select, SelectProps, List, Avatar, Image, message, Button, Input } from "antd";
import { useEffect, useState } from "react";
import styles from "@/styles/chat.module.css";
import { request } from "@/utils/network";
import { store } from "@/utils/store";


const NoticeSetter = (props: any) => {
    

    const handleOk = () => {
        if (text !== '') {
            request(
                "POST",
                "user/create_group_announcement",
                {
                    group_id: props.conversation.conversation_id,
                    content: text,
                },
                {
                    Authorization: store.getState().token,
                }
            ).then((res: any) => {
                if (res && res.code === 0) {
                    message.success('设置成功');
                }
            });
            setText(''); 
        }
        props.setOpen(false)
    };
    const handleCancel = () => props.setOpen(false);
    const [text, setText] = useState("");
    

    return (
        <Modal title={"设置群公告"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Divider />
            <Input.TextArea
                maxLength={1000}
                className={styles.input}
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                onPressEnter={(e) => {
                    // 按下Enter键时发送消息，除非同时按下了Shift或Ctrl
                    if (!e.shiftKey && !e.ctrlKey) {
                      e.preventDefault(); // 阻止默认事件
                      e.stopPropagation(); // 阻止事件冒泡
                      handleOk();
                    }
                }}
                
                rows={3}
                autoSize={false} // 关闭自动调整大小
            />
        </Modal>
    )
    
}

export default NoticeSetter;