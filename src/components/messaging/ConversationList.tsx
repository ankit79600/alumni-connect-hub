import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Conversation } from "@/hooks/useMessages";
import { formatDistanceToNow } from "date-fns";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (partnerId: string) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No conversations yet</p>
        <p className="text-sm mt-1">Start a conversation from the Directory</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((convo) => (
        <button
          key={convo.partnerId}
          onClick={() => onSelect(convo.partnerId)}
          className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left ${
            selectedId === convo.partnerId ? "bg-muted" : ""
          }`}
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={convo.partnerAvatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {convo.partnerName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium truncate">{convo.partnerName}</p>
              <span className="text-xs text-muted-foreground">
                {convo.lastMessageTime && formatDistanceToNow(new Date(convo.lastMessageTime), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
              {convo.unreadCount > 0 && (
                <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {convo.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
