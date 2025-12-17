import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Donate() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);

  const presetAmounts = [25, 50, 100, 250, 500, 1000];

  async function handleDonate() {
    if (!user) {
      toast({ title: "Please sign in to donate", variant: "destructive" });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("donations").insert({
      donor_id: user.id,
      amount: parseFloat(amount),
      purpose,
      payment_status: "pending",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error recording donation", variant: "destructive" });
    } else {
      toast({ title: "Thank you for your donation!" });
      setAmount("");
      setPurpose("");
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold gradient-text">Support Your Alma Mater</h1>
          <p className="text-muted-foreground mt-2">Your contribution helps current students succeed</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Make a Donation</CardTitle>
            <CardDescription>Choose an amount or enter a custom value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {presetAmounts.map((a) => (
                <Button key={a} variant={amount === a.toString() ? "default" : "outline"} onClick={() => setAmount(a.toString())} className={amount === a.toString() ? "gradient-primary" : ""}>
                  ${a}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Custom Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Purpose (optional)</Label>
              <Input placeholder="e.g., Scholarship Fund, Library" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </div>
            <Button className="w-full gradient-primary" size="lg" onClick={handleDonate} disabled={loading}>
              {loading ? "Processing..." : "Donate Now"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
