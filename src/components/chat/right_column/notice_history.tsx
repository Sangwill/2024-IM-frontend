import { request } from "@/utils/network";
import { store } from "@/utils/store";
import { Divider, List, Menu, MenuProps, Modal } from "antd";
import { useEffect, useState } from "react";

const AllPicker = (props: any) => {
    return <div style={{ overflowY: 'auto', maxHeight: '350px' }}>
        <List
            itemLayout="horizontal"
            dataSource={props.all_notice}
            renderItem={(item: any, index: number) => (
                <List.Item>
                    <List.Item.Meta
                        title={item.creator.username+" at "+item.create_time}
                        description={ item.content }
                    />
                </List.Item>
            )}
        />
    </div>
};

const NoticeHistory = (props: any) => {
    const [AllNotice, setAllNotice] = useState([]);
    const handleOk = () => props.setOpen(false);
    const handleCancel = () => props.setOpen(false);
    useEffect(() => {
        if (props.open)
        {
            request(
            "GET",
            `user/get_group_announcements/`+props.conversation.conversation_id,
            "",
            {
                Authorization: store.getState().token,
            }
            ).then((res: any) => {
                if (res && res.code === 0) {
                    setAllNotice(res.announcements);
                }
            })
        }
    }, [props.open,props.conversation.conversation_id]);

    return (
        <Modal title={"所有群公告"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <br />
            <AllPicker all_notice={AllNotice}/>
        </Modal>
    )
    
}

export default NoticeHistory;