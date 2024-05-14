import { useState } from "react";
import { Button, Divider, Input, message, Modal, Space } from "antd";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import SecondAuthentication from "./second_authentication";
import EditProfile from "./edit_profile";
import { store } from "@/utils/store";

const LogOut = () => {
    const router = useRouter();
    const [cookie, , removeCookie] = useCookies(["token"]);
    const handleLogOut = () => {
        store.dispatch({ type: "getToken", data: "" });
        removeCookie("token", {path: "/"});
        message.success("成功登出！");
        router.push("/login");
    };
    return (
        <div>
            <p> 已登录 </p>
            <Button onClick={handleLogOut}>登出</Button>
        </div>
    );
};

const DeleteUser = () => {
    return (
        <div>
            <SecondAuthentication type={"delete"}/>
        </div>
    );
};

const UserSetting = () => {

    const [isAuthenticated, setAuthentication] = useState(false);

    return (
        <div>
                <LogOut />
                <Divider />
                {/* {isAuthenticated
                ?  */}
                    <EditProfile setAuth={setAuthentication}/>
                     {/* : <SecondAuthentication setAuth={setAuthentication} type={"modify"} />} */}
                <Divider />
                <DeleteUser />
        </div>
    );
};

export default UserSetting;