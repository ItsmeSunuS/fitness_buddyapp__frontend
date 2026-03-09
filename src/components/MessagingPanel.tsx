import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, X, MessageSquare, Users, Phone, Video, Smile, Paperclip, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  isMe: boolean;
  avatar: string;
}

interface Conversation {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  color: string;
}

const MOCK_CONVOS: Conversation[] = [
  { id: "c1", name: "Jordan Lee", initials: "JL", lastMessage: "Great run today! 🏃", time: "2m", unread: 2, online: true, color: "bg-fitness-teal/20 text-fitness-teal" },
  { id: "c2", name: "Sam Rivera", initials: "SR", lastMessage: "Want to join my challenge?", time: "1h", unread: 0, online: true, color: "bg-fitness-violet/20 text-fitness-violet" },
  { id: "c3", name: "Taylor Kim", initials: "TK", lastMessage: "Nice workout streak!", time: "3h", unread: 1, online: false, color: "bg-fitness-orange/20 text-fitness-orange" },
  { id: "c4", name: "Morgan Chen", initials: "MC", lastMessage: "Let's go hiking this weekend", time: "1d", unread: 0, online: false, color: "bg-fitness-gold/20 text-fitness-gold" },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: "m1", from: "Jordan Lee", text: "Hey! Just finished my morning run 💪", time: "9:20 AM", isMe: false, avatar: "JL" },
    { id: "m2", from: "Me", text: "Awesome! How far did you go?", time: "9:22 AM", isMe: true, avatar: "ME" },
    { id: "m3", from: "Jordan Lee", text: "5K in 28 minutes! Personal best 🎉", time: "9:23 AM", isMe: false, avatar: "JL" },
    { id: "m4", from: "Me", text: "That's incredible! You've been killing it lately", time: "9:25 AM", isMe: true, avatar: "ME" },
    { id: "m5", from: "Jordan Lee", text: "Great run today! 🏃", time: "10:01 AM", isMe: false, avatar: "JL" },
  ],
  c2: [
    { id: "m1", from: "Sam Rivera", text: "Hey, want to join my 30-day challenge?", time: "11:00 AM", isMe: false, avatar: "SR" },
    { id: "m2", from: "Me", text: "Sounds great! What's the goal?", time: "11:05 AM", isMe: true, avatar: "ME" },
    { id: "m3", from: "Sam Rivera", text: "Want to join my challenge?", time: "11:10 AM", isMe: false, avatar: "SR" },
  ],
  c3: [
    { id: "m1", from: "Taylor Kim", text: "Your workout streak is impressive!", time: "Yesterday", isMe: false, avatar: "TK" },
    { id: "m2", from: "Me", text: "Thanks! It's been tough but worth it", time: "Yesterday", isMe: true, avatar: "ME" },
    { id: "m3", from: "Taylor Kim", text: "Nice workout streak!", time: "3h ago", isMe: false, avatar: "TK" },
  ],
  c4: [
    { id: "m1", from: "Morgan Chen", text: "Let's go hiking this weekend", time: "1d ago", isMe: false, avatar: "MC" },
    { id: "m2", from: "Me", text: "I'm in! Which trail?", time: "1d ago", isMe: true, avatar: "ME" },
  ],
};

const MessagingPanel: React.FC = () => {
  const [activeConvo, setActiveConvo] = useState<Conversation>(MOCK_CONVOS[0]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES["c1"]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectConvo = (convo: Conversation) => {
    setActiveConvo(convo);
    setMessages(MOCK_MESSAGES[convo.id] || []);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      from: "Me",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      avatar: "ME",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m${Date.now()}r`,
          from: activeConvo.name,
          text: "👍 Sounds good!",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: false,
          avatar: activeConvo.initials,
        },
      ]);
    }, 1200);
  };

  const filteredConvos = MOCK_CONVOS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-foreground text-sm">Messages</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs bg-fitness-orange/20 text-fitness-orange px-2 py-0.5 rounded-full font-semibold">
            {MOCK_CONVOS.reduce((s, c) => s + c.unread, 0)} new
          </span>
          <button className="p-1 hover:bg-muted rounded-lg transition-colors">
            <Users className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex h-80">
        {/* Conversation list */}
        <div className="w-36 sm:w-48 border-r border-border flex flex-col">
          <div className="px-2 py-2 border-b border-border">
            <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1.5">
              <Search className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-xs w-full outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filteredConvos.map((convo) => (
              <button
                key={convo.id}
                onClick={() => selectConvo(convo)}
                className={`w-full px-2 py-2.5 flex items-center gap-2 hover:bg-muted/50 transition-colors text-left ${
                  activeConvo.id === convo.id ? "bg-muted border-l-2 border-primary" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`text-xs font-bold ${convo.color}`}>{convo.initials}</AvatarFallback>
                  </Avatar>
                  {convo.online && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-fitness-teal rounded-full border border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground truncate">{convo.name.split(" ")[0]}</span>
                    {convo.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 ml-1">
                        {convo.unread}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{convo.lastMessage}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className={`text-xs font-bold ${activeConvo.color}`}>{activeConvo.initials}</AvatarFallback>
                </Avatar>
                {activeConvo.online && (
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-fitness-teal rounded-full border border-card" />
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">{activeConvo.name}</div>
                <div className="text-xs text-muted-foreground">{activeConvo.online ? "Online" : "Offline"}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                <Video className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-2">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-1.5 ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!msg.isMe && (
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarFallback className={`text-xs font-bold ${activeConvo.color}`}>{msg.avatar}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-xl px-3 py-1.5 ${
                      msg.isMe
                        ? "gradient-hero text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-xs">{msg.text}</p>
                    <p className={`text-xs mt-0.5 ${msg.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-t border-border">
            <button className="p-1 hover:bg-muted rounded-lg transition-colors flex-shrink-0">
              <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-muted rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="p-1 hover:bg-muted rounded-lg transition-colors flex-shrink-0">
              <Smile className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-1.5 gradient-hero rounded-lg transition-opacity disabled:opacity-40 flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPanel;
