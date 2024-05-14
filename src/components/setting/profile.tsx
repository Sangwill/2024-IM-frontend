import { useEffect, useState } from "react";
import { request } from "../../utils/network";
import {Avatar, Button, Image, message, Skeleton, Spin, Upload} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { store } from "../../utils/store";
import styles  from "../../styles/profile.module.css";
import {avatarToBase64} from "../../utils/utilities";
import { headers } from "next/dist/client/components/headers";
import router, { Router } from "next/router";

const ImageUpload = (props: any) => {
    const header = {
        Authorization: store.getState().token,
    };
    const customUpload = async (options: any) => {
        const { onSuccess, onError, file } = options;
        try {
            //alert(header.Authorization);
            const base64 = await avatarToBase64(file);
            const response = await request("PUT", `user/update_normal_info`, {
                username: store.getState().username,
                avatar_base64: base64,
            }, header);
            if (response.code === 0) {
                props.setImage(base64);
            }
            onSuccess();
        }
 catch (error) {
            message.error("Upload failed");
            onError(error);
        }
    };

    const beforeUpload = (file:any) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("You can only upload image files!");
        }
        return isImage;
    };

    return (
        <Upload
            accept="image/*"
            beforeUpload={beforeUpload}
            customRequest={customUpload}
            showUploadList={false}
        >
            <Button icon={<UploadOutlined />} >Upload Image</Button>
        </Upload>
    );
};

const Profile = () => {

    const [response, setResponse] = useState<any>(null);
    const [image, setImage] = useState<any>("/headshot/01.svg");
    const [pload, setPload] = useState(false);
    const [iload, setIload] = useState(false);
    const header = {
        Authorization: store.getState().token,
    };
    useEffect(() => {
        //alert (store.getState().token);
        request("GET", "user/profile/" + store.getState().username, "", header).then(res => {
            if(res)
            {
                if (res.code === 0) {
                setResponse(res);
                setImage(res.avatar_base64);
                setPload(true);
            }
            else {
                message.info("请重新登录");
                router.push("/login");
            }}
        });
        //const response = request("GET", "user/profile/" + store.getState().username, JSON.stringify(token));
        }, []
    );


    // return {iload && pload}

    return pload
        ?
        (
        <div className={styles.profile}>
            <Avatar size={300} src={image} />
            <br /><br />
            <ImageUpload setImage={setImage}/>
            <br/>

                <div>
                    <br />
                    Username: {response.username}
                    <br />
                    Email: {response.email}
                    <br />
                    Phone: {response.phone}
                </div>

            <br />
        </div>
        )
        :
        (
        <div className={styles.profile}>
            <Spin />
        </div>
        )
        ;
};

export default Profile;