import { store } from "@/utils/store";
import { stringToTimestamp } from "@/utils/utilities";
import { Divider, Modal, MenuProps, Menu, DatePicker, Select, SelectProps, List, Avatar, Image, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

const AllPicker = (props: any) => {
    return <div style={{ overflowY: 'auto', maxHeight: '350px' }}>
        <List
            itemLayout="horizontal"
            dataSource={props.messages}
            renderItem={(item: any, index: number) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={
                            store.getState().imgMap[item.sender_id]
                        } />}
                        title={store.getState().memberMap[item.sender_id]}
                        description={ item.content }
                        
                    />
                </List.Item>
            )}
        />
    </div>
};

const TimestampPicker = (props: any) => {
    const [begin, setBegin] = useState<any>(0);
    const [end, setEnd] = useState<any>(2000000000000);
    const handleChange = (e: any) => {
        if(e) {
            setBegin(dayjs(e[0]).unix() * 1000);
            //message.info(dayjs(e[0]).unix() * 1000);
            setEnd(dayjs(e[1]).unix() * 1000);
            //message.info(dayjs(e[1]).unix() * 1000);
        } else {
            setBegin(0);
            setEnd(2000000000000);
        }
    }

    return <div style={{ overflowY: 'auto', maxHeight: '350px' }}>
        <RangePicker showTime onChange={handleChange} />
        <List
            itemLayout="horizontal"
            dataSource={props.messages.filter((message: any) => stringToTimestamp(message.create_time) >= begin && stringToTimestamp(message.create_time) <= end)}
            renderItem={(item: any, index: number) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={
                            store.getState().imgMap[item.sender_id]
                        } />}
                        title={store.getState().memberMap[item.sender_id] + " at " + item.create_time}
                        description={ item.content }
                    />
                </List.Item>
            )}
        />
    </div>
};

const VoidPicker = (props: any) => {
    return <div>

    </div>
 }

 const MemberPicker = (props: any) => {
    const [selected, setSelected] = useState<any>([]);
    const [msg, setMsg] = useState([]);
    const options: any = props.members.map((member: any) => {
        return {
            label: member.member_name,
            value: member.member_id
        }
    });

    const handleChange = (e: any) => {setSelected(e)};

    useEffect(() => {
        setMsg(props.messages.filter((message: any) => selected.includes(message.sender_id)));
    }, [selected]);

    return <div>
        <Select
            mode="multiple"
            style={{ width: '50%' }}
            allowClear
            onChange={handleChange}
            options={options}
        />
        <List
            itemLayout="horizontal"
            dataSource={msg}
            renderItem={(item: any, index: number) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={
                            store.getState().imgMap[item.sender_id]
                        } />}
                        title={store.getState().memberMap[item.sender_id]}
                        description={ item.content }
                    />
                </List.Item>
            )}
        />
    </div>

}

const ChatHistory = (props: any) => {
    const items: MenuProps['items'] = [
        {
            label: '所有',
            key: 'all',
        },{
            label: '按时间顺序',
            key: 'time',
        }, {
            label: '按发送成员',
            key: 'member',
        },
    ];

    const [current, setCurrent] = useState('all');
    const handleOk = () => props.setOpen(false);
    const handleCancel = () => props.setOpen(false);
    const onClick: MenuProps['onClick'] = (e: any) => setCurrent(e.key);

    return (
        <Modal title={"筛选聊天记录"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Divider />
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            <br />
            {current === 'all'
                ? <AllPicker members={props.members} messages={props.messages} images={props.images}/>
                : current === 'time'
                    ? <TimestampPicker members={props.members} messages={props.messages} images={props.images} />
                    :
                    props.conversation.is_group
                        ? <MemberPicker members={props.conversation.members} messages={props.messages}/>
                        : <VoidPicker/>
            }
        </Modal>
    )
    
}

export default ChatHistory;