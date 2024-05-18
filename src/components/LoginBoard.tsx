import { useState, useContext } from "react";
import {request} from "../utils/network";
import { MailOutlined, LockOutlined, UserOutlined,} from "@ant-design/icons";
import { message, Tabs } from "antd";
import ProForm from "@ant-design/pro-form";
import {LoginForm, ProFormText, ProFormCaptcha, ProConfigProvider} from "@ant-design/pro-components";
import {useRouter} from "next/router";
import {store} from "../utils/store";
type LoginType = "email" | "account";

export const LoginInput = (props:any) => {

    const form = props.form;

    return (
        <div>
            <Tabs
                centered
                activeKey={props.loginType}
                onChange={(activeKey) => props.setLoginType(activeKey as LoginType)}
            >
                <Tabs.TabPane key={"account"} tab={"账号密码"} />
            </Tabs>
        {props.loginType === "account" && (
        <>
            <ProFormText
                name="username"
                fieldProps={{
                    size: "large",
                    prefix: <UserOutlined className={"prefixIcon"} />,
                }}
                placeholder={"用户名"}
                rules={[
                    {
                        required: true,
                        message: "请输入用户名!",
                    },
                ]}
            />
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

const LoginBoard = (props:any) => {

    const [form] = ProForm.useForm();
    const [loginType, setLoginType] = useState<LoginType>("account");
    const router = useRouter();
    
    const handleUserSubmit = async (e: any) => {

        const userInfo = {
            username: e.username,
            password: e.password,
        };

        try {
            const response = await request(
                "POST",
                "user/login",
                JSON.stringify(userInfo),
            );
            if(response.code !== 0) {
                message.error(response.info);
            }
            else {
                //alert("登录成功！");
                store.dispatch({ type: "getUsername", data: e.username });
                store.dispatch({ type: "getToken", data: response.token });
                store.dispatch({ type: "getId", data: response.user_id });
                //const a = store.getState().token;
                //alert(a);
                console.log("connecting")
                store.dispatch(
                    {
                        type: 'socketConnect',
                        data: new WebSocket("wss://django-dream.app.secoder.net/ws/?username="+e.username)
                    }
                )
                router.push("/chat");
            }
        }
 catch(err) {
            console.log(err);
        }
    };

  
   

    return (
        <div>
            <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: "white" }}>
                <LoginForm
                    title="IM Chat"
                    subTitle="欢迎使用IM Chat!"
                    form={form}
                    onFinish={handleUserSubmit}
                >
                    <LoginInput form={form} loginType={loginType} setLoginType={setLoginType}/>
                </LoginForm>           
            </div>
            <div style={{float: "right", fontSize: "14px"}}>
                                没有账号？
                            <a onClick={()=>router.push("/register")}>注册一个！</a>
                            </div>
        </ProConfigProvider>
        </div>
       
    );
};

export default LoginBoard;
