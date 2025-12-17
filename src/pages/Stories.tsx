import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

interface Story { id: string; title: string; story: string; }

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      const { data } = await supabase.from("success_stories").select("*").eq("is_approved", true).order("created_at", { ascending: false });
      setStories(data || []);
      setLoading(false);
    }
    fetchStories();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold gradient-text">Success Stories</h1>
          <p className="text-muted-foreground mt-1">Inspiring journeys of our alumni</p>
        </div>
        {loading ? <div className="text-center py-12">Loading...</div> : stories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No success stories yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <Card key={story.id} className="hover-lift">
                <CardContent className="p-6">
                  <Award className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                  <p className="text-muted-foreground">{story.story}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
