import styles from "@/styles/chat.module.css";
import { useEffect, useRef, useState } from "react";
import {Avatar, Badge} from "antd";

const scaleImage = (image: any, width: any, height: any) => {
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    // 在画布上绘制图像并进行缩放
    ctx.drawImage(image, 0, 0, width, height);

    return canvas;
};

const CombinedImage = (props: any) => {
    const images = props.image;
    const canvasRef = useRef<any>();
    const gridSize = 2;

    const remToPx = (rem: any) => {
        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        return rem * fontSize;
    };

    const sz = remToPx(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        images.slice(0, 4).forEach((image: any, index: number) => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                const scaledImage = scaleImage(img,2 * sz, sz);
                context.drawImage(scaledImage, 2*sz* Number(index%2!==1), sz * Number(index <= 1));
            };
        });
    }, [images]);

    return (
        <div>
            <canvas className={styles.message_item_left} ref={canvasRef}  />
        </div>
    );
};


const MessageItem = (props: any) => {
    
    const [canv, setCanv] = useState<any>([]);
    useEffect(() => {
        if (props.conversation.is_group) {
            const images = props.conversation.members.map((member: any) => member.member_avatar);
            setCanv(images);
        }
        let i = canv.length;
        while(i < 4) {
            i++;
            setCanv((images: any) => [...images, ""]);
        }

    },[]);

    return (
        <div className={
           styles.message_item}>
            {props.conversation.is_group ?
                <CombinedImage image={canv} />:
                <img className={styles.column_item_left} src={props.conversation.friend_avatar} />}
            <div className={styles.message_item_mid}>
                <div className={styles.message_item_title}>
                    {props.conversation.name}
                    
                    
                </div>
               
            </div>
            {
                props.conversation.unread_count !== 0 ?
                <div style={{ color: 'blue' }}>
                [{props.conversation.unread_count}]
                </div> :
                <div></div>
            }
            
            
        </div>
    )
};

export default MessageItem;