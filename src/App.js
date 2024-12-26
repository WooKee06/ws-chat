import React, { useState, useEffect } from "react";
import "./App.css";
import Logo from "./img/Logo.jpg";
import Send from "./img/Send.jpg";
function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "welcome") {
          setUserId(data.userId); // Устанавливаем ID пользователя
        } else {
          setMessages((prev) => [...prev, data]); // Добавляем новое сообщение
        }
      } catch (error) {
        console.error("Ошибка при обработке сообщения:", error);
      }
    };

    return () => {
      ws.close(); // Закрываем соединение при размонтировании
    };
  }, []);

  const sendMessage = () => {
    if (socket && input) {
      const message = { text: input };
      socket.send(JSON.stringify(message));
      setInput("");
    }
  };

  console.log(messages, "messages");

  return (
    <>
      <div className="header">
        <img className="logo" src={Logo} alt="" />
        <div>
          <p className="first">Send a message to our chat</p>
          <p className="second">Nana's first project</p>
        </div>
      </div>

      <div className="bg">
        <svg
          width="1228"
          height="751"
          viewBox="0 0 1228 751"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_2003_23)">
            <circle cx="718" cy="590" r="140" fill="#AAAAAA" />
          </g>
          <g filter="url(#filter1_f_2003_23)">
            <circle cx="521" cy="707" r="207" fill="#B9B9B9" />
          </g>
          <defs>
            <filter
              id="filter0_f_2003_23"
              x="278"
              y="150"
              width="880"
              height="880"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="150"
                result="effect1_foregroundBlur_2003_23"
              />
            </filter>
            <filter
              id="filter1_f_2003_23"
              x="-186"
              y="0"
              width="1414"
              height="1414"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="250"
                result="effect1_foregroundBlur_2003_23"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="wrapper">
        <div className="msg-wrapper">
          <div className="msg">Добро пожаловать в чат!</div>
          {messages.map((msg, index) => (
            <div
              className={`msg ${msg.userId === userId ? "my-msg" : ""}`}
              key={index}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="input">
          <div className="input-container">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Cообщение..."
            ></input>
          </div>
          <img className="send" onClick={sendMessage} src={Send} alt="" />
        </div>
      </div>
    </>
  );
}

export default App;
