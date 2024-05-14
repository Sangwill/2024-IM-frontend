import { stringToTimestamp } from "@/utils/utilities";
import { Divider, Modal, MenuProps, Menu, DatePicker, Select, SelectProps, List, Avatar, Image, message, Button, Input, Layout } from "antd";
import { useEffect, useState } from "react";
import styles from "@/styles/chat.module.css";
import { request } from "@/utils/network";
import { store } from "@/utils/store";
import { stat } from "fs";

const JoinRequestItem = (props: any) => {
    const [showButtons, setShowButtons] = useState(true);

    const onAdmit = (request_id: any) => {
        request(
            "POST",
            "user/respond_invitation",
            {
                request_id: request_id,
                response: "accept",
            },
            {
                Authorization: store.getState().token,
            }
        ).then((res: any) => {
            if (res && res.code === 0) {
                message.success('已批准');
                setShowButtons(false); // 更新状态，隐藏按钮
            }
        });
    };

    const onReject = (request_id: any) => {
        request(
            "POST",
            "user/respond_invitation",
            {
                request_id: request_id,
                response: "reject",
            },
            {
                Authorization: store.getState().token,
            }
        ).then((res: any) => {
            if (res && res.code === 0) {
                message.success('已拒绝');
                setShowButtons(false); // 更新状态，隐藏按钮
            }
        });
    };

    return (
        <div style={{ marginBottom: '10px', display: 'flex' }}>
            <span>{`邀请者：${props.inviter_name}`}</span>
            <span style={{ marginLeft: '10px', marginRight: '10px' }}></span>
            <span>{`被邀请者：${props.invitee_name}`}</span>
            {showButtons && props.status === 'pending' && (
                <div style={{ marginLeft: 'auto' }}>
                    <Button type="primary" onClick={() => onAdmit(props.request_id)}>Admit</Button>
                    <Button style={{ marginLeft: '10px' }} onClick={() => onReject(props.request_id)}>Reject</Button>
                </div>
            )}
            {props.status !== 'pending' && <span style={{ marginLeft: 'auto' }}>{` 邀请状态：${props.status}`}</span>}
        </div>
    );
};


  const Invitation = (props: any) => {
    const handleOk = () => props.setOpen(false);
    const handleCancel = () => props.setOpen(false);
    const [invitation, setInvitation] = useState([]);

    useEffect(() => {
        if (props.open) {
            request(
                "GET",
                `user/view_invitations/` + props.conversation.conversation_id,
                "",
                {
                    Authorization: store.getState().token,
                }
            ).then((res: any) => {
                setInvitation(res.join_requests);
            });
        }
    }, [props.open]);

    return (
        <Modal title={"入群申请"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Divider />
            <div style={{ overflowY: 'auto', maxHeight: '350px' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={invitation}
                    renderItem={(item: any) => (
                        <JoinRequestItem
                            key={item.request_id}
                            request_id={item.request_id}
                            invitee_id={item.invitee_id}
                            invitee_name={item.invitee_name}
                            inviter_id={item.inviter_id}
                            inviter_name={item.inviter_name}
                            status={item.status}
                        />
                    )}
                />
            </div>
        </Modal>
    );
};


export default Invitation;