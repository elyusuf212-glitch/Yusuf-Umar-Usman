import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMentorByUserId } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/widgets";
import { MentorProfileForm } from "@/components/dashboard/mentor-profile-form";

export default async function MentorProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const mentor = await getMentorByUserId(session.sub);
  if (!mentor) redirect("/dashboard/mentor");

  return (
    <div>
      <PageHeader title="My Mentor Profile" description="This is shown publicly on the Mentors page." />
      <MentorProfileForm
        initial={{
          title: mentor.title ?? "",
          organisation: mentor.organisation ?? "",
          bio: mentor.bio ?? "",
          yearsExperience: mentor.yearsExperience?.toString() ?? "",
          linkedin: mentor.linkedin ?? "",
          expertiseAreas: mentor.expertiseAreas.join(", "),
          mentorshipAreas: mentor.mentorshipAreas.join(", "),
        }}
      />
    </div>
  );
}
