import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building, DollarSign, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string | null;
  location: string | null;
  job_type: string | null;
  salary_range: string | null;
  created_at: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      const { data } = await supabase.from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false });
      setJobs(data || []);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold gradient-text">Job Board</h1>
          <p className="text-muted-foreground mt-1">Opportunities from the alumni network</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No job postings available.</div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        {job.job_type && <Badge variant="secondary">{job.job_type}</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Building className="h-4 w-4" />{job.company}</span>
                        {job.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>}
                        {job.salary_range && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{job.salary_range}</span>}
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                      </div>
                      {job.description && <p className="mt-3 text-muted-foreground line-clamp-2">{job.description}</p>}
                    </div>
                    <Button className="gradient-primary shrink-0">Apply Now <ExternalLink className="ml-2 h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
