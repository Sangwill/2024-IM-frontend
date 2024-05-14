
import {useRef, useState} from "react";
import {request} from "../../utils/network";
import {Button, Form, Input, message, Space, Typography} from "antd";
import {store} from "../../utils/store";
import  styles  from "../../styles/layout.module.css";
import { useRouter } from "next/router";
import ProForm from "@ant-design/pro-form";

const { Title } = Typography;

const EditProfile = (props: any) => {
    const router = useRouter();
    const code = useRef(0);
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [oldpwd, setOldPwd] = useState("");
    const [form] = ProForm.useForm();
    const handleCancel = (e: any) => {
        props.setAuth(false);
    };
    //
    interface Profile {
        oldPassword: string;
        newPassword: string;
        email: string;
        phoneNumber: string;
        username: string;
    }

    const handleClick = async (e: any) => {
        const values = await form.validateFields(); // 这里会触发表单项的验证
        const userInfo = {
            username: user,
            new_password: pwd,
            email: email,
            phone: phone,
            old_password: values.old_password
        };
        const header = {
            Authorization: store.getState().token,
        };
        request("PUT", "user/update_auth_info" , JSON.stringify(userInfo), header).then(res => {
            if (res)
            {
                if (res.code === 0) {
                message.info("修改成功,请重新登录");
                store.dispatch({ type: "getToken", data: "" });
                router.push("/login");
            }
            else {
                message.error("获取用户信息错误！").then(r => "error");
            }}
        });
    };

    return (
        <div>
            <div className={styles.register}>
            <Title level={5} color="blue">修改个人信息</Title>
            <br/>
            <Form
                form={form}
                name="Register"
                style={{ maxWidth: 600 }}
                scrollToFirstError
                >
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: false,
                        message: 'Please input your E-mail!',
                    },
                    {
                        max: 40,
                        message: 'Too long!',
                    },
                    ]}
                >
                    <Input 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="phone"
                    rules={[
                        {
                            pattern: /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/,
                            message: 'please enter right phone number'
                        },
                        {
                            required: false,
                            message: 'Please input your phone number!',
                        },
                    ]}
                    
                >
                    <Input 
                        onChange={(e) => setPhone(e.target.value)}
                        value={email}
                    />
                </Form.Item>
                <Form.Item
                    name="new_password"
                    label="new Password"
                    rules={[
                    {
                        required: false,
                        message: 'Please input your password!',
                    },
                    {
                        min: 5,
                        message: 'Too short!',
                    },
                    {
                        max: 20,
                        message: 'Too long!',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                    />
                </Form.Item>
                <Form.Item
                    name="old_password"
                    label="old Password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your old password!',
                    },
                    // {
                    //     min: 5,
                    //     message: 'Too short!',
                    // },
                    // {
                    //     max: 20,
                    //     message: 'Too long!',
                    // },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        onChange={(e) => setOldPwd(e.target.value)}
                        value={oldpwd}
                    />
                </Form.Item>
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { 
                            required: false, 
                            message: 'Please input your username!', 
                            whitespace: true 
                        },
                        {
                            min: 2,
                            message: 'Too short!',
                        },
                        {
                            max: 20,
                            message: 'Too long!',
                        },
                    ]}
                >
                    <Input 
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}>
                    <Button type="primary" htmlType="submit" onClick={handleClick}>
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
        </div>
    );
};

export default EditProfile;