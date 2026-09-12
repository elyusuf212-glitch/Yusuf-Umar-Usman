import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const db = new PrismaClient();

const PASSWORD = "CitizensNexus2025!";

const NIGERIAN_STATES = [
  "Lagos", "Abuja (FCT)", "Rivers", "Kano", "Oyo", "Enugu", "Kaduna", "Delta", "Edo", "Ogun",
  "Anambra", "Plateau", "Cross River", "Imo", "Osun", "Ondo", "Kwara", "Benue", "Akwa Ibom", "Abia",
];

const FIRST_NAMES = [
  "Ada", "Chidi", "Ngozi", "Emeka", "Fatima", "Ibrahim", "Amaka", "Tunde", "Blessing", "Yusuf",
  "Zainab", "Chioma", "Segun", "Aisha", "Kelechi", "Femi", "Halima", "Obinna", "Grace", "Musa",
];
const LAST_NAMES = [
  "Okafor", "Bello", "Eze", "Abubakar", "Adeyemi", "Okoro", "Suleiman", "Nwosu", "Balogun", "Ibrahim",
  "Chukwu", "Danjuma", "Afolabi", "Uche", "Yakubu", "Nnamdi", "Lawal", "Ogunleye", "Musa", "Adekunle",
];

function fullName(i: number) {
  return `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 3) % LAST_NAMES.length]}`;
}

async function main() {
  console.log("Seeding CitizensNexus database…");
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  // ---------------------------------------------------------------------
  // SDGs
  // ---------------------------------------------------------------------
  const SDG_LIST = [
    { number: 1, name: "No Poverty", colorHex: "#E5243B" },
    { number: 2, name: "Zero Hunger", colorHex: "#DDA63A" },
    { number: 3, name: "Good Health and Well-being", colorHex: "#4C9F38" },
    { number: 4, name: "Quality Education", colorHex: "#C5192D" },
    { number: 5, name: "Gender Equality", colorHex: "#FF3A21" },
    { number: 6, name: "Clean Water and Sanitation", colorHex: "#26BDE2" },
    { number: 7, name: "Affordable and Clean Energy", colorHex: "#FCC30B" },
    { number: 8, name: "Decent Work and Economic Growth", colorHex: "#A21942" },
    { number: 9, name: "Industry, Innovation and Infrastructure", colorHex: "#FD6925" },
    { number: 10, name: "Reduced Inequalities", colorHex: "#DD1367" },
    { number: 11, name: "Sustainable Cities and Communities", colorHex: "#FD9D24" },
    { number: 12, name: "Responsible Consumption and Production", colorHex: "#BF8B2E" },
    { number: 13, name: "Climate Action", colorHex: "#3F7E44" },
    { number: 14, name: "Life Below Water", colorHex: "#0A97D9" },
    { number: 15, name: "Life on Land", colorHex: "#56C02B" },
    { number: 16, name: "Peace, Justice and Strong Institutions", colorHex: "#00689D" },
    { number: 17, name: "Partnerships for the Goals", colorHex: "#19486A" },
  ];
  for (const sdg of SDG_LIST) {
    await db.sdg.upsert({
      where: { number: sdg.number },
      create: { ...sdg, description: `UN Sustainable Development Goal ${sdg.number}: ${sdg.name}.` },
      update: {},
    });
  }
  const sdgs = await db.sdg.findMany();
  const sdgByNumber = (n: number) => sdgs.find((s) => s.number === n)!;

  // ---------------------------------------------------------------------
  // Admin & Programme Manager
  // ---------------------------------------------------------------------
  const admin = await db.user.upsert({
    where: { email: "admin@citizensnexus.africa" },
    create: {
      name: "Adaeze Nwankwo",
      email: "admin@citizensnexus.africa",
      passwordHash,
      role: "ADMIN",
      profile: { create: { headline: "Executive Director, CitizensNexus", country: "Nigeria" } },
    },
    update: {},
  });

  const manager = await db.user.upsert({
    where: { email: "manager@citizensnexus.africa" },
    create: {
      name: "Tobi Adekunle",
      email: "manager@citizensnexus.africa",
      passwordHash,
      role: "PROGRAMME_MANAGER",
      profile: { create: { headline: "Programmes Manager, CitizensNexus" } },
    },
    update: {},
  });

  // ---------------------------------------------------------------------
  // Programmes
  // ---------------------------------------------------------------------
  const flagship = await db.programme.upsert({
    where: { slug: "citizensnexus-1-0" },
    create: {
      slug: "citizensnexus-1-0",
      name: "CitizensNexus 1.0",
      description:
        "Our flagship 6-month fellowship developing young Nigerians into effective leaders through mentorship, structured learning and civic-impact projects.",
      theme: "Leadership & Mindset",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-08-01"),
      applicationDeadline: new Date("2025-01-15"),
      location: "Lagos, Nigeria (Hybrid)",
      deliveryFormat: "HYBRID",
      eligibility: "Nigerians aged 18-30 with demonstrated leadership potential and community involvement.",
      slots: 20,
      status: "IN_PROGRESS",
      createdById: admin.id,
    },
    update: {},
  });

  const digitalSkills = await db.programme.upsert({
    where: { slug: "digital-ai-skills-track" },
    create: {
      slug: "digital-ai-skills-track",
      name: "Digital & AI Skills Track",
      description: "A focused 8-week programme building practical digital literacy and AI-readiness skills for young professionals.",
      theme: "Digital & AI Skills",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-10-27"),
      applicationDeadline: new Date("2025-08-20"),
      location: "Virtual",
      deliveryFormat: "VIRTUAL",
      eligibility: "Open to all young people aged 16-30 across Africa.",
      slots: 100,
      status: "OPEN_FOR_APPLICATIONS",
      createdById: manager.id,
    },
    update: {},
  });

  const advocacy = await db.programme.upsert({
    where: { slug: "advocacy-civic-engagement-fellowship" },
    create: {
      slug: "advocacy-civic-engagement-fellowship",
      name: "Advocacy & Civic Engagement Fellowship",
      description: "A specialised fellowship equipping young changemakers with advocacy, policy and community mobilisation skills.",
      theme: "Advocacy & Civic Engagement",
      startDate: new Date("2026-01-15"),
      applicationDeadline: new Date("2025-12-15"),
      location: "Abuja, Nigeria",
      deliveryFormat: "IN_PERSON",
      eligibility: "Young Nigerians with a track record of community organising or civic projects.",
      slots: 30,
      status: "PUBLISHED",
      createdById: manager.id,
    },
    update: {},
  });

  await db.programmeCoordinator.upsert({
    where: { programmeId_userId: { programmeId: flagship.id, userId: manager.id } },
    create: { programmeId: flagship.id, userId: manager.id, title: "Lead Programme Coordinator" },
    update: {},
  });

  // ---------------------------------------------------------------------
  // Cohorts
  // ---------------------------------------------------------------------
  const cohort1 = await db.cohort.upsert({
    where: { programmeId_name: { programmeId: flagship.id, name: "CitizensNexus 1.0" } },
    create: {
      programmeId: flagship.id,
      name: "CitizensNexus 1.0",
      year: 2025,
      applicationOpenAt: new Date("2024-11-01"),
      applicationCloseAt: new Date("2025-01-15"),
      selectionProcess: "Application review, panel interview, and final selection committee vote.",
      status: "ACTIVE",
    },
    update: {},
  });

  const digitalCohort = await db.cohort.upsert({
    where: { programmeId_name: { programmeId: digitalSkills.id, name: "Digital Skills Cohort A" } },
    create: {
      programmeId: digitalSkills.id,
      name: "Digital Skills Cohort A",
      year: 2025,
      applicationOpenAt: new Date("2025-07-01"),
      applicationCloseAt: new Date("2025-08-20"),
      selectionProcess: "Rolling admissions.",
      status: "APPLICATIONS_OPEN",
    },
    update: {},
  });

  // ---------------------------------------------------------------------
  // Mentors (5)
  // ---------------------------------------------------------------------
  const mentorTitles = [
    { title: "Senior Policy Analyst", org: "Nigeria Policy Institute", expertise: ["Policy", "Advocacy", "Research & Data"] },
    { title: "Product Manager", org: "Flutterwave", expertise: ["Digital Skills", "Project Management", "Strategy"] },
    { title: "Founder & CEO", org: "GreenSprout Africa", expertise: ["Entrepreneurship", "Fundraising & Proposal Writing", "Leadership"] },
    { title: "Communications Director", org: "African Development Network", expertise: ["Public Speaking", "Personal Branding", "Partnerships"] },
    { title: "Data Scientist", org: "MTN Nigeria", expertise: ["Artificial Intelligence", "Research & Data", "Employability"] },
  ];

  const mentors = [];
  for (let i = 0; i < mentorTitles.length; i++) {
    const name = `${["Chinedu", "Aisha", "Bola", "Ifeoma", "Kunle"][i]} ${["Umeh", "Yusuf", "Adeyinka", "Nwachukwu", "Ogundipe"][i]}`;
    const email = `mentor${i + 1}@citizensnexus.africa`;
    const user = await db.user.upsert({
      where: { email },
      create: { name, email, passwordHash, role: "MENTOR", profile: { create: { headline: mentorTitles[i].title } } },
      update: {},
    });
    const mentor = await db.mentor.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        title: mentorTitles[i].title,
        organisation: mentorTitles[i].org,
        bio: `${name} is a seasoned professional passionate about developing the next generation of African leaders through structured mentorship.`,
        expertiseAreas: mentorTitles[i].expertise,
        mentorshipAreas: mentorTitles[i].expertise,
        yearsExperience: 8 + i,
        linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(" ", "-")}`,
      },
      update: {},
    });
    mentors.push(mentor);
  }

  // ---------------------------------------------------------------------
  // Fellows (20) in CitizensNexus 1.0, mentored by the 5 mentors
  // ---------------------------------------------------------------------
  const skillPool = [
    "Leadership", "Public Speaking", "Advocacy", "Project Management", "Research & Data",
    "Digital Skills", "Artificial Intelligence", "Employability", "Personal Branding", "Strategy",
  ];

  const fellows = [];
  for (let i = 0; i < 20; i++) {
    const name = fullName(i);
    const email = `fellow${i + 1}@citizensnexus.africa`;
    const user = await db.user.upsert({
      where: { email },
      create: {
        name,
        email,
        passwordHash,
        role: "FELLOW",
        profile: {
          create: {
            headline: "Aspiring civic leader and changemaker",
            bio: `${name} is a CitizensNexus 1.0 fellow passionate about community development and youth empowerment in Nigeria.`,
            location: NIGERIAN_STATES[i % NIGERIAN_STATES.length],
            state: NIGERIAN_STATES[i % NIGERIAN_STATES.length],
            institution: ["University of Lagos", "Ahmadu Bello University", "University of Ibadan", "Covenant University"][i % 4],
            skills: [skillPool[i % skillPool.length], skillPool[(i + 3) % skillPool.length]],
          },
        },
      },
      update: {},
    });

    const fellow = await db.fellow.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        cohortId: cohort1.id,
        fellowNumber: `CN-2025-${String(i + 1).padStart(4, "0")}`,
        status: "ACTIVE",
        progressPercent: 30 + ((i * 7) % 65),
      },
      update: {},
    });
    fellows.push(fellow);

    // assign mentor round-robin (4 fellows per mentor)
    const mentor = mentors[i % mentors.length];
    const assignment = await db.mentorAssignment.upsert({
      where: { mentorId_fellowId: { mentorId: mentor.id, fellowId: fellow.id } },
      create: { mentorId: mentor.id, fellowId: fellow.id, cohortId: cohort1.id, status: "ACTIVE" },
      update: {},
    });

    if (i % 3 === 0) {
      await db.mentorSession.create({
        data: {
          mentorAssignmentId: assignment.id,
          scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          durationMinutes: 45,
          status: "COMPLETED",
          mentorNotes: "Discussed progress on leadership project and set goals for the next milestone.",
        },
      });
      await db.mentorSession.create({
        data: {
          mentorAssignmentId: assignment.id,
          scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          durationMinutes: 45,
          status: "SCHEDULED",
        },
      });
    }
  }

  // ---------------------------------------------------------------------
  // Courses / Learning Hub (3 courses, 5 modules total)
  // ---------------------------------------------------------------------
  const leadershipCourse = await db.course.upsert({
    where: { slug: "foundations-of-leadership" },
    create: {
      slug: "foundations-of-leadership",
      title: "Foundations of Leadership",
      description: "Core leadership principles, self-awareness and building influence as a young leader.",
      category: "Leadership",
      programmeId: flagship.id,
      isPublished: true,
      createdById: admin.id,
      modules: {
        create: [
          {
            title: "Understanding Your Leadership Style",
            order: 0,
            lessons: {
              create: [
                { title: "Introduction to Leadership Styles", contentType: "ARTICLE", order: 0, durationMinutes: 15 },
                { title: "Self-Assessment Quiz", contentType: "QUIZ", order: 1, durationMinutes: 10 },
              ],
            },
          },
          {
            title: "Leading with Purpose",
            order: 1,
            lessons: {
              create: [
                { title: "Purpose-Driven Leadership (Video)", contentType: "VIDEO", order: 0, durationMinutes: 20 },
                { title: "Personal Leadership Plan Assignment", contentType: "ASSIGNMENT", order: 1, durationMinutes: 30 },
              ],
            },
          },
        ],
      },
    },
    update: {},
  });

  const digitalCourse = await db.course.upsert({
    where: { slug: "digital-ai-skills-for-young-leaders" },
    create: {
      slug: "digital-ai-skills-for-young-leaders",
      title: "Digital & AI Skills for Young Leaders",
      description: "Practical digital literacy and an introduction to using AI tools responsibly and effectively.",
      category: "Artificial Intelligence",
      programmeId: digitalSkills.id,
      isPublished: true,
      createdById: manager.id,
      modules: {
        create: [
          {
            title: "AI Fundamentals",
            order: 0,
            lessons: {
              create: [
                { title: "What is Artificial Intelligence?", contentType: "ARTICLE", order: 0, durationMinutes: 12 },
                { title: "AI Tools for Productivity", contentType: "VIDEO", order: 1, durationMinutes: 18 },
              ],
            },
          },
        ],
      },
    },
    update: {},
  });

  await db.course.upsert({
    where: { slug: "public-speaking-mastery" },
    create: {
      slug: "public-speaking-mastery",
      title: "Public Speaking Mastery",
      description: "Build confidence and skill in public speaking, storytelling and persuasive communication.",
      category: "Public Speaking",
      isPublished: true,
      createdById: admin.id,
      modules: {
        create: [
          {
            title: "Speaking with Confidence",
            order: 0,
            lessons: {
              create: [{ title: "Overcoming Stage Fright", contentType: "PDF", order: 0, durationMinutes: 10 }],
            },
          },
        ],
      },
    },
    update: {},
  });

  // Enroll some fellows in courses
  for (let i = 0; i < 12; i++) {
    const fellowUser = await db.fellow.findUnique({ where: { id: fellows[i].id }, select: { userId: true } });
    if (!fellowUser) continue;
    await db.enrollment.upsert({
      where: { userId_courseId: { userId: fellowUser.userId, courseId: leadershipCourse.id } },
      create: {
        userId: fellowUser.userId,
        courseId: leadershipCourse.id,
        status: i % 4 === 0 ? "COMPLETED" : "IN_PROGRESS",
        progressPercent: i % 4 === 0 ? 100 : 20 + i * 5,
        startedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        completedAt: i % 4 === 0 ? new Date() : null,
      },
      update: {},
    });
    if (i % 2 === 0) {
      await db.enrollment.upsert({
        where: { userId_courseId: { userId: fellowUser.userId, courseId: digitalCourse.id } },
        create: { userId: fellowUser.userId, courseId: digitalCourse.id, status: "IN_PROGRESS", progressPercent: 40, startedAt: new Date() },
        update: {},
      });
    }
  }

  // ---------------------------------------------------------------------
  // Opportunities (5)
  // ---------------------------------------------------------------------
  const opportunities = [
    {
      title: "Junior Data Analyst",
      organisation: "Flutterwave",
      description: "Entry-level data analyst role supporting product and growth teams.",
      category: "JOB" as const,
      location: "Lagos, Nigeria",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isFeatured: true,
    },
    {
      title: "Mastercard Foundation Scholars Program",
      organisation: "Mastercard Foundation",
      description: "Full scholarship for undergraduate and graduate study for African students.",
      category: "SCHOLARSHIP" as const,
      location: "Various",
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isFeatured: true,
    },
    {
      title: "Tony Elumelu Foundation Entrepreneurship Programme",
      organisation: "Tony Elumelu Foundation",
      description: "Seed funding, mentorship and training for African entrepreneurs.",
      category: "FELLOWSHIP" as const,
      location: "Pan-African",
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      isFeatured: false,
    },
    {
      title: "Youth Climate Action Grant",
      organisation: "African Development Bank",
      description: "Small grants for youth-led climate action projects across Africa.",
      category: "GRANT" as const,
      location: "Africa-wide",
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      isFeatured: false,
    },
    {
      title: "Product Design Internship",
      organisation: "Paystack",
      description: "6-month paid internship for aspiring product designers.",
      category: "INTERNSHIP" as const,
      location: "Lagos, Nigeria (Hybrid)",
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      isFeatured: false,
    },
  ];

  for (const opp of opportunities) {
    const slug = opp.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await db.opportunity.upsert({
      where: { slug },
      create: { ...opp, slug, applicationUrl: "https://citizensnexus.africa/opportunities", postedById: admin.id },
      update: {},
    });
  }

  // ---------------------------------------------------------------------
  // Events (4)
  // ---------------------------------------------------------------------
  const events = [
    {
      title: "Leadership in the Age of AI",
      description: "A fireside chat on how young leaders can navigate and lead through AI-driven disruption.",
      eventType: "LEADERSHIP_CONVERSATION" as const,
      mode: "ONLINE" as const,
      startAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      speaker: "Dr. Amina Yusuf, AI Policy Researcher",
      capacity: 500,
    },
    {
      title: "CitizensNexus Fellows Networking Mixer",
      description: "An in-person networking evening for fellows, mentors and partners.",
      eventType: "NETWORKING" as const,
      mode: "OFFLINE" as const,
      startAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      location: "Lagos, Nigeria",
      capacity: 150,
    },
    {
      title: "Grant Writing & Fundraising Bootcamp",
      description: "A hands-on training on writing winning grant proposals for community projects.",
      eventType: "TRAINING" as const,
      mode: "HYBRID" as const,
      startAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      location: "Abuja, Nigeria",
      capacity: 80,
    },
    {
      title: "CitizensNexus 1.0 Mid-Cohort Town Hall",
      description: "A town hall for CitizensNexus 1.0 fellows to share progress and feedback.",
      eventType: "TOWN_HALL" as const,
      mode: "ONLINE" as const,
      startAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      capacity: 30,
    },
  ];

  for (const evt of events) {
    const slug = evt.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await db.event.upsert({
      where: { slug },
      create: { ...evt, slug, isPublished: true, createdById: manager.id, programmeId: flagship.id },
      update: {},
    });
  }

  // ---------------------------------------------------------------------
  // Projects (3) with SDG tags
  // ---------------------------------------------------------------------
  const fellow1User = await db.fellow.findUnique({ where: { id: fellows[0].id } });
  const fellow2User = await db.fellow.findUnique({ where: { id: fellows[1].id } });

  const projectsData = [
    {
      title: "CleanWater Yaba",
      description: "A youth-led initiative providing clean water access to underserved communities in Yaba, Lagos.",
      problem: "Over 5,000 residents in Yaba lack reliable access to clean drinking water.",
      solution: "Installed 3 community water filtration points and ran hygiene education workshops.",
      location: "Lagos, Nigeria",
      status: "ONGOING" as const,
      year: 2025,
      impactSummary: "Provided clean water access to over 2,000 residents.",
      sdgNumbers: [3, 6],
    },
    {
      title: "GirlsCode Kaduna",
      description: "A digital skills bootcamp for young women in Kaduna State.",
      problem: "Low representation of young women in tech careers in Northern Nigeria.",
      solution: "Ran a 4-week coding and digital literacy bootcamp for 60 young women.",
      location: "Kaduna, Nigeria",
      status: "COMPLETED" as const,
      year: 2024,
      impactSummary: "60 young women trained; 15 secured tech internships.",
      sdgNumbers: [4, 5, 8],
    },
    {
      title: "Green Campus Ibadan",
      description: "A campus recycling and climate-awareness campaign at the University of Ibadan.",
      problem: "Poor waste management infrastructure and low climate awareness on campus.",
      solution: "Set up recycling stations and ran climate literacy sessions for 1,200 students.",
      location: "Ibadan, Nigeria",
      status: "ONGOING" as const,
      year: 2025,
      impactSummary: "1,200 students reached; 4 tonnes of waste recycled.",
      sdgNumbers: [11, 12, 13],
    },
  ];

  for (const [idx, p] of projectsData.entries()) {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { sdgNumbers, ...rest } = p;
    const project = await db.project.upsert({
      where: { slug },
      create: {
        ...rest,
        slug,
        programmeId: flagship.id,
        cohortId: cohort1.id,
        createdById: idx === 0 ? fellow1User?.userId : manager.id,
        sdgs: { create: sdgNumbers.map((n) => ({ sdgId: sdgByNumber(n).id })) },
      },
      update: {},
    });

    if (fellow1User && fellow2User) {
      await db.projectMember.upsert({
        where: { projectId_userId: { projectId: project.id, userId: fellow1User.userId } },
        create: { projectId: project.id, userId: fellow1User.userId, fellowId: fellow1User.id, roleInProject: "Project Lead" },
        update: {},
      });
      await db.projectMember.upsert({
        where: { projectId_userId: { projectId: project.id, userId: fellow2User.userId } },
        create: { projectId: project.id, userId: fellow2User.userId, fellowId: fellow2User.id, roleInProject: "Team Member" },
        update: {},
      });
    }
  }

  // ---------------------------------------------------------------------
  // Testimonials
  // ---------------------------------------------------------------------
  const testimonials = [
    {
      authorName: fullName(0),
      authorRole: "CitizensNexus 1.0 Fellow",
      quote: "CitizensNexus gave me the mentorship, structure and network I needed to turn an idea into a real community project.",
      storyBody: "Before CitizensNexus, I had passion but no clear direction. Through the fellowship, I built the skills and confidence to lead CleanWater Yaba.",
      isFeatured: true,
    },
    {
      authorName: mentorTitles[1].title,
      authorRole: "CitizensNexus Mentor",
      quote: "Mentoring young leaders through CitizensNexus has been one of the most rewarding experiences of my career.",
      isFeatured: true,
    },
    {
      authorName: fullName(5),
      authorRole: "CitizensNexus 1.0 Fellow",
      quote: "The Learning Hub and mentorship combination is unlike anything else available to young Nigerians today.",
      isFeatured: true,
    },
  ];
  for (const t of testimonials) {
    await db.testimonial.create({ data: t });
  }

  // ---------------------------------------------------------------------
  // Announcements
  // ---------------------------------------------------------------------
  const announcementsData = [
    { title: "Welcome to CitizensNexus 1.0!", body: "We're thrilled to officially welcome all 20 fellows to CitizensNexus 1.0. Check your dashboard for your programme calendar.", audience: "FELLOWS" as const },
    { title: "New Opportunities Published", body: "Five new opportunities including scholarships and internships have been added to the Opportunities board.", audience: "ALL" as const },
    { title: "Mentor Session Reminder", body: "Please remember to log your mentoring sessions after each meeting with your assigned fellow.", audience: "MENTORS" as const },
  ];
  for (const a of announcementsData) {
    await db.announcement.create({ data: { ...a, createdById: admin.id } });
  }

  // ---------------------------------------------------------------------
  // Partners
  // ---------------------------------------------------------------------
  const partnersData = [
    { organisationName: "Mastercard Foundation", type: "DEVELOPMENT_ORG" as const, isFeatured: true },
    { organisationName: "Tony Elumelu Foundation", type: "NGO" as const, isFeatured: true },
    { organisationName: "Flutterwave", type: "PRIVATE_SECTOR" as const, isFeatured: true },
    { organisationName: "University of Lagos", type: "UNIVERSITY" as const, isFeatured: false },
    { organisationName: "Federal Ministry of Youth Development", type: "GOVERNMENT" as const, isFeatured: false },
    { organisationName: "UNDP Nigeria", type: "MULTILATERAL" as const, isFeatured: true },
  ];
  for (const p of partnersData) {
    const existing = await db.partner.findFirst({ where: { organisationName: p.organisationName } });
    if (!existing) await db.partner.create({ data: { ...p, isApproved: true } });
  }

  // ---------------------------------------------------------------------
  // Resources
  // ---------------------------------------------------------------------
  const resourcesData = [
    { title: "CV & Resume Template", category: "Career", resourceType: "TEMPLATE" as const, fileUrl: "https://example.com/resources/cv-template" },
    { title: "Guide to Grant Proposal Writing", category: "Fundraising", resourceType: "GUIDE" as const, fileUrl: "https://example.com/resources/grant-writing-guide" },
    { title: "Public Speaking Cheat Sheet", category: "Communication", resourceType: "PDF" as const, fileUrl: "https://example.com/resources/public-speaking" },
  ];
  for (const r of resourcesData) {
    await db.resource.create({ data: { ...r, uploadedById: admin.id } });
  }

  // ---------------------------------------------------------------------
  // Sample applications (various statuses) + a MEMBER applicant account
  // ---------------------------------------------------------------------
  const applicant = await db.user.upsert({
    where: { email: "applicant@citizensnexus.africa" },
    create: { name: "Chiamaka Obi", email: "applicant@citizensnexus.africa", passwordHash, role: "MEMBER", profile: { create: {} } },
    update: {},
  });

  await db.application.upsert({
    where: { userId_programmeId_cohortId: { userId: applicant.id, programmeId: digitalSkills.id, cohortId: digitalCohort.id } },
    create: {
      userId: applicant.id,
      programmeId: digitalSkills.id,
      cohortId: digitalCohort.id,
      status: "SUBMITTED",
      submittedAt: new Date(),
      personalInfo: { fullName: "Chiamaka Obi", phone: "+2348012345678", gender: "Female", stateOfOrigin: "Anambra", stateOfResidence: "Lagos", dateOfBirth: "2001-04-12" },
      education: { institution: "University of Lagos", fieldOfStudy: "Computer Science", level: "Undergraduate", graduationYear: "2026" },
      professionalBackground: { currentStatus: "Student" },
      leadershipExperience: "Led the Computer Science students' association for one academic year, organising 3 major tech events.",
      communityInvolvement: "Volunteer coding instructor for a local youth centre.",
      skills: ["Digital Skills", "Leadership"],
      motivation: "I want to deepen my technical skills and connect with a network of purpose-driven young leaders across Africa.",
      careerAspirations: "To become a product manager building technology for social impact.",
      challenges: "Balancing academic responsibilities with extracurricular leadership commitments.",
      programmeExpectations: "Structured mentorship and practical AI skills training.",
    },
    update: {},
  });

  // Additional applications from a few fellows (already accepted) to populate charts realistically
  for (let i = 0; i < 6; i++) {
    const fellowRecord = fellows[i + 10];
    const fellowUser = await db.fellow.findUnique({ where: { id: fellowRecord.id } });
    if (!fellowUser) continue;
    const statuses = ["UNDER_REVIEW", "SHORTLISTED", "REJECTED", "WAITLISTED"] as const;
    const existingApp = await db.application.findFirst({ where: { userId: fellowUser.userId, programmeId: advocacy.id } });
    if (!existingApp) {
      await db.application.create({
        data: {
          userId: fellowUser.userId,
          programmeId: advocacy.id,
          status: statuses[i % statuses.length],
          submittedAt: new Date(),
          motivation: "Passionate about advocacy and civic engagement in my community.",
          leadershipExperience: "Organised community clean-up drives and youth voter education sessions.",
          communityInvolvement: "Active volunteer with local civic organisations.",
          careerAspirations: "To work in public policy.",
          challenges: "Limited access to policy mentorship in my region.",
          programmeExpectations: "Hands-on advocacy training.",
        },
      });
    }
  }

  // ---------------------------------------------------------------------
  // A partner user + partnership inquiry
  // ---------------------------------------------------------------------
  await db.user.upsert({
    where: { email: "partner@citizensnexus.africa" },
    create: {
      name: "Grace Adebayo",
      email: "partner@citizensnexus.africa",
      passwordHash,
      role: "PARTNER",
      partner: { create: { organisationName: "Adebayo Foundation", type: "NGO", isApproved: true } },
    },
    update: {},
  });

  await db.partnershipInquiry.create({
    data: {
      organisationName: "Zenith Impact Ventures",
      contactName: "Michael Osei",
      contactEmail: "michael@zenithimpact.example",
      message: "We're interested in sponsoring the Digital & AI Skills Track for the next cohort.",
    },
  });

  // ---------------------------------------------------------------------
  // Site settings
  // ---------------------------------------------------------------------
  await db.siteSetting.upsert({
    where: { key: "impact_stats" },
    create: {
      key: "impact_stats",
      value: [
        { label: "Young People Reached", value: "10,000+" },
        { label: "Fellows Developed", value: "500+" },
        { label: "Active Mentors", value: "200+" },
        { label: "Community Projects", value: "100+" },
      ],
    },
    update: {},
  });

  // ---------------------------------------------------------------------
  // Issue one certificate for demo purposes
  // ---------------------------------------------------------------------
  const graduatingFellow = await db.fellow.findUnique({ where: { id: fellows[19].id } });
  if (graduatingFellow) {
    await db.fellow.update({ where: { id: graduatingFellow.id }, data: { status: "GRADUATED", progressPercent: 100, completedAt: new Date() } });
    await db.certificate.create({
      data: {
        certificateCode: `CN-2025-${nanoid(8).toUpperCase()}`,
        userId: graduatingFellow.userId,
        fellowId: graduatingFellow.id,
        programmeId: flagship.id,
        cohortId: cohort1.id,
        programmeName: flagship.name,
        signatoryName: admin.name,
        signatoryTitle: "Executive Director, CitizensNexus",
      },
    });
  }

  console.log("Seed complete.");
  console.log(`\nDemo accounts (password: ${PASSWORD}):`);
  console.log("  Admin:      admin@citizensnexus.africa");
  console.log("  Manager:    manager@citizensnexus.africa");
  console.log("  Mentor:     mentor1@citizensnexus.africa … mentor5@citizensnexus.africa");
  console.log("  Fellow:     fellow1@citizensnexus.africa … fellow20@citizensnexus.africa");
  console.log("  Partner:    partner@citizensnexus.africa");
  console.log("  Applicant:  applicant@citizensnexus.africa");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
