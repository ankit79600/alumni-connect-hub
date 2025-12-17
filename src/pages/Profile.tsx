import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { user, role } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user?.email?.split("@")[0]}</CardTitle>
            <p className="text-muted-foreground">{user?.email}</p>
            {role && <Badge className="mt-2 capitalize">{role}</Badge>}
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>Profile editing coming soon. Update your information from the Cloud dashboard.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
