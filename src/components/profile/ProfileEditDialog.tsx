import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Profile, useProfile } from "@/hooks/useProfile";
import { Camera, X, Plus, Loader2 } from "lucide-react";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  onUpdate: () => void;
}

export function ProfileEditDialog({ open, onOpenChange, profile, onUpdate }: ProfileEditDialogProps) {
  const { updateProfile, uploadAvatar } = useProfile();
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    current_company: profile.current_company || "",
    current_position: profile.current_position || "",
    location: profile.location || "",
    linkedin_url: profile.linkedin_url || "",
    twitter_url: profile.twitter_url || "",
    skills: profile.skills || [],
    achievements: profile.achievements || [],
    activities: profile.activities || [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url } = await uploadAvatar(file);
    if (url) setAvatarUrl(url);
    setUploading(false);
  };

  const addTag = (type: "skills" | "achievements" | "activities", value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    setForm({ ...form, [type]: [...form[type], value.trim()] });
    setter("");
  };

  const removeTag = (type: "skills" | "achievements" | "activities", index: number) => {
    setForm({ ...form, [type]: form[type].filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    onUpdate();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {form.full_name.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Click the camera icon to upload a new photo</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="current_position">Position</Label>
              <Input id="current_position" value={form.current_position} onChange={(e) => setForm({ ...form, current_position: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="current_company">Company</Label>
              <Input id="current_company" value={form.current_company} onChange={(e) => setForm({ ...form, current_company: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input id="twitter_url" value={form.twitter_url} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} />
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeTag("skills", i)}><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill" onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag("skills", newSkill, setNewSkill))} />
              <Button type="button" size="icon" variant="outline" onClick={() => addTag("skills", newSkill, setNewSkill)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <Label>Achievements</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.achievements.map((ach, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                  {ach}
                  <button onClick={() => removeTag("achievements", i)}><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newAchievement} onChange={(e) => setNewAchievement(e.target.value)} placeholder="Add an achievement" onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag("achievements", newAchievement, setNewAchievement))} />
              <Button type="button" size="icon" variant="outline" onClick={() => addTag("achievements", newAchievement, setNewAchievement)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Activities */}
          <div>
            <Label>Activities</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.activities.map((act, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                  {act}
                  <button onClick={() => removeTag("activities", i)}><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newActivity} onChange={(e) => setNewActivity(e.target.value)} placeholder="Add an activity" onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag("activities", newActivity, setNewActivity))} />
              <Button type="button" size="icon" variant="outline" onClick={() => addTag("activities", newActivity, setNewActivity)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
