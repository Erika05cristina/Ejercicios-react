import React from 'react';

const Notification = ({ notification }) => {
  if (!notification.message) return null;

  return (
    <div
      style={{
        padding: '10px',
        backgroundColor: notification.type === 'success' ? 'green' : 'red',
        color: 'white',
        marginBottom: '20px',
        borderRadius: '5px',
        textAlign: 'center',
      }}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
