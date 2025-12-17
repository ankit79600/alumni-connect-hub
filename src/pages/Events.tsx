import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  max_attendees: number | null;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data } = await supabase.from("events").select("*").gte("event_date", new Date().toISOString()).order("event_date");
    setEvents(data || []);
    setLoading(false);
  }

  async function handleRSVP(eventId: string) {
    if (!user) {
      toast({ title: "Please sign in to RSVP", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: user.id });
    if (error) {
      toast({ title: "Already registered or error occurred", variant: "destructive" });
    } else {
      toast({ title: "Successfully registered!" });
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold gradient-text">Upcoming Events</h1>
          <p className="text-muted-foreground mt-1">Stay connected through reunions and meetups</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No upcoming events at the moment.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover-lift overflow-hidden">
                <div className="h-2 bg-gradient-primary" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant="secondary">Upcoming</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.description && <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.event_date), "PPP")}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {format(new Date(event.event_date), "p")}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />{event.location}
                      </div>
                    )}
                    {event.max_attendees && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />Max {event.max_attendees} attendees
                      </div>
                    )}
                  </div>
                  <Button className="w-full gradient-primary" onClick={() => handleRSVP(event.id)}>RSVP Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
