import React, { useState, useEffect, useRef } from 'react'
import Conversation from "../../components/conversations/Conversation"
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import Nav from "../../components/Nav"
import "./msg.css"
import { readCookie } from "../../utils/readCookie";
import { SendOutlined, CloseCircleOutlined, WarningTwoTone } from "@ant-design/icons"
import { Input, Button, Popconfirm, notification, Avatar, } from "antd"
import axios from 'axios'
import { io } from "socket.io-client";
import useSound from 'use-sound';
import notify from "./notification.mp3"
import InputEmoji from 'react-input-emoji'

const baseurl = "https://chatapp-server-nmk.herokuapp.com/api"
const userId = readCookie('id');
const { TextArea } = Input;


export default function Messenger() {
    const [play] = useSound(notify);
    notification.config({ duration: 2 });
    const scrollRef = useRef()
    const convTab = useRef(null)
    const [conversation, setConversation] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [friend, setFriend] = useState(null);
    const [flag, setFlag] = useState(false);
    const [typingData, setTypingData] = useState(null)
    const [typing, setTyping] = useState(false)

    const socket = useRef();

    useEffect(() => {
        socket.current = io("https://chatapp-server-nmk.herokuapp.com/");
        socket.current.on("getMessage", (data) => {

            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
        socket.current.on('display', (data) => {
            setTypingData(data)
            if(data.typing){
                setTyping(true)
            }else{
                setTyping(false)
            }
        })
    }, [])

    useEffect(() => {
        if (arrivalMessage) {
            play();
            if (currentChat?.members.includes(arrivalMessage.sender)) {
                if (messages) {
                    setMessages([...messages, arrivalMessage])
                } else {
                    setMessages([arrivalMessage])
                }
            }

        }

    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUser", userId)
        socket.current.on("getUsers", users => {
            setOnlineUsers(users)
        })
    }, [userId])

    //getting conversation
    useEffect(() => {
        const getConversation = async () => {
            try {
                const res = await axios.get(`${baseurl}/conversation/${userId}`, { headers: { Authorization: 'Bearer ' + readCookie('token') } })
                setConversation(res?.data?.conversation);
                setFlag(false);
            } catch (err) {
                console.log("err", err)
            }
        }
        getConversation();

    }, [userId, flag])

    useEffect(() => {

        if (currentChat) {
            const getMessages = async () => {
                try {
                    const res = await axios.get(`${baseurl}/message/${currentChat.id}`, { headers: { Authorization: 'Bearer ' + readCookie('token') } })
                    setMessages(res?.data?.messages)
                }
                catch (err) {
                    console.log("err", err)
                }
            }
            const friendId = currentChat?.members.find(m => m !== userId)
            const getUser = async () => {
                try {
                    const res = await axios.get(`${baseurl}/user/${friendId}`, { headers: { Authorization: 'Bearer ' + readCookie('token') } })
                    setFriend(res?.data)
                }
                catch (err) {
                    console.log("err", err)
                }
            }

            getUser();
            getMessages();
        }
    }, [currentChat])

    useEffect(() => {
        if (newMessage !== "") {
            setTyping(true)
            socket.current.emit('typing', { typing: true, userId })
        } else {
            setTyping(false)
        }

    }, [newMessage])

    console.log("111",typing)

    const handleSubmit = async () => {
        setTyping(false);
        socket.current.emit('typing', { typing: false, userId })
        const message = {
            text: newMessage.trim(),
            conversationId: currentChat.id
        }

        const receiverId = currentChat.members.find(member => member !== userId);

        socket.current.emit("sendMessage", {
            senderId: userId,
            receiverId,
            text: newMessage.trim()
        })


        try {
            const res = await axios({
                method: "POST",
                url: `${baseurl}/message`,
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + readCookie('token'),
                },
                data: message

            })
            if (!messages) {
                setMessages([res?.data?.message])
            } else {
                setMessages([...messages, res?.data?.message])
            }
            
            setNewMessage("")

        } catch (err) {
            console.log("err", err)
        }
    }

    useEffect(() => {
        const scroll = () => {
            return scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        scroll();
    }, [messages])

    const confirm = async (e) => {
        try {
            setFlag(true)
            const res = await axios({
                method: "POST",
                url: `${baseurl}/conversation`,
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + readCookie('token'),
                },
                data: { receiverId: e.userId }
            })
        }
        catch (err) {
            sendNotification('error', {
                title: "Conflict",
                msg: "Chat already created"
            })
        }

    }

    const handleClose = () => {
        setCurrentChat(null)
        setFriend(null)
        setMessages([])
    }

    const sendNotification = (type, data) => {
        notification[type]({
            message: data.title,
            description: data.msg,
        });
    };

    function useWindowSize() {
        const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
        useEffect(() => {
            const handleResize = () => {
                setSize([window.innerHeight, window.innerWidth]);
            }
            window.addEventListener("resize", handleResize);
            return () => {
                window.addEventListener("resize", handleResize);
            }
        }, []);
        return size;
    }

    const [height, width] = useWindowSize();

    return (
        <div>
            <Nav />
            <div className='msgContainer' >
                <div className='chatMenu' >
                    <div className='conversationTitle' ><h3> All Conversation</h3></div>
                    <div className='chatMenuWrapper' >
                        {conversation?.map((c, index) => {
                            return (
                                <div ref={convTab} id={index} className='selectConversation' key={index} onClick={(e) => setCurrentChat(c)}  >
                                    <Conversation conversation={c} currentUser={userId} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='chatBox' >
                    <>
                        {
                            currentChat ?
                                <>
                                    <div className='chatHeader'  >
                                        <div className='chatHeadName'>
                                            <Avatar className='chatHeaderAvatar' size="large" >{friend && (friend?.username.split('')[0]).toUpperCase()}</Avatar>
                                            <span style={{ fontWeight: "bold" }} >{friend && friend?.username}</span>
                                        </div>
                                        <div className='chatHeaderButton' ><CloseCircleOutlined style={{ fontSize: "18px", fontWeight: "400" }} onClick={() => handleClose()} /></div>
                                    </div>
                                    <div className='chatBoxWrapper' >
                                        <div className='chatBoxTop' >
                                            {messages?.map((m, index) => (
                                                <div key={index} ref={scrollRef} >
                                                    <Message message={m} own={m.sender === userId} friend={friend} />
                                                </div>
                                            ))}
                                        </div>
                                            { currentChat &&  typingData && typingData.userId === friend.id && <div style={{display:"flex", justifyContent:"center", color:"gray" }}>{typing && `${friend.username} is typing..` }</div>}
                                        <div className='chatBoxBottom' >
                                            <div className='footerMsg' >
                                                {/* <Input
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onPressEnter={() => handleSubmit()}
                                                    className='chatMessageInput'
                                                    placeholder='Type something...'
                                                /> */}
                                                <InputEmoji
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e)}
                                                    onEnter={() => handleSubmit()}
                                                    placeholder="Type a message"
                                                />


                                                {/* <Button disabled={newMessage === ""} className='chatSubmitButton' onClick={() => handleSubmit()} >Send <SendOutlined /></Button> */}
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <div className='noChat' >
                                    <WarningTwoTone style={{ fontSize: "70px" }} twoToneColor={"#581b72e6"} />
                                    <div className='noChatText' style={{ textAlign: "center" }} >
                                        <h2>Stay connected together</h2>
                                        <h5>Open a chat to start a conversation</h5>
                                    </div>
                                </div>
                        }
                    </>
                </div>
                <div className='chatOnline' >
                    <div className='conversationTitle' ><h3> Online ({onlineUsers.length}) </h3></div>
                    <div className='chatOnlineWrapper' >
                        {/* <div className='chatOnlineTitle' ><h3>Online ({onlineUsers.length})</h3></div> */}
                        {
                            onlineUsers?.map(user => {
                                return (
                                    <>
                                        {user.userId !== userId ?
                                            <Popconfirm
                                                placement="left"
                                                title="Create chat with this friend?"
                                                onConfirm={() => confirm(user)}
                                                okText="add"
                                                cancelText="cancel"
                                            >
                                                <div  >
                                                    {<ChatOnline own={user.userId === userId} onlineUsers={user} currentId={userId} />}
                                                </div>
                                            </Popconfirm>
                                            : <div  >
                                                {<ChatOnline own={user.userId === userId} onlineUsers={user} currentId={userId} />}
                                            </div>}

                                    </>
                                )
                            }
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
