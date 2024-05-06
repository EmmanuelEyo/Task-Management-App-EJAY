// app/chatlify/page.js
"use client"
import React, { useState, useEffect } from 'react';
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig';
import { ID, Query, Role, Permission } from 'appwrite';
// import PrivateRoute from '../privaterouting/PrivateRoute';
import { Trash2 } from 'react-feather';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider, useAuth } from '../context/AuthContext';
import './index.css'

const Chatlify = () => {
    const [messages, setMessages] = useState([])
    const [messageBody, setMessageBody] = useState('')
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        // Unsubscribe first to prevent multiple subscriptions
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
            (response) => {
                if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                    setMessages((prevState) => [response.payload, ...prevState]);
                } else if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                    setMessages((prevState) => prevState.filter((msg) => msg.$id !== response.payload.$id));
                }
            }
        );
    
        // Initial load of messages
        getMessages();
    
        return () => {
            unsubscribe(); // Clean up subscription on unmount
        };
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Avoid double submission
        
        setIsSubmitting(true);
        const payload = {
            user_id: user.$id,
            username: user.name,
            body: messageBody,
        };
        const permissions = [Permission.write(Role.user(user.$id))];
        
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_MESSAGES,
                ID.unique(),
                payload,
                permissions
            );
            
            // After document creation, just clear the message body without updating the messages array
            setMessageBody('');
        } catch (error) {
            console.error('Error submitting message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    


    const getMessages = async () => {
        const response = await databases.listDocuments(
            DATABASE_ID, 
            COLLECTION_ID_MESSAGES,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(20)
            ]

        )
        console.log('RESPONSE:', response)
        setMessages(response.documents)
    }

    const deleteMessage = async (message_id) => {
        if (!message_id) {
            console.error('Invalid message ID');
            return;
        }
        
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);
            setMessages((prevState) => prevState.filter((msg) => msg.$id !== message_id));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };
    
  return (

        
         
                <ProtectedRoute>
                    <main className="container">
                        <div className='room--container'>
                            <form onSubmit={handleSubmit} id='message--form'>
                                <h1 className='text-xl mb-2'>Hey {user.name}, welcome to chatlify</h1>
                                <div>
                                    <textarea required maxLength='1000' placeholder='Say something...' value={messageBody} onChange={e => {setMessageBody(e.target.value)}} />
                                </div>
                                <div className='send-btn--wrapper'>
                                    <input className="btn btn--secondary" type="submit" value="Send" disabled={isSubmitting} />
                                </div>
                            </form>
                            <div>
                                {messages.map(message => (
                                    <div key={message.$id} className='message--wrapper'>
                                        <div className='message--header'>
                                            <p>{message?.username ? (
                                                    <span>{message.username}</span>
                                                ): (
                                                    <span>Anonymous User</span>
                                                )}
                                                <small className='message-timestamp'>{new Date(message.$createdAt).toLocaleString()}</small>
                                            </p>
                                            {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                                                <Trash2 className='delete--btn' onClick={() => deleteMessage(message.$id)} />
                                            )}
                                        </div>
                                        <div className='message--body'>
                                            <span>{message.body}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </ProtectedRoute>
           
   
  );
};

export default Chatlify;
