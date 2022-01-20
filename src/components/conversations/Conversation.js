import React, { useState, useEffect } from 'react'
import { Avatar } from 'antd';
import "./conversation.css"
import { readCookie } from "../../utils/readCookie";
import axios from "axios"
import moment from 'moment';

const baseurl = "https://chatapp-server-nmk.herokuapp.com/api"

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
            <div className='conv'>
                <div className='imageConversation' > <Avatar style={{ width: "50px", height: "50px" }} className='avatarConversation' size="large" >{user && (user?.username.split('')[0]).toUpperCase()}</Avatar> </div>
                <div className='conversationInfo' >
                    <div className='nameInfo' >
                        <h4>{user?.username}</h4>
                        {/* <div> <span style={{fontSize:"9px", color:"gray"}} > {moment(conversation?.lastMessage?.time).fromNow()}</span></div> */}
                    </div>
                    <div className='textConversation' ><span>{conversation?.lastMessage?.msg.substring(0,25) + "..."}</span><div> <span style={{fontSize:"9px", color:"gray"}} > {moment(conversation?.lastMessage?.time).fromNow()}</span></div></div>
                </div>
            </div>
    )
}
