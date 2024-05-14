import { store } from "@/utils/store";
import type { AppProps } from "next/app";

import React from "react";


export default function App({ Component, pageProps }: AppProps) {
    
    let socket: any = store.getState().webSocket;
    if (socket !== null) {
        socket.onclose = () => {
            console.log("socket closed");
        }
    }
    return (
            <Component {...pageProps} />
        
    );
}