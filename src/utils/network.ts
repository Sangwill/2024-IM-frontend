/**
 * @note 本文件是一个网络请求 wrapper 示例，其作用是将所有网络请求汇总到一个函数内处理
 *       我们推荐你在大作业中也尝试写一个网络请求 wrapper，本文件可以用作参考
 */

import { message } from "antd";
import axios, { AxiosError, AxiosResponse } from "axios";

const network = axios.create({
    baseURL: process.env.NODE_ENV !== 'production' ? "http://127.0.0.1:8000/" :"https://django-dream.app.secoder.net/",
});

enum NetworkErrorType {
    CORRUPTED_RESPONSE,
    UNKNOWN_ERROR,
}

export class NetworkError extends Error {
    type: NetworkErrorType;
    message: string;

    constructor(
        _type: NetworkErrorType,
        _message: string,
    ) {
        super();

        this.type = _type;
        this.message = _message;
    }

    toString(): string { return this.message; }

    valueOf(): Object { return this.message; }
}

export const request = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: any,
    headers?: any,
) => {
    const config = {
        method,
        url,
        data,
        headers, // 将传入的 headers 添加到 Axios 请求配置中
    };
    const response = await network.request(config)
        .catch((err: AxiosError) => {
            // @note: 这里的错误处理显然是极其粗糙的，大作业中你可以根据组内约定的 API 文档细化错误处理
            message.error("error: " + (err.response?.data as any).info);
            if ((err.response?.data as any).code == 1) {
                window.location.href = "/login";
            }
            // throw new NetworkError(
            //     NetworkErrorType.UNKNOWN_ERROR,
            //     `[${err.response?.status}] ` + (err.response?.data as any).info,
            // );
        });

    if (response?.data.code === 0) {
        //alert("success: "+ response.data.info);
        return { ...response.data, code: 0 };
    }
    else {

        //message.error(response?.data.info);
    }
};