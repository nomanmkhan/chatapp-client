import React, { useEffect, useState } from 'react';
import { Button } from "antd"
import { LogoutOutlined } from "@ant-design/icons"
import { readCookie } from "../utils/readCookie";

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

    useEffect(() => {
        const userName = (name) => {
            setUser(name.charAt(0).toUpperCase() + name.slice(1))
        }
        userName(readCookie('username'))
    }, [user])

    return (
        <div className='nav'>
            <h2 style={{ color: "grey" }} >messages</h2>
            <h4>Hello {user} </h4>
            <Button icon={<LogoutOutlined />} onClick={handleLogout} />
        </div >
    );
}

export default Nav;
