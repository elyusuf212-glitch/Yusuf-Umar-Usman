import { PageHeader } from "@/components/dashboard/widgets";
import { AnnouncementForm } from "@/components/dashboard/announcement-form";

export default function NewAnnouncementPage() {
  return (
    <div>
      <PageHeader title="New Announcement" />
      <AnnouncementForm />
    </div>
  );
}
