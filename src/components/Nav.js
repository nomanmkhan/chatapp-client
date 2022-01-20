import React, { useEffect, useState } from 'react';
import { Button } from "antd"
import { LogoutOutlined, WechatOutlined } from "@ant-design/icons"
import { readCookie } from "../utils/readCookie";

import "./nav.css"

function Nav(props) {
    const [user, setUser] = useState(null);
    function handleLogout() {
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(
                    /=.*/,
                    "=;expires=" + new Date().toUTCString() + ";path=/"
                );
        });
        window.location = "/login";
    }



    return (
        <div className='nav'>
            <div className='logo' >
                <WechatOutlined className='logoImg' />
                <span className='logoText'>ChatApp</span>
            </div>
            <LogoutOutlined className='logout' onClick={handleLogout} />
        </div >
    );
}

export default Nav;
