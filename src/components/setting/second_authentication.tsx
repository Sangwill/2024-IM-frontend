import {useState} from "react";
import ProForm from "@ant-design/pro-form";
import {useRouter} from "next/router";
import {Button, message, Modal} from "antd";
import {request} from "../../utils/network";
import LoginInput from "./password_auth";
import {store} from "../..//utils/store";
const SecondAuthentication = (props: any) => {
    const [open, setOpen] = useState(false);
    const [loginType, setLoginType] = useState("account");
    const [form] = ProForm.useForm();
    const router = useRouter();

    const handleAuth = () => {
        setOpen(true);
    };

    const handleOk = async (e: any) => {
        {
            const user = form.getFieldValue("username");
            const pwd = form.getFieldValue("password");
            if(user === "" || pwd === "") {
                message.error("请输入完整的信息！");
                return;
            }
            const response = await request(
                "POST",
                "/api/people/modify",
                JSON.stringify({
                    userName: user,
                    password: pwd,
                })
            );
            if (response.code === 0) {
                message.success("二次验证成功！");
                setOpen(false);
                props.setAuth(true);
            }
 else {
                message.error("二次验证失败！");
            }
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        {
            const user = form.getFieldValue("username");
            const pwd = form.getFieldValue("password");
            if (user === "" || pwd === "") {
                message.error("请输入完整的信息！");
                return;
            }
            const header = {
                Authorization: store.getState().token,
            };
            const response = await request(
                "POST",
                "/user/logoff",
                JSON.stringify({
                    password: pwd,
                }),
                header
            );
            if (response.code === 0) {
                message.success("删除用户成功！");
                setOpen(false);
                await router.push("/login");
            }
 else {
                message.error("删除用户失败...");
            }
        }
    };

    return (
        <div>
            <div>{props.type==="modify"?"验证身份以修改你的个人信息":"验证身份以删除用户"}</div>
            <br />
            <Button onClick={handleAuth}>验证身份</Button>
            <Modal title="验证你的身份" open={open} onOk={props.type==="modify"?handleOk:handleDelete} onCancel={handleCancel}>
                <ProForm form={form} submitter={{resetButtonProps: {style: {display: "none"}}, submitButtonProps: {style: {display: "none"}}}} >
                    <LoginInput form={form} loginType={loginType} setLoginType={setLoginType}/>
                </ProForm>
            </Modal>
        </div>
    );
};

export default SecondAuthentication;