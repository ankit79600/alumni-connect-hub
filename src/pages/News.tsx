import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Post { id: string; title: string; content: string; post_type: string | null; created_at: string; }

export default function News() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold gradient-text">News & Updates</h1>
          <p className="text-muted-foreground mt-1">Latest from the alumni community</p>
        </div>
        {loading ? <div className="text-center py-12">Loading...</div> : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No news posts yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover-lift">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{post.title}</CardTitle>
                    {post.post_type && <Badge variant="outline">{post.post_type}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
                </CardHeader>
                <CardContent><p className="text-muted-foreground line-clamp-3">{post.content}</p></CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
