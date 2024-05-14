import React from "react";
import {
    MessageOutlined,
    TeamOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import {Menu} from "antd";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
    label: string,
    key: string,
    onClick: { (key: string): void; (key: string): void; (key: string): void; },
    icon?: React.JSX.Element,
    children?: undefined,
    type?: "group",
): MenuItem {
    return {
        key,
        icon,
        onClick,
        children,
        label,
        type,
    } as MenuItem;
}

const TopicMenu = ({ selectedKey, changeSelectedKey }: { selectedKey: string, changeSelectedKey: (key: string) => void }) => {

    const items: MenuItem[] = [
        getItem("聊天", "1", changeSelectedKey , <MessageOutlined />),
        getItem("好友", "2", changeSelectedKey,  <TeamOutlined />),
        getItem("设置", "3", changeSelectedKey, <InfoCircleOutlined />,)
    ];

    return (
        <Menu
            selectedKeys={[selectedKey]} // Convert selectedKey to an array
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="light"
            items={items}
            />
    );
};
export default TopicMenu;