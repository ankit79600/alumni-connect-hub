import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export function useMessages(partnerId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;

    const { data: messagesData } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!messagesData) return;

    // Group by conversation partner
    const conversationMap = new Map<string, Message[]>();
    messagesData.forEach((msg) => {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      const existing = conversationMap.get(partnerId) || [];
      conversationMap.set(partnerId, [...existing, msg]);
    });

    // Fetch partner profiles
    const partnerIds = Array.from(conversationMap.keys());
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, avatar_url")
      .in("user_id", partnerIds);

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    const convos: Conversation[] = partnerIds.map((pid) => {
      const msgs = conversationMap.get(pid) || [];
      const lastMsg = msgs[0];
      const profile = profileMap.get(pid);
      const unread = msgs.filter((m) => m.receiver_id === user.id && !m.is_read).length;

      return {
        partnerId: pid,
        partnerName: profile?.full_name || "Unknown User",
        partnerAvatar: profile?.avatar_url,
        lastMessage: lastMsg?.content || "",
        lastMessageTime: lastMsg?.created_at || "",
        unreadCount: unread,
      };
    });

    setConversations(convos.sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    ));
    setLoading(false);
  }, [user?.id]);

  const fetchMessages = useCallback(async () => {
    if (!user?.id || !partnerId) return;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });

    setMessages(data || []);

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", partnerId)
      .eq("receiver_id", user.id)
      .eq("is_read", false);

    setLoading(false);
  }, [user?.id, partnerId]);

  useEffect(() => {
    if (partnerId) {
      fetchMessages();
    } else {
      fetchConversations();
    }
  }, [partnerId, fetchMessages, fetchConversations]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as Message;
          if (msg.sender_id === user.id || msg.receiver_id === user.id) {
            if (partnerId) {
              if (
                (msg.sender_id === partnerId && msg.receiver_id === user.id) ||
                (msg.sender_id === user.id && msg.receiver_id === partnerId)
              ) {
                setMessages((prev) => [...prev, msg]);
              }
            } else {
              fetchConversations();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, partnerId, fetchConversations]);

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user?.id) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content,
    });

    return { error };
  };

  return { messages, conversations, loading, sendMessage, refetch: partnerId ? fetchMessages : fetchConversations };
}
