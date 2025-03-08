import React from 'react';
import './message.css';
import { format, register } from 'timeago.js';
import vi from 'timeago.js/lib/lang/vi';

register('vi', vi);

export default function Message({ message, own }) {
  return (
    <div className={own ? 'message own' : 'message'}>
      <div className="messageTop">
        <img src="images/phuong.jpg" alt="avatar" className="messageImg" />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt, 'vi')}</div>
    </div>
  );
}
