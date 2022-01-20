import React, { useState, useEffect } from 'react'
import { Avatar } from 'antd';
import "./conversation.css"
import { readCookie } from "../../utils/readCookie";
import axios from "axios"

const baseurl = "http://172.16.2.109:4000/api"

export default function Conversation({ conversation, currentUser, name }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const friendId = conversation.members.find(m => m !== currentUser)
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
    }, [conversation, currentUser])

    return (
        <div className='conversation'>
            <Avatar className='avatarConversation' size="large" >{ user && (user?.username.split('')[0]).toUpperCase()}</Avatar>
            <span>{user?.username}</span>
        </div>
    )
}
