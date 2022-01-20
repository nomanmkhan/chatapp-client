import React from 'react'
import "./message.css"
import moment from 'moment';
import { Avatar } from 'antd';
import { readCookie } from "../../utils/readCookie";

export default function Message({ message, own, friend }) {
    return (
        <div className={own ? 'message own' : 'message'}>
            <div className='messageTop' >
                <Avatar size={"large"} className='msgImage' style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{own ? readCookie('username').split('')[0].toUpperCase() : friend && friend.username.split('')[0].toUpperCase()}</Avatar>
                <div className='msgText'>
                    <div style={{ textAlign: "left",marginBottom:"5px", marginTop:"-5px" }}>
                        <span style={{ fontSize: "12px",fontWeight:"600" }} >{own ? "Me" : friend && friend.username}</span>
                    </div>
                    <p style={{ marginBottom: "5px" }} >{message?.text}</p>
                    <div style={{ textAlign: "right" }} >
                        <span style={{ fontSize: "9px" }} >
                            {moment(message?.createdAt).fromNow()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
