export interface Actor {
  id: string;
  fullName: string;
  nationality: string;
  dob: string | null;
  tagline: string | null;
  bio: string | null;
  genres: string[];
  languages: string[];
  instagram: string | null;
  linkedin: string | null;
  filmography: string | null;
  journey: string | null;
  featured?: boolean;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const raw: Omit<Actor, "id">[] = [
  {
    fullName: "Mukasoma Rutera Rose",
    nationality: "Rwanda",
    dob: "1985-03-03",
    tagline: "Mudategwa",
    bio: "Ndi umubyeyi w'abana 2 umuhungu n'umukobwa.",
    genres: ["Drama", "Action", "Documentary", "Romance"],
    languages: ["Kinyarwanda", "English", "French", "Swahili"],
    instagram: "Rutera Rose",
    linkedin: null,
    filmography: "Multiple Rwandan film productions.",
    journey: "Started acting in 2014 — still active today.",
    featured: true,
  },
  {
    fullName: "Mukeshimana Marthe",
    nationality: "Rwanda",
    dob: "1980-12-30",
    tagline: "Warubizi Se?",
    bio: "Versatile actress specializing in leadership, executive and authority roles — Manager, Boss, Diplomatic figures.",
    genres: ["Action", "Comedy", "Documentary"],
    languages: ["Kinyarwanda", "French"],
    instagram: null,
    linkedin: null,
    filmography: "Ishuli — 2026 — Main Actor / Manager\nhttps://youtu.be/YxB2q34POaI",
    journey: "2025 — Entered cinema. 2026 — First cohort, joined CyaneHub.",
    featured: true,
  },
  {
    fullName: "Vivante Irakarama",
    nationality: "Rwanda",
    dob: "1996-07-14",
    tagline: "Authentic. Versatile. Powerful presence.",
    bio: "Vivante Irakarama is a passionate and versatile actor known for delivering authentic and emotionally powerful performances. With experience in film, television, theater, and digital productions, she brings creativity, discipline, and strong screen presence to every role.",
    genres: ["Drama", "Action", "Documentary"],
    languages: ["Kinyarwanda", "English", "French"],
    instagram: null,
    linkedin: null,
    filmography: "Icumbi series — 2024 — Second character\nVoice of the Heart — 2026 — Festival film",
    journey: "Building a career across film, television and digital productions.",
    featured: true,
  },
  {
    fullName: "Umutesi Betty",
    nationality: "Rwanda",
    dob: null,
    tagline: "A Rwandan cinema talent on the rise.",
    bio: "Seven years in Rwandan cinema. Passionate about storytelling, committed to growing internationally through CyaneHub.",
    genres: ["Drama", "Action", "Romance"],
    languages: ["Kinyarwanda"],
    instagram: "uwase_sabna",
    linkedin: null,
    filmography: "Iintimba Ya Mama & Mw'Ibanga",
    journey: "Seven years building a career in Rwandan cinema, now partnering with CyaneHub.",
  },
  {
    fullName: "MUHOZA Jean Tresor (Fantastic)",
    nationality: "Rwanda",
    dob: "1994-03-13",
    tagline: "Representing Rwanda on the world stage.",
    bio: "Jean Tresor Muhoza is a Rwandan professional actor who has played different roles in Rwandan movies — Karingushyo in Seburikoko TV series, Tanazi in Papa Sava web series, Tharcise in The Bishop Family TV series, Peter in Injustice feature movie, and many more. He also performs in stage theater and radio drama.",
    genres: ["Drama", "Comedy", "Documentary", "Romance"],
    languages: ["Kinyarwanda", "English"],
    instagram: "https://www.instagram.com/actor_fantaa",
    linkedin: "https://www.linkedin.com/in/muhoza-jean-tresor-7035b82aa",
    filmography:
      "Injustice — 2022 — Supporting actor\nSeburikoko — 2022–2026 — Supporting actor\nPapa Sava — 2024–2026\nThe Bishop Family — Tharcise",
    journey:
      "2022 — 1st cohort, Zacu Entertainment\n2024 — 2nd cohort, Papa Sava\n2026 — 3rd cohort, joined CyaneHub",
    featured: true,
  },
  {
    fullName: "Revocathe Mushimiyimana",
    nationality: "Rwanda",
    dob: null,
    tagline: "Aho nyuze basigara banyirahira.",
    bio: "An emerging Rwandan talent with natural gift for romance and dramatic roles.",
    genres: ["Romance"],
    languages: ["Kinyarwanda", "English"],
    instagram: "Mushimiyimana Revocathe",
    linkedin: null,
    filmography: null,
    journey: "Just starting out — driven by a natural calling for the screen.",
  },
  {
    fullName: "Marie Gorette Uwantege",
    nationality: "Rwanda",
    dob: "1997-01-01",
    tagline: "Gaju. Clara. Many faces, one talent.",
    bio: "A.K.A Gaju, A.K.A Clara — a versatile actress excelling in intense, emotional and youth roles. Also a singer.",
    genres: ["Drama", "Action", "Documentary", "Romance", "Singer"],
    languages: ["Kinyarwanda", "English"],
    instagram: "https://www.instagram.com/uwantegemariegotettegmail.com9",
    linkedin: null,
    filmography: "Ukuri series — 2026 — Main actor\nhttps://youtu.be/YU79WPIGLLw",
    journey:
      "Entered Rwandan cinema on 08/01/2026 at M. Nick's acting school. First film in March 2026. Joined CyaneHub in April through a casting session.",
    featured: true,
  },
  {
    fullName: "Dusabe Angelique",
    nationality: "Rwanda",
    dob: "1984-03-16",
    tagline: "Grace on screen.",
    bio: "Film actress drawn to calm, caring and medical roles. Loves stories centered on love and humanity.",
    genres: ["Drama", "Action", "Comedy", "Documentary", "Romance"],
    languages: ["Kinyarwanda", "English", "French"],
    instagram: "https://www.instagram.com/ange36026",
    linkedin: null,
    filmography: "Without Barriers — upcoming",
    journey: "Joined CyaneHub in January 2026.",
  },
  {
    fullName: "Uwitonze Innocante Jacky",
    nationality: "Rwanda",
    dob: "1982-08-02",
    tagline: "Mothers, leaders, healers — every role with conviction.",
    bio: "Film actress excelling in maternal, leadership, medical and teaching roles — calm or intense.",
    genres: ["Drama", "Action", "Documentary", "Romance"],
    languages: ["Kinyarwanda", "French"],
    instagram: null,
    linkedin: null,
    filmography: null,
    journey: "Discovered CyaneHub six months ago and joined the family.",
  },
  {
    fullName: "Mucyowera Valentine",
    nationality: "Rwanda",
    dob: "1991-02-14",
    tagline: "Action. Love. Emotion.",
    bio: "Film actress from Kicukiro, Kanombe. Loves any role a director hands her — with a heart for action, love stories and emotional drama.",
    genres: ["Drama", "Action", "Documentary", "Romance"],
    languages: ["Kinyarwanda"],
    instagram: "https://www.instagram.com/vavaketty",
    linkedin: null,
    filmography: "Vengeance — 2024 — Main Actor\nhttps://youtu.be/hCUSxAiG3wI",
    journey: "Started in 2020 with her first film, Abanjye Cyane. Four years and growing with CyaneHub.",
    featured: true,
  },
  {
    fullName: "Uwingabire Christine",
    nationality: "Rwanda",
    dob: "1990-01-01",
    tagline: "Aiming for the international stage.",
    bio: "Action actress with international ambitions.",
    genres: ["Action"],
    languages: ["Kinyarwanda"],
    instagram: null,
    linkedin: null,
    filmography: "Biguhe Isomo — 2025 — Main Actor\nhttps://youtu.be/ljSzTWzmOy4",
    journey: "Entered cinema in 2024. Discovered CyaneHub in 2026 through an actor friend.",
  },
  {
    fullName: "Rwagasore Jean Louis (Jilos)",
    nationality: "Rwanda",
    dob: null,
    tagline: "Tugire isi yacu nziza. Let's build a better world.",
    bio: "Jilos is an actor and a decor artist (visual artist). Multilingual, versatile across drama, action and romance.",
    genres: ["Drama", "Action", "Documentary", "Romance"],
    languages: ["Kinyarwanda", "English", "French", "Swahili"],
    instagram: "https://www.instagram.com/jilosart/",
    linkedin: null,
    filmography:
      "Seburikoko — 2018 — Actor\nAmahitamo — 2024 — Actor\nThe Wanted — 2025 — Actor\nWho Am I — 2024 — Actor\nAbakazana — 2025 — Actor\nDivorce — Actor",
    journey: "Active across Rwandan film and visual arts — a multidisciplinary creative voice.",
    featured: true,
  },
];

export const actors: Actor[] = raw.map((a) => ({ ...a, id: slug(a.fullName) }));

export const getActor = (id: string) => actors.find((a) => a.id === id);

// Deterministic gradient for placeholder portraits, keyed off the name.
export const portraitGradient = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  const hue2 = (hue + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue} 70% 28%), hsl(${hue2} 70% 14%))`;
};

export const initials = (name: string) =>
  name
    .replace(/\(.*\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
