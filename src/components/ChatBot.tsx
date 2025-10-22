'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

import { sendChatMessage } from "@/lib/chatApi";

type ChatMessage = {
  id: number;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
};

type StyleMap = Record<string, CSSProperties>;

const PRIMARY_GRADIENT = "linear-gradient(135deg, rgba(61,245,242,0.92), rgba(146,114,255,0.95))";
const ICON_SHADOW = "0 24px 48px rgba(8, 17, 36, 0.55)";
const WINDOW_BACKGROUND = "rgba(7, 13, 34, 0.92)";
const PANEL_BACKGROUND = "rgba(10, 18, 38, 0.9)";
const BORDER_COLOR = "rgba(255, 255, 255, 0.12)";
const INPUT_BACKGROUND = "rgba(5, 12, 30, 0.85)";
const TEXT_PRIMARY = "rgba(226, 232, 240, 0.92)";
const TEXT_MUTED = "rgba(148, 163, 184, 0.78)";

const getBotResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("service") || lowerMessage.includes("what do you do")) {
    return "We offer comprehensive technology solutions including Web Development, Mobile App Development, and Cloud Solutions. Would you like to know more about any specific service?";
  }
  if (lowerMessage.includes("contact") || lowerMessage.includes("reach")) {
    return "You can reach us through our contact page or call us directly. Would you like me to help you get in touch with our team?";
  }
  if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
    return "Our pricing varies based on project requirements. I'd be happy to connect you with our team for a personalized quote. Would you like to schedule a consultation?";
  }
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! Welcome to Trinix. I'm here to help you learn more about our services and how we can help transform your business. What would you like to know?";
  }
  return "That's a great question! I'd love to connect you with one of our specialists who can provide detailed information. Would you like me to arrange a consultation for you?";
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hi! I'm Trinix AI Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-10px); opacity: 1; }
      }

      .typing-dot-1 { animation-delay: 0ms; }
      .typing-dot-2 { animation-delay: 200ms; }
      .typing-dot-3 { animation-delay: 400ms; }

      .chat-messages::-webkit-scrollbar {
        width: 6px;
      }

      .chat-messages::-webkit-scrollbar-track {
        background: rgba(12, 20, 38, 0.6);
        border-radius: 3px;
      }

      .chat-messages::-webkit-scrollbar-thumb {
        background: rgba(61, 245, 242, 0.35);
        border-radius: 3px;
      }

      .chat-messages::-webkit-scrollbar-thumb:hover {
        background: rgba(61, 245, 242, 0.55);
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const styles = useMemo(() => {
    return {
      chatBotContainer: {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 1000,
        fontFamily: "var(--font-inter, 'Inter', system-ui)",
      },
      chatIcon: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: PRIMARY_GRADIENT,
        color: "rgba(255,255,255,0.95)",
        border: `1px solid ${BORDER_COLOR}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        boxShadow: ICON_SHADOW,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: isOpen ? "scale(0.92)" : "scale(1)",
        backdropFilter: "blur(12px)",
      },
      chatWindow: {
        position: "absolute",
        bottom: "80px",
        right: "0",
        width: "380px",
        height: "500px",
        background: WINDOW_BACKGROUND,
        borderRadius: "24px",
        boxShadow: "0 35px 90px rgba(8, 17, 36, 0.65)",
        border: `1px solid ${BORDER_COLOR}`,
        display: isOpen ? "flex" : "none",
        flexDirection: "column",
        overflow: "hidden",
        transform: isOpen ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
        opacity: isOpen ? 1 : 0,
        transition: "all 0.3s ease",
        backdropFilter: "blur(18px)",
      },
      chatHeader: {
        background: PRIMARY_GRADIENT,
        color: TEXT_PRIMARY,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${BORDER_COLOR}`,
      },
      headerInfo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
      },
      botAvatar: {
        width: "40px",
        height: "40px",
        borderRadius: "14px",
        background: "rgba(255, 255, 255, 0.16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        color: TEXT_PRIMARY,
      },
      headerText: {
        display: "flex",
        flexDirection: "column",
        color: TEXT_PRIMARY,
      },
      botName: {
        fontWeight: 600,
        fontSize: "16px",
        marginBottom: "2px",
      },
      botStatus: {
        fontSize: "12px",
        color: "rgba(226, 232, 240, 0.72)",
      },
      closeButton: {
        background: "none",
        border: "none",
        color: "rgba(255,255,255,0.8)",
        fontSize: "24px",
        cursor: "pointer",
        padding: 0,
        opacity: 0.8,
        transition: "opacity 0.2s ease",
      },
      messagesContainer: {
        flex: 1,
        padding: "24px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: PANEL_BACKGROUND,
        color: TEXT_MUTED,
      },
      message: {
        maxWidth: "80%",
        padding: "12px 16px",
        borderRadius: "18px",
        fontSize: "14px",
        lineHeight: 1.5,
        wordWrap: "break-word",
        fontFamily: "var(--font-inter, 'Inter', system-ui)",
        letterSpacing: "0.01em",
      },
      userMessage: {
        background: PRIMARY_GRADIENT,
        color: TEXT_PRIMARY,
        alignSelf: "flex-end",
        borderBottomRightRadius: "6px",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 18px 38px rgba(61, 245, 242, 0.25)",
      },
      botMessage: {
        background: "rgba(13, 22, 48, 0.85)",
        color: TEXT_MUTED,
        alignSelf: "flex-start",
        border: `1px solid ${BORDER_COLOR}`,
        borderBottomLeftRadius: "6px",
        boxShadow: "0 16px 34px rgba(8, 17, 36, 0.35)",
      },
      typingIndicator: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 16px",
        background: "rgba(13, 22, 48, 0.68)",
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "18px",
        borderBottomLeftRadius: "6px",
        alignSelf: "flex-start",
        maxWidth: "90px",
        boxShadow: "0 14px 30px rgba(8, 17, 36, 0.32)",
      },
      typingDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "rgba(96, 212, 210, 0.85)",
        animation: "typing 1.4s infinite ease-in-out",
      },
      inputContainer: {
        padding: "20px 24px",
        borderTop: `1px solid ${BORDER_COLOR}`,
        background: WINDOW_BACKGROUND,
        backdropFilter: "blur(18px)",
        boxShadow: "0 -1px 0 rgba(255,255,255,0.05) inset",
      },
      inputWrapper: {
        display: "flex",
        gap: "12px",
        alignItems: "flex-end",
      },
      messageInput: {
        flex: 1,
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "14px",
        padding: "12px 16px",
        fontSize: "14px",
        outline: "none",
        resize: "none",
        minHeight: "20px",
        maxHeight: "100px",
        lineHeight: 1.4,
        fontFamily: "inherit",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        background: INPUT_BACKGROUND,
        color: TEXT_PRIMARY,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
      },
      sendButton: {
        background: PRIMARY_GRADIENT,
        color: TEXT_PRIMARY,
        border: "none",
        borderRadius: "12px",
        padding: "12px 16px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 18px 36px rgba(61, 245, 242, 0.25)",
      },
    } satisfies StyleMap;
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      const data = await sendChatMessage(currentMessage);
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        text: (data && (data.answer || data.response || data.message)) ||
          "Sorry, I couldn't process your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat API error:", error);
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        text: getBotResponse(currentMessage),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={styles.chatBotContainer}>
  <div style={styles.chatWindow} id="trinix-chat-window" aria-hidden={!isOpen}>
        <div style={styles.chatHeader}>
          <div style={styles.headerInfo}>
            <div style={styles.botAvatar} aria-hidden="true">
              🤖
            </div>
            <div style={styles.headerText}>
              <div style={styles.botName}>Trinix AI Assistant</div>
              <div style={styles.botStatus}>Online • Typically replies instantly</div>
            </div>
          </div>
          <button
            type="button"
            style={styles.closeButton}
            onClick={() => setIsOpen(false)}
            onMouseEnter={(event) => {
              event.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.opacity = "0.8";
            }}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        <div style={styles.messagesContainer} className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.message,
                ...(message.sender === "user" ? styles.userMessage : styles.botMessage),
              }}
            >
              {message.text}
            </div>
          ))}

          {isTyping ? (
            <div style={styles.typingIndicator}>
              <div style={styles.typingDot} className="typing-dot-1" />
              <div style={styles.typingDot} className="typing-dot-2" />
              <div style={styles.typingDot} className="typing-dot-3" />
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <div style={styles.inputWrapper}>
            <textarea
              style={{
                ...styles.messageInput,
                borderColor: inputMessage ? "rgba(61, 245, 242, 0.75)" : BORDER_COLOR,
                boxShadow: inputMessage
                  ? "0 0 0 1px rgba(61,245,242,0.35), inset 0 0 0 1px rgba(255,255,255,0.05)"
                  : "inset 0 0 0 1px rgba(255,255,255,0.04)",
              }}
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
            />
            <button
              type="button"
              style={{
                ...styles.sendButton,
                opacity: inputMessage.trim() ? 1 : 0.5,
                cursor: inputMessage.trim() ? "pointer" : "not-allowed",
              }}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              onMouseEnter={(event) => {
                if (inputMessage.trim()) {
                  event.currentTarget.style.transform = "scale(1.05)";
                  event.currentTarget.style.boxShadow = "0 22px 44px rgba(61, 245, 242, 0.32)";
                }
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "scale(1)";
                event.currentTarget.style.boxShadow = "0 18px 36px rgba(61, 245, 242, 0.25)";
              }}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        style={styles.chatIcon}
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={(event) => {
          if (!isOpen) {
            event.currentTarget.style.transform = "scale(1.1)";
            event.currentTarget.style.boxShadow = "0 30px 60px rgba(8, 17, 36, 0.6)";
          }
        }}
        onMouseLeave={(event) => {
          if (!isOpen) {
            event.currentTarget.style.transform = "scale(1)";
            event.currentTarget.style.boxShadow = ICON_SHADOW;
          }
        }}
        aria-expanded={isOpen}
        aria-controls="trinix-chat-window"
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
}

export default ChatBot;
