const Notification = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={type === "error" ? "notification error" : "notification"}>
      {message}
    </div>
  );
};

export default Notification;
