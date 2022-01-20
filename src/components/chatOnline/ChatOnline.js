import React, { useState, useEffect } from 'react'
import "./chatOnline.css"
import { Avatar, Badge } from 'antd';
import { readCookie } from "../../utils/readCookie";
import axios from 'axios';
const baseurl = "http://172.16.2.109:4000/api"

export default function ChatOnline({ onlineUsers, currentId, own }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const friendId = onlineUsers.userId
        if (friendId) {
            const getUser = async () => {
                try {
                    const res = await axios.get(`${baseurl}/user/${friendId}`, { headers: { Authorization: 'Bearer ' + readCookie('token') } })
                    setUser(res?.data)
                }
                catch (err) {
                    console.log("err", err)
                }
            }
            getUser();
        } else {
            setUser(null)
        }
    }, [onlineUsers, currentId])

    return (
        <div className='chatOnline'>
            <div className='chatOnlineFriend'>
                <div className='chatOnlineContainer' >
                    <Avatar className='chatOnlineImage' size={"large"}  >{user && (user.username.split('')[0]).toUpperCase()}</Avatar>
                    <div className='chatOnlineBadge' />
                </div>
                <span className='chatOnlineName' >{user?.username} {own && "(me)"} </span>
            </div>
        </div>
    )
}
