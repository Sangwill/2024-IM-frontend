import React, {useEffect, useState} from 'react';
import {Checkbox, Input, List, Modal, message} from 'antd';
import {request} from "@/utils/network";
import {store} from "@/utils/store"

const AddMember = (props: any) => {

    const [load, setLoad] = useState(true);
    const [friends, setFriends] = useState<any[]>([]);
    const [filtered_friends, setFilteredFriends] = useState([]);
    const [selected, setSelected] = useState<any[]>([]);

    useEffect(() => {
        if (props.open)
        {
            request(
            "GET",
            "user/get_friends",
            "",
            {
                Authorization: store.getState().token,
            }
            ).then((res: any) => {
                const groups = res.groups;
                let friends = [];
                for (const group of groups) {
                    for (const friend of group.group_friends) {
                        friends.push(friend);
                    }
                }
                setFriends(friends);
                setLoad(false);
            })
        }
    }, [props.open]);

    const handleOk = () => {
        if (selected.length !== 0) {
            request(
                "POST",
                "user/invite_member",
                {
                    group_id: props.conversation.conversation_id,
                    invitee_ids: selected,
                },
                {
                    Authorization: store.getState().token,
                }
            ).then((res: any) => {
                if (res && res.code === 0) {
                    message.success('邀请成功');
                }
            });
        }
        props.setOpen(false);   
    }
    
    const handleCancel = () => {
        props.setOpen(false);
    };

    const onChange = (item: any) => {
        return (e: any) => {
            if (e.target.checked) {
                setSelected((selected: any) => [...selected, item.friend_id]);
            }
            else setSelected((selected: any) => selected.filter((x: any) => x !== item.friend_id));
        };
    }
    return (
        <Modal title={"选择好友添加至群聊中"} open={props.open} onOk={handleOk} onCancel={handleCancel}>
            {load
                ?
                (
                    <div>
                    </div>
                    )
                :
                (
                    <div>
                        <List
                            itemLayout="vertical"
                            size="large"
                            // pagination={{pageSize: 3,}}
                            dataSource={friends.filter((item: any) => !props.members.includes(item.friend_id))}
                            renderItem={(item: any) => (
                                <List.Item key={item.friend_id}>
                                    {
                                    <Checkbox onChange={onChange(item)}>
                                    </Checkbox>
                                    }
                                    {item.friend_name}
                                </List.Item>
                            )}
                        />
                    </div>
                )}
        </Modal>
    );
};

export default AddMember;