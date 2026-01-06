import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/lib/auth";
import { ConversationList } from "@/components/messaging/ConversationList";
import { ChatWindow } from "@/components/messaging/ChatWindow";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Messages() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { conversations, loading: convosLoading } = useMessages();
  const { messages, loading: msgsLoading, sendMessage } = useMessages(selectedPartnerId || undefined);
  const [partnerProfile, setPartnerProfile] = useState<{ full_name: string; avatar_url?: string } | null>(null);

  // Fetch partner profile when selected
  useEffect(() => {
    if (selectedPartnerId) {
      supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", selectedPartnerId)
        .single()
        .then(({ data }) => setPartnerProfile(data));
    }
  }, [selectedPartnerId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedPartnerId) return;
    await sendMessage(selectedPartnerId, content);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold gradient-text">Messages</h1>
          <p className="text-muted-foreground mt-1">Your conversations with alumni and students</p>
        </div>

        <Card className="overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversation List - hidden on mobile when chat is open */}
            <div className={`w-full md:w-80 border-r border-border flex-shrink-0 ${selectedPartnerId ? "hidden md:block" : ""}`}>
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Inbox
                </h2>
              </div>
              {convosLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ConversationList
                  conversations={conversations}
                  selectedId={selectedPartnerId || undefined}
                  onSelect={setSelectedPartnerId}
                />
              )}
            </div>

            {/* Chat Window */}
            <div className={`flex-1 ${!selectedPartnerId ? "hidden md:flex" : ""}`}>
              {selectedPartnerId && partnerProfile ? (
                <ChatWindow
                  messages={messages}
                  partnerName={partnerProfile.full_name}
                  partnerAvatar={partnerProfile.avatar_url}
                  onSend={handleSendMessage}
                  onBack={() => setSelectedPartnerId(null)}
                  loading={msgsLoading}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
