import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { FollowButton } from "@/components/connections/FollowButton";
import { Search, MapPin, Building, GraduationCap, Mail, Linkedin, Send, Loader2 } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  graduation_year: number | null;
  department: string | null;
  current_company: string | null;
  current_position: string | null;
  location: string | null;
  linkedin_url: string | null;
}

export default function Directory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    const { data } = await supabase.from("profiles").select("*").order("full_name");
    setProfiles(data || []);
    setLoading(false);
  }

  const handleMessageClick = (profile: Profile) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setSelectedProfile(profile);
    setMessageDialogOpen(true);
  };

  const sendMessage = async () => {
    if (!user || !selectedProfile || !messageContent.trim()) return;

    setSending(true);
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedProfile.user_id,
      content: messageContent.trim(),
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message Sent", description: `Your message has been sent to ${selectedProfile.full_name}` });
      setMessageDialogOpen(false);
      setMessageContent("");
      setSelectedProfile(null);
      navigate("/messages");
    }
    setSending(false);
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch = p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.current_company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === "all" || p.graduation_year?.toString() === yearFilter;
    const matchesDept = deptFilter === "all" || p.department === deptFilter;
    return matchesSearch && matchesYear && matchesDept;
  });

  const years = [...new Set(profiles.map((p) => p.graduation_year).filter(Boolean))].sort((a, b) => b! - a!);
  const departments = [...new Set(profiles.map((p) => p.department).filter(Boolean))];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold gradient-text">Alumni Directory</h1>
          <p className="text-muted-foreground mt-1">Connect with fellow graduates</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Batch Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((y) => <SelectItem key={y} value={y!.toString()}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => <SelectItem key={d} value={d!}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={profile.avatar_url || ""} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                        {profile.full_name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{profile.full_name}</h3>
                      {profile.current_position && <p className="text-sm text-muted-foreground truncate">{profile.current_position}</p>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.graduation_year && <Badge variant="secondary"><GraduationCap className="h-3 w-3 mr-1" />{profile.graduation_year}</Badge>}
                        {profile.department && <Badge variant="outline">{profile.department}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {profile.current_company && <div className="flex items-center gap-2"><Building className="h-4 w-4" />{profile.current_company}</div>}
                    {profile.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{profile.location}</div>}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {profile.user_id !== user?.id && (
                      <>
                        <FollowButton profileUserId={profile.user_id} variant="outline" size="sm" />
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleMessageClick(profile)}>
                          <Mail className="h-4 w-4 mr-1" />Message
                        </Button>
                      </>
                    )}
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost"><Linkedin className="h-4 w-4" /></Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!loading && filteredProfiles.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No alumni found matching your criteria.</div>
        )}
      </div>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {selectedProfile?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Write your message..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
            <Button onClick={sendMessage} disabled={!messageContent.trim() || sending}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
