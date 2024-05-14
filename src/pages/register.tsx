import { useState, useContext } from "react";
import {request} from "../utils/network";
import styles from "../styles/register.module.css";
import {LoginForm, ProFormText, ProFormCaptcha, ProConfigProvider, ProForm} from "@ant-design/pro-components";
import { useRouter } from "next/router";
import { Button, Form, Input, Space, Typography, message } from "antd";

const { Title } = Typography;

  
const Register = (props: any) => {
    const [form] = ProForm.useForm();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [initialPwd, setInitialPwd] = useState("");
    const [confirmedPwd, setConfirmedPwd] = useState("");
    const router = useRouter();
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields(); // 这里会触发表单项的验证
    
            const userInfo = {
                username: values.username,
                password: values.password,
                email: values.email,
                phone: values.phone,
            };
    
            const response = await request(
                "POST",
                "user/register",
                JSON.stringify(userInfo),
            );
    
            if (response.code === 0) {
                message.success(response.info);
                router.push("/login");
            }
        } catch (errorInfo) {
            //message.error('Validation failed: invalid user info');
        }
    };

    return (
        <div className={styles.register}>
            <Title level={2} color="blue">Register</Title>
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
                        required: true,
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
                            required: true,
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
                    name="password"
                    label="Password"
                    rules={[
                    {
                        required: true,
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
                        onChange={(e) => setInitialPwd(e.target.value)}
                        value={initialPwd}
                    />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm Pwd"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { 
                            required: true, 
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
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}>
                    <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                        注册
                    </Button>
                    {" "} {/* Inserting a space here */}
                    <Button type="primary" htmlType="submit" onClick={(e)=>{router.push("/login")}}>
                        返回登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register;