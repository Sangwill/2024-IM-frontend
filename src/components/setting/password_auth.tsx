import {Tabs} from "antd";
import {ProFormText} from "@ant-design/pro-components";
import {LockOutlined,} from "@ant-design/icons";

const items = [
    {label: "请输入密码", key: "account"},
];

type LoginType = "account";

const LoginInput = (props: any) => {

    const form = props.form;

    return (
        <div>
            <Tabs
                centered
                activeKey={props.loginType}
                onChange={(activeKey) => props.setLoginType(activeKey as LoginType)}
                items={items}
            />
            {props.loginType === "account" && (
                <>
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: "large",
                            prefix: <LockOutlined className={"prefixIcon"} />,
                        }}
                        placeholder={"密码"}
                        rules={[
                            {
                                required: true,
                                message: "请输入密码！",
                            },
                        ]}
                    />
                </>
            )}

        </div>
    );
};

export default LoginInput;