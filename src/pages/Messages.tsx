import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import FitnessCard from "@/components/FitnessCard";
import AnimatedPage from "@/components/AnimatedPage";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";

interface Buddy {
  id: string;
  name: string;
}

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
}
const Messages: React.FC = () => {
  const { user } = useAuth();
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        const res = await api.get("/api/users/my-buddies");
        setBuddies(res.data);
      } catch {
        setBuddies([
          { id: "1", name: "Sankar" },
          { id: "2", name: "Manju" },
          { id: "3", name: "Alexa" },
          { id: "4", name: "Emias" },
        ]);
      }
    };
    fetchBuddies();
  }, []);

  useEffect(() => {
    if (!selectedBuddy) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/messages/conversation/${selectedBuddy.id}`);
        setMessages(res.data);
      } catch {
        // Mock conversation
        setMessages([
          { id: "m1", sender_id: selectedBuddy.id, receiver_id: user?.id || "", message: "Hey! Ready for today's workout? 💪", created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: "m2", sender_id: user?.id || "", receiver_id: selectedBuddy.id, message: "You there", created_at: new Date(Date.now() - 3000000).toISOString() },
          // { id: "m3", sender_id: selectedBuddy.id, receiver_id: user?.id || "", content: , created_at: new Date(Date.now() - 2400000).toISOString() },
          { id: "m4", sender_id: user?.id || "", receiver_id: selectedBuddy.id, message: "Sounds great! Meet at the gym at 6?", created_at: new Date(Date.now() - 1800000).toISOString() },
        ]);
      }
    };
    fetchMessages();
  }, [selectedBuddy, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
  if (!newMessage.trim() || !selectedBuddy) return;

  try {
  await api.post("/api/messages/send", {
  receiver_id: selectedBuddy.id,
  message: newMessage.trim()
});
    const res = await api.get(`/api/messages/conversation/${selectedBuddy.id}`);
    setMessages(res.data);

    setNewMessage("");
  } catch (err) {
    console.error(err);
  }
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredBuddies = buddies.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <DashboardLayout>
      <AnimatedPage>
        <h1 className="mb-6 font-display content-3xl font-bold content-foreground">Messages 💬</h1>

        <div className="flex h-[calc(100vh-12rem)] gap-4 overflow-hidden rounded-2xl border border-border bg-card">
          {/* Buddy list sidebar */}
          <div className="flex w-80 flex-col border-r border-border">
            <div className="border-b border-border p-4">
              <input
                type="text"
                placeholder="Search buddies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 content-sm content-foreground placeholder:content-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredBuddies.length === 0 ? (
                <p className="p-4 content-center content-sm content-muted-foreground">No buddies found. Add buddies first!</p>
              ) : (
                filteredBuddies.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBuddy(b)}
                    className={`flex w-full items-center gap-3 border-b border-border/50 px-4 py-3 content-left transition-colors hover:bg-muted/50 ${
                      selectedBuddy?.id === b.id ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary content-sm font-bold content-primary-foreground">
                      {b.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate content-sm font-medium content-foreground">{b.name}</p>
                      <p className="truncate content-xs content-muted-foreground">Tap to chat</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex flex-1 flex-col">
            {selectedBuddy ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary content-sm font-bold content-primary-foreground">
                    {selectedBuddy.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium content-foreground">{selectedBuddy.name}</p>
                    <p className="content-xs content-muted-foreground"></p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                              isMe
                                ? "bg-primary content-primary-foreground"
                                : "bg-muted content-foreground"
                            }`}
                          >
                            <p className="content-sm">{msg.message}</p>
                            <p className={`mt-1 content-[10px] ${isMe ? "content-primary-foreground/70" : "content-muted-foreground"}`}>
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 rounded-xl border border-border bg-muted px-4 py-2.5 content-sm content-foreground placeholder:content-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="rounded-xl bg-primary px-5 py-2.5 content-sm font-medium content-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center content-center">
                <span className="mb-4 content-6xl">💬</span>
                <h3 className="font-display content-xl font-semibold content-foreground">Select a buddy to chat</h3>
                <p className="mt-1 content-sm content-muted-foreground">Choose someone from your buddy list to start a conversation</p>
              </div>
            )}
          </div>
        </div>
      </AnimatedPage>
    </DashboardLayout>
  );
};

export default Messages;