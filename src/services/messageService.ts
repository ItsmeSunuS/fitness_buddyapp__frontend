import api from "./api";

export const getMessages = async (userId: string) => {
  const res = await api.get(`/api/messages/conversation/${userId}`);
  return res.data;
};

export const sendMessage = async (receiverId: string, text: string) => {
  const res = await api.post("/api/messages/send", {
    receiverId,
    text
  });

  return res.data;
};