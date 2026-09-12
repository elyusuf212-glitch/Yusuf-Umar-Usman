import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/widgets";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function FellowProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.sub }, include: { profile: true } });
  if (!user) redirect("/login");

  return (
    <div>
      <PageHeader title="My Profile" description="Keep your professional profile up to date — mentors and coordinators can see this." />
      <ProfileForm
        initial={{
          name: user.name,
          phone: user.phone ?? "",
          headline: user.profile?.headline ?? "",
          bio: user.profile?.bio ?? "",
          location: user.profile?.location ?? "",
          state: user.profile?.state ?? "",
          education: user.profile?.education ?? "",
          institution: user.profile?.institution ?? "",
          linkedin: user.profile?.linkedin ?? "",
          twitter: user.profile?.twitter ?? "",
          website: user.profile?.website ?? "",
          skills: (user.profile?.skills ?? []).join(", "),
        }}
      />
    </div>
  );
}
