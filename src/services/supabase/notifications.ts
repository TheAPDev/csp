import { supabase } from "./client";
import { NotificationItem } from "@apptypes";

export async function getNotifications(profileId: string): Promise<NotificationItem[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) return [];
  return data as NotificationItem[];
}

export async function markNotificationRead(id: string) {
  return supabase.from("notifications").update({ read: true }).eq("id", id);
}

export async function markAllNotificationsRead(profileId: string) {
  return supabase.from("notifications").update({ read: true }).eq("profile_id", profileId).eq("read", false);
}
