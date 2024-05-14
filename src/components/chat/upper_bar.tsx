import { Checkbox, Input, List, MenuProps, Modal, message } from "antd";
import { useEffect, useState } from "react";
import styles from "@/styles/layout.module.css";
import { request } from "@/utils/network";
import { store } from "@/utils/store";


const CreateSession = (props: any) => {

    const [load, setLoad] = useState(true);
    const [friends, setFriends] = useState<any[]>([]);
    const [selected, setSelected] = useState([-1]);
    const [isButtonDisabled, setDisable] = useState(false);
    const [name, setName] = useState('');
    const header = {
        Authorization: store.getState().token,
    };
    useEffect(() => {
        request(
            "GET",
            "user/get_friends",
            "",
            header
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
        })}, [props.open]);

    const handleOk = () => {
        message.success("创建成功");
        setDisable(true);
        const member_ids = selected.filter((each: any) => each !== -1);
        request(
            "POST",
            "user/create_group_conversation",
            JSON.stringify(
                {
                    members_id: [...member_ids],
                    name: name,
                },
            ),
            header
        ).then((res: any) => {
            setDisable(false);
            props.setOpen(false);
            props.setRefresh((s: any) => !s);
        });
    }

    const handleCancel = () => {
        props.setOpen(false);
    };

    const onChange = (item: any) => {
        return (e: any) => {
            if (e.target.checked) setSelected((selected: number[]) => [...selected, item.friend_id]);
            else setSelected((selected: any) => selected.filter((x: any) => x !== item.friend_id));
        };
    }
    return (

        <Modal title={"选择好友创建一个群聊"} open={props.open} onOk={handleOk} onCancel={handleCancel}
               okButtonProps={{ disabled: isButtonDisabled }}>
            {load
                ?
                (
                    <div>
                    </div>
                    )
                :
                (
                    <div>
                        输入群聊名称:<Input onChange={(e: any) => setName(e.target.value)}></Input>
                        <List
                            itemLayout="vertical"
                            size="large"
                            // pagination={{pageSize: 3,}}
                            dataSource={friends}
                            renderItem={(item: any) => (
                                <List.Item key={item.friend_id}>
                                    <Checkbox onChange={onChange(item)}>
                                    </Checkbox>
                                    {item.friend_name}
                                </List.Item>
                            )}
                        />
                    </div>
                )}
        </Modal>

    );
};


const items: MenuProps['items'] = [
    {
        label: '创建群聊',
        key: '1',
    },
];

const UpperBar = (props: any) => {
	const [query, setQuery] = useState("");

    const [open, setOpen] = useState(false);

    const onClick: MenuProps['onClick'] = ({ key }) => {
        if( key === '1' ) setOpen(true);
    };

    return (
        <div className={styles.column_search}>
            <div className={styles.chat_search_bar}>
                所有聊天
            </div>
            <div className={styles.add_button}>
                <div
                    onClick={(e) => {
                        setOpen(true);
                    }}>
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="36" height="36" rx="3" fill="none" stroke="#000000" stroke-width="3" stroke-linejoin="round" /><path d="M24 16V32" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /><path d="M16 24L32 24" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                
            </div>
            <CreateSession open={open} setOpen={setOpen} setRefresh={props.setRefresh}/>
        </div>
    )
}

export default UpperBar;