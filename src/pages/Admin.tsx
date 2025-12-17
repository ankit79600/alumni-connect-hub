import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Briefcase, DollarSign, Shield } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Admin() {
  const { role } = useAuth();
  const [stats, setStats] = useState({ users: 0, events: 0, jobs: 0, donations: 0 });

  useEffect(() => {
    async function fetchStats() {
      const [users, events, jobs, donations] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("donations").select("amount"),
      ]);
      setStats({
        users: users.count || 0,
        events: events.count || 0,
        jobs: jobs.count || 0,
        donations: donations.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0,
      });
    }
    if (role === "admin") fetchStats();
  }, [role]);

  if (role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your alumni platform</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Users", value: stats.users, icon: Users },
            { label: "Events", value: stats.events, icon: Calendar },
            { label: "Job Posts", value: stats.jobs, icon: Briefcase },
            { label: "Donations", value: `$${stats.donations.toLocaleString()}`, icon: DollarSign },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10"><s.icon className="h-6 w-6 text-primary" /></div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
