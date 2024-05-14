import React, { useEffect, useState } from 'react';
import { List, Avatar, Tag, Button,message, MenuProps, Dropdown, Modal } from "antd";
import styles from '@/styles/right.module.css';
import { request } from "@/utils/network";
import { store } from "@/utils/store";

const UserList = (props: any) => {
    const [expanded, setExpanded] = useState(false); // 控制列表展开状态的状态
    const [friendIds, setFriendIds] = useState<string[]>([]);
    const Admin = props.conversation.admins_ids.includes(store.getState().userId);
    const Owner = store.getState().userId === props.conversation.owner_id;
    const OwnertoCommonList: MenuProps['items'] = [
        {
          key: '0',
          label: "转让群主",
        },
        {
          key: '1',
          label: "设为管理员",
        },
        {
          key: '2',
          label: "移出群聊",
        },
    ];
    const OwnertoAdminList: MenuProps['items'] = [
        {
          key: '0',
          label: "转让群主",
        },
        {
          key: '3',
          label: "取消管理员",
        },
        {
          key: '2',
          label: "移出群聊",
        },
    ];
    const adminList: MenuProps['items'] = [
        {
          key: '2',
          label: "移出群聊",
        },
    ];


    useEffect(() => {
        // 发送网络请求获取用户好友列表
        const fetchFriendIds = async () => {
            try {
                
                const response = await request(
                    "GET",
                    "user/get_friends",
                    "",
                    {
                        Authorization: store.getState().token,
                    }
                ).then((res) => {
                    if (res) {
                        if (res.code === 0) {
                            const groups = res.groups;
                            let friends = [];
                            for (const group of groups) {
                                for (const friend of group.group_friends) {
                                    friends.push(friend);
                                }
                            }
                            const friendIds = friends.map((friend: any) => friend.friend_id);
                            setFriendIds(friendIds);
                        } else {
                            message.error(res.message);
                        } 
                    }
                    
                }); //这是获取用户好友列表的接口
            } catch (error) {
                console.error('Error fetching friend ids:', error);
            }
        };
        fetchFriendIds(); // 调用获取用户好友列表的函数
        //message.info(JSON.stringify(friendIds));
    }, []);

    const toggleExpand = () => {
        setExpanded(!expanded); // 切换展开状态
    };

    const isAdmin = (memberId: string) => {
        return props.conversation.admins_ids.includes(memberId); // 判断该成员是否为管理员
    };

    const isOwner = (memberId: string) => {
        return memberId === props.conversation.owner_id; // 判断该成员是否为群主
    };

    const handleAddFriend = async (memberId: string) => {
        // 处理添加好友的逻辑，可以发送请求给后端
        const response = await request(
            "POST",
            "/user/send_friend_request",
            JSON.stringify({
                friend_id: memberId,
            }),
            {
                Authorization: store.getState().token,
            }
        );
        if (response && response.code === 0) {
            message.success("Request sent");
            location.reload();
        }
        console.log('Add friend:', memberId);
    };


    const onDropDownClick: any = (id: any) => {
        return ({ key }: any) => {
            if (key === '0') {
                Modal.confirm({
                    title: '确定转让群主吗？',
                    onOk() {
                        request(
                            "POST",
                            "user/transfer_owner",
                            {
                                group_id: props.conversation.conversation_id,
                                new_owner_id: id,
                            },
                            {
                                Authorization: store.getState().token,
                            }
                        ).then((res) => {
                            if (res) {
                                if (res.code === 0) {
                                    message.success('已转让群主');
                                    //刷新本页面
                                    window.location.reload();
                                } else {
                                    message.error(res.message);
                                } 
                            }
                            
                        });
                    },
                    onCancel() {
                        console.log('取消转让群主');
                    },
                });
            } else if (key === '1') {
                Modal.confirm({
                    title: '确定设为管理员？',
                    onOk() {
                        request(
                            "POST",
                            "user/add_admin",
                            {
                                group_id: props.conversation.conversation_id,
                                member_id: id,
                            },
                            {
                                Authorization: store.getState().token,
                            }
                        ).then((res) => {
                            if (res) {
                                if (res.code === 0) {
                                    message.success('设置成功');
                                    //刷新本页面
                                    window.location.reload();
                                } else {
                                    message.error(res.message);
                                } 
                            }
                            
                        });
                    },
                    onCancel() {
                        console.log('取消');
                    },
                });
            } else if (key === '2') {
                Modal.confirm({
                    title: '确定移出群聊？',
                    onOk() {
                        request(
                            "POST",
                            "/user/remove_member",
                            {
                                group_id: props.conversation.conversation_id,
                                member_id: id,
                            },
                            {
                                Authorization: store.getState().token,
                            }
                        ).then((res) => {
                            if (res) {
                                if (res.code === 0) {
                                    message.success('移出成功');
                                    //刷新本页面
                                    window.location.reload();
                                } else {
                                    message.error(res.message);
                                } 
                            }
                            
                        });
                    },
                    onCancel() {
                        console.log('取消');
                    },
                });
            } else if (key === '3') {
                Modal.confirm({
                    title: '确定取消管理员资格？',
                    onOk() {
                        request(
                            "POST",
                            "/user/remove_admin",
                            {
                                group_id: props.conversation.conversation_id,
                                member_id: id,
                            },
                            {
                                Authorization: store.getState().token,
                            }
                        ).then((res) => {
                            if (res) {
                                if (res.code === 0) {
                                    message.success('已取消');
                                    //刷新本页面
                                    window.location.reload();
                                } else {
                                    message.error(res.message);
                                } 
                            }
                            
                        });
                    },
                    onCancel() {
                        console.log('取消');
                    },
                });
            }
        }
     };

    return (
        <div>
            <Button onClick={toggleExpand}>
                {expanded ? '收起用户列表' : '展开用户列表'}
            </Button>
            {/* 包裹列表的容器，设置固定高度和滚动条 */}
            <div  style={{ maxHeight: '300px', overflow: 'auto', width: '200px' }}>
                {/* 根据展开状态决定是否显示列表 */}
                {expanded && (
                    <List
                        className={styles.user_list}
                        grid={{ column: 1 }}
                        itemLayout="vertical"
                        dataSource={props.conversation.members}
                        // bordered={true}
                        renderItem={(item: any, index: any) => (
                            <List.Item>
                                <Dropdown menu={{
                                    items: (Owner && item.member_id !== store.getState().userId) ?
                                        (props.conversation.admins_ids.includes(item.member_id) ? OwnertoAdminList : OwnertoCommonList) :
                                        (Admin && item.member_id !== store.getState().userId &&
                                            item.member_id !== props.conversation.owner_id && !props.conversation.admins_ids.includes(item.member_id)) ?
                                        adminList : [],
                                   onClick: onDropDownClick(item.member_id)
                                 
                                }}
                                    placement="bottomLeft" trigger={['contextMenu']}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.member_avatar} />}
                                    title={item.member_name}
                                    description={
                                        <div>
                                            {/* 根据成员的角色显示不同的标签 */}
                                            {isOwner(item.member_id) && <Tag color="gold">群主</Tag>}
                                            {isAdmin(item.member_id) && <Tag color="blue">管理员</Tag>}
                                            {/* 根据好友关系决定是否显示添加好友按钮 */}
                                            {(!friendIds.includes(item.member_id) && store.getState().userId !== item.member_id) && (
                                                <Button type="dashed" onClick={() => handleAddFriend(item.member_id)}>添加好友</Button>
                                            )}
                                        </div>
                                    }
                                    />
                                </Dropdown>
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default UserList;
