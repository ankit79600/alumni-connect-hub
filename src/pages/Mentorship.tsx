import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMentorship } from "@/hooks/useMentorship";
import { useAuth } from "@/lib/auth";
import { MentorCard } from "@/components/mentorship/MentorCard";
import { MentorshipRequestCard } from "@/components/mentorship/MentorshipRequestCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, Search, Loader2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Mentorship() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { mentors, requests, loading, sendRequest, updateRequestStatus, toggleMentorStatus } = useMentorship();
  const [searchTerm, setSearchTerm] = useState("");
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const filteredMentors = mentors.filter((m) =>
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.current_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.current_position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRequestStatus = (mentorId: string) => {
    const req = requests.find((r) => r.mentor_id === mentorId);
    return req?.status;
  };

  const handleRequestMentorship = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    setRequestDialogOpen(true);
  };

  const submitRequest = async () => {
    if (!selectedMentorId) return;
    setSending(true);
    await sendRequest(selectedMentorId, requestMessage);
    setSending(false);
    setRequestDialogOpen(false);
    setRequestMessage("");
    setSelectedMentorId(null);
  };

  const isAlumni = role === "alumni" || role === "admin";
  const isMentor = mentors.some((m) => m.user_id === user?.id);
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const acceptedRequests = requests.filter((r) => r.status === "accepted");

  if (authLoading || loading) {
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
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text">Mentorship</h1>
              <p className="text-muted-foreground mt-1">
                {isAlumni ? "Guide the next generation of students" : "Connect with experienced alumni mentors"}
              </p>
            </div>
            
            {isAlumni && (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Switch id="mentor-toggle" checked={isMentor} onCheckedChange={toggleMentorStatus} />
                  <Label htmlFor="mentor-toggle" className="cursor-pointer">
                    {isMentor ? "You're accepting mentees" : "Become a mentor"}
                  </Label>
                </div>
              </Card>
            )}
          </div>
        </motion.div>

        <Tabs defaultValue={isAlumni ? "requests" : "mentors"} className="space-y-6">
          <TabsList>
            {!isAlumni && <TabsTrigger value="mentors">Find Mentors</TabsTrigger>}
            <TabsTrigger value="requests" className="flex items-center gap-2">
              {isAlumni ? "Requests" : "My Requests"}
              {pendingRequests.length > 0 && (
                <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="connections">
              <UserCheck className="h-4 w-4 mr-1" />
              {isAlumni ? "Mentees" : "My Mentors"}
            </TabsTrigger>
          </TabsList>

          {/* Find Mentors - Students only */}
          {!isAlumni && (
            <TabsContent value="mentors">
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search mentors by name, company, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {filteredMentors.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No mentors available yet</h3>
                    <p className="text-muted-foreground">Check back later as more alumni become mentors</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMentors.map((mentor) => (
                    <motion.div key={mentor.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <MentorCard
                        mentor={mentor}
                        onRequestMentorship={handleRequestMentorship}
                        requestStatus={getRequestStatus(mentor.user_id)}
                        isOwnProfile={mentor.user_id === user?.id}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {/* Requests Tab */}
          <TabsContent value="requests">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No pending requests</h3>
                  <p className="text-muted-foreground">
                    {isAlumni ? "New mentorship requests will appear here" : "Request mentorship from alumni to get started"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <MentorshipRequestCard
                    key={req.id}
                    request={req}
                    isAlumni={isAlumni}
                    onAccept={(id) => updateRequestStatus(id, "accepted")}
                    onReject={(id) => updateRequestStatus(id, "rejected")}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections">
            {acceptedRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No active mentorships</h3>
                  <p className="text-muted-foreground">
                    {isAlumni ? "Accepted mentees will appear here" : "Connect with mentors to start your journey"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {acceptedRequests.map((req) => (
                  <MentorshipRequestCard key={req.id} request={req} isAlumni={isAlumni} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Request Dialog */}
        <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Mentorship</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and explain why you'd like this mentor..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>Cancel</Button>
              <Button onClick={submitRequest} disabled={sending}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
