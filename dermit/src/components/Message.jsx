export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Message({ message }) {
  
  function formatMessageTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString().slice(0, 5);
  }

  return (
    <li
      className={classNames(
        "mt-1 mb-1 flex",
        message.is_response
          ? "justify-end"
          : "justify-start"
      )}
    >
      <div
        className={classNames(
          "relative max-w-xl rounded-lg px-2 py-1 text-gray-700 shadow",
          message.is_response ? "bg-gray-100" : ""
        )}
      >
        <div className="flex items-end">
          <span className="block">{message.content}</span>
          <span
            className="ml-2"
            style={{
              fontSize: "0.6rem",
              lineHeight: "1rem",
            }}
          >
            {formatMessageTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    </li>
  );
}