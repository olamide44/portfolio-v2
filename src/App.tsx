import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronDown,
  Command,
  ExternalLink,
  FileSpreadsheet,
  Github,
  Globe,
  GraduationCap,
  Mail,
  Phone,
  Rocket,
  Sparkles,
  Terminal as TerminalIcon,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Project = {
  title: string;
  summary: string;
  highlights: string[];
  tech: string[];
  repo?: string;
  demo?: string;
};

type Experience = {
  role: string;
  org: string;
  start: string;
  end: string;
  points: string[];
};

const PROFILE = {
  name: "Olamide Yusuf",
  tag: "CS & Software Engineering @ Maynooth (’26) • Building with TypeScript, Java & Python",
  pitch:
    "I design and ship clean, reliable software. I like tight feedback loops, pragmatic engineering, and turning fuzzy problems into shipped code.",
  location: "Dublin, Ireland",
  email: "olamideyusuf32@gmail.com",
  phone: "+353 85 273 8347",
  resumeUrl: "https://app.getfiledrop.com/share/7c1ba683-86f6-416e-aedc-8d52c1c6f1ac",
  github: "https://github.com/olamide44",
  linkedin: "https://www.linkedin.com/in/olamideyusuf192/",
  website: "https://olamideyusuf.vercel.com",
};

const PROJECTS: Project[] = [
  {
    title: "AI-Enhanced Financial Dashboard",
    summary:
      "AI-powered financial dashboard combining live market data, predictive analytics, sentiment analysis, and a portfolio insights chatbot.",
    highlights: [
      "User authentication, portfolio setup, and live market data via API",
      "Dashboards with price history, moving averages, and risk/return metrics",
      "ML-powered forecasts (LSTM/Prophet) with next-7-day expected ranges",
      "GPT-generated portfolio insights and diversification suggestions",
      "FinBERT sentiment analysis of financial news and correlation with holdings",
      "Chatbot assistant answering portfolio performance questions with charts",
    ],
    tech: [
      "React",
      "FastAPI",
      "PostgreSQL",
      "OpenAI API",
      "FinBert",
      "scikit-learn",
    ],
    repo: "https://github.com/yourhandle/portfolio",
    demo: "https://your-portfolio-demo.example",
  },
  {
    title: "AI-Powered Resume Assistant",
    summary:
      "Full-stack AI platform that delivers personalized CV feedback, generates tailored cover letters, and tracks job applications.",
    highlights: [
      "AI-powered resume analysis and tailored feedback",
      "Cover letter generation with customizable tone and style",
      "Application tracker with status updates and notes",
      "User authentication for secure sign-in",
      "Modern, responsive Next.js + Tailwind UI",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "React",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "OpenAI API",
      "Tailwind CSS",
    ],
    repo: "https://github.com/olamide44/applixr",
    demo: "https://applixr.com",
  },
  {
    title: "Online Store Web App",
    summary:
      "Full‑stack e‑commerce demo with auth, product catalog, cart, and checkout.",
    highlights: [
      "Secure user authentication, shopping cart, checkout flow, and order tracking",
      "CRUD operations with admin dashboard for products and orders",
      "Previously deployed on Heroku with PostgreSQL database",
    ],
    tech: ["Flask", "Python", "HTML/CSS", "Heroku", "PostgreSQL", "Git"],
    repo: "https://github.com/olamide44/online_store",
  },
  {
    title: "Library Management System",
    summary:
      "Admin dashboard to manage books, patrons, loans, and overdue reminders.",
    highlights: [
      "RESTful API with Spring Boot & JPA for CRUD operations",
      "Responsive frontend with JavaScript, HTML, and CSS",
      "Previously deployed on Heroku with PostgreSQL database",
    ],
    tech: [
      "Java",
      "Spring Boot",
      "JPA",
      "PostgreSQL",
      "JavaScript",
      "HTML/CSS",
    ],
    repo: "https://github.com/olamide44/library-management-system",
  },
];

const EXPERIENCE: Experience[] = [
  {
    role: "Data Operations Intern",
    org: "Citco Fund Services",
    start: "Feb 2025",
    end: "Aug 2025",
    points: [
      "Designed and implemented a full-stack internal application visualising financial reports from the Morgan Stanley API on Citco’s hedge fund clients, including some of the world’s largest investment managers.",
      "Built with React (TypeScript) and Python (FastAPI), reducing manual reporting by 60%.",
      "Built automated ETL workflows with Python for data ingestion, cleaning and storage, improving query performance by 35%.",
      "Collaborated with QA and DevOps to enhance portfolio analytics, increasing accuracy and reducing processing time.",
      "Created technical documentation that trained non-technical staff to adopt the new workflows.",
    ],
  },
  {
    role: "Software Projects (Academic & Personal)",
    org: "Maynooth University & Self‑initiated",
    start: "2023",
    end: "Present",
    points: [
      "Shipped multiple projects across web, backend, and automation.",
      "Collaborated in teams using Git and lightweight agile practices.",
    ],
  },
];

const SKILLS = [
  "TypeScript",
  "React",
  "Java",
  "Python",
  "SQL",
  "Node.js",
  "PostgreSQL",
  "MongoDB",
  "Git",
];

// ==========================
// UTIL & HOOKS
// ==========================

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState] as const;
}

function useKeyboard(shortcuts: Record<string, (e: KeyboardEvent) => void>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = [
        e.ctrlKey || e.metaKey ? "mod" : "",
        e.shiftKey ? "shift" : "",
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join("+");
      if (shortcuts[key]) shortcuts[key](e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}

// ==========================
// COMMAND PALETTE
// ==========================

type Cmd = { id: string; label: string; action: () => void; hint?: string };

function CommandPalette({
  open,
  setOpen,
  commands,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  commands: Cmd[];
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(s));
  }, [q, commands]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 240 }}
            className="mx-auto max-w-xl rounded-2xl border bg-white/90 p-2 shadow-xl dark:border-white/10 dark:bg-zinc-900/90"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 rounded-xl border px-3 py-2 dark:border-white/10">
              <Command size={16} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type a command… (e.g. ‘Go to Projects’ or ‘Email’ )"
                className="w-full bg-transparent p-2 outline-none"
              />
              <kbd className="rounded border px-2 py-1 text-xs opacity-70">
                esc
              </kbd>
            </div>
            <ul className="mt-2 max-h-72 overflow-auto">
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setOpen(false);
                      c.action();
                    }}
                    className="group flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span>{c.label}</span>
                    {c.hint && (
                      <span className="text-xs opacity-60">{c.hint}</span>
                    )}
                  </button>
                </li>
              ))}
              {!filtered.length && (
                <div className="px-3 py-6 text-sm opacity-70">
                  No matching commands.
                </div>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================
// TERMINAL
// ==========================

function Terminal({
  onNavigate,
  onTheme,
}: {
  onNavigate: (id: string) => void;
  onTheme: (t: "light" | "dark") => void;
}) {
  const [lines, setLines] = useState<string[]>([
    "Welcome to oy@portfolio — type `help` to get started.",
  ]);
  const [input, setInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  function run(cmd: string) {
    const args = cmd.trim().split(/\s+/);
    const head = args.shift()?.toLowerCase();

    const echo = (msg: string) => setLines((l) => [...l, msg]);

    switch (head) {
      case "help":
        echo(
          "commands: help, about, projects, skills, contact, goto <section>, open <repo|site>"
        );
        break;
      case "about":
        echo(`Hi! I'm ${PROFILE.name}. ${PROFILE.pitch}`);
        break;
      case "projects":
        PROJECTS.forEach((p) => echo(`• ${p.title} — ${p.summary}`));
        break;
      case "skills":
        echo("Skills: " + SKILLS.join(", "));
        break;
      case "contact":
        echo(`Email: ${PROFILE.email} | Website: ${PROFILE.website}`);
        break;
      case "goto":
        if (args[0]) {
          onNavigate(args[0]);
          echo(`Navigating to ${args[0]}…`);
        } else echo("Usage: goto <hero|projects|experience|skills|contact>");
        break;
      case "theme":
        if (args[0] === "light" || args[0] === "dark") {
          onTheme(args[0]);
          echo(`Switched to ${args[0]} mode.`);
        } else echo("Usage: theme <light|dark>");
        break;
      case "open":
        if (args[0] === "repo") window.open(PROJECTS[0].repo, "_blank");
        else if (args[0] === "site") window.open(PROFILE.website, "_blank");
        else echo("Usage: open <repo|site>");
        break;
      case "cls":
      case "clear":
        setLines([]);
        break;
      default:
        echo(`Unknown command: ${cmd}. Try 'help'.`);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input;
    setLines((l) => [...l, `> ${cmd}`]);
    run(cmd);
    setInput("");
  }

  return (
    <div className="rounded-2xl border bg-black text-white shadow-inner">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs uppercase tracking-wider opacity-70">
        <TerminalIcon size={16} /> Terminal
      </div>
      <div ref={ref} className="max-h-56 overflow-auto p-3 font-mono text-sm">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {l}
          </div>
        ))}
      </div>
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 border-t border-white/10 p-2"
      >
        <span className="px-2 font-mono text-sm text-emerald-400">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="help | projects | skills | goto projects"
          className="flex-1 bg-transparent p-1 outline-none placeholder:opacity-50"
        />
      </form>
    </div>
  );
}

// ==========================
// PRESENTATION COMPONENTS
// ==========================

function Section({
  id,
  title,
  icon,
  children,
  subtitle,
}: {
  id: string;
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold">
            {icon} {title}
          </h2>
          {subtitle && <p className="mt-1 opacity-70">{subtitle}</p>}
        </div>
        <a href="#top" className="text-sm opacity-60 hover:opacity-100">
          Back to top
        </a>
      </div>
      {children}
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border px-3 py-1 text-xs opacity-80 dark:border-white/10">
      {children}
    </span>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", damping: 22, stiffness: 240 }}
      className="group relative overflow-hidden rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur-md hover:shadow-md dark:border-white/10 dark:bg-zinc-900/70"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/20 to-fuchsia-400/20 blur-2xl transition group-hover:scale-150" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{p.title}</h3>
          <p className="mt-1 opacity-80">{p.summary}</p>
        </div>
        <div className="flex items-center gap-2">
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              aria-label="Repository"
              className="rounded-lg border px-2 py-1 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <Github size={16} />
            </a>
          )}
          {p.demo && (
            <a
              href={p.demo}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border px-2 py-1 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {p.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>
    </motion.div>
  );
}

function TimelineItem({ e }: { e: Experience }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-fuchsia-400" />
      <div className="flex flex-wrap items-end gap-2">
        <h3 className="font-semibold">{e.role}</h3>
        <span className="opacity-70">@ {e.org}</span>
      </div>
      <div className="text-sm opacity-60">
        {e.start} — {e.end}
      </div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {e.points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

// ==========================
// ROOT
// ==========================

export default function App() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "dark");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Improved bottom detection using scrollHeight & innerHeight
  useEffect(() => {
    const onScroll = () => {
      const atBottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;
      setShowScrollHint(!atBottom);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const commands: Cmd[] = [
    {
      id: "hero",
      label: "Go to Hero",
      action: () => scrollTo("top"),
      hint: "g h",
    },
    {
      id: "projects",
      label: "Go to Projects",
      action: () => scrollTo("projects"),
      hint: "g p",
    },
    {
      id: "experience",
      label: "Go to Experience",
      action: () => scrollTo("experience"),
      hint: "g e",
    },
    {
      id: "skills",
      label: "Go to Skills",
      action: () => scrollTo("skills"),
      hint: "g s",
    },
    {
      id: "contact",
      label: "Go to Contact",
      action: () => scrollTo("contact"),
      hint: "g c",
    },
    {
      id: "email",
      label: "Email Olamide",
      action: () => (window.location.href = `mailto:${PROFILE.email}`),
    },
    {
      id: "github",
      label: "Open GitHub",
      action: () => window.open(PROFILE.github, "_blank"),
    },
    {
      id: "resume",
      label: "Open Resume",
      action: () => window.open(PROFILE.resumeUrl, "_blank"),
    },
  ];

  // keyboard shortcuts
  useKeyboard({
    "mod+k": (e) => {
      e.preventDefault();
      setPaletteOpen(true);
    },
    "g+p": (e) => {
      e.preventDefault();
      scrollTo("projects");
    },
    "g+e": (e) => {
      e.preventDefault();
      scrollTo("experience");
    },
    "g+s": (e) => {
      e.preventDefault();
      scrollTo("skills");
    },
    "g+c": (e) => {
      e.preventDefault();
      scrollTo("contact");
    },
    escape: () => setPaletteOpen(false),
  });

  return (
    <div
      id="top"
      className="relative min-h-screen bg-white text-zinc-900 antialiased dark:bg-[#0a0a0a] dark:text-zinc-100"
    >
      {/* Background visuals */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60rem_circle_at_10%_10%,rgba(16,185,129,0.08),transparent_60%),radial-gradient(50rem_circle_at_90%_20%,rgba(217,70,239,0.08),transparent_60%)]" />
        <div
          className="absolute inset-0 mix-blend-overlay opacity-30"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(
              `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\" viewBox=\"0 0 40 40\"><path fill=\"%23fff\" fill-opacity=\"0.04\" d=\"M0 0h40v40H0z\"/></svg>`
            )}')`,
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:border-white/10 dark:bg-zinc-900/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2 font-semibold">
            <Sparkles size={18} className="text-emerald-500" /> {PROFILE.name}
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-xl border px-3 py-2 text-sm opacity-80 hover:opacity-100 md:flex dark:border-white/10"
            >
              <Command size={16} />{" "}
              <span className="hidden sm:inline">Search</span>
              <kbd className="ml-2 rounded border px-1 text-[10px] opacity-60">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4">
        <section className="relative py-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs dark:border-white/10">
                <Globe size={14} /> {PROFILE.location}
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                I build useful software and ship.
              </h1>
              <p className="mt-4 max-w-prose text-lg opacity-80">
                {PROFILE.pitch}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 font-medium text-white shadow hover:shadow-md"
                >
                  View Projects <ArrowRight size={16} />
                </a>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <Github size={16} /> GitHub
                </a>
                <a
                  href={PROFILE.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <FileSpreadsheet size={16} /> Resume
                </a>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <Mail size={16} /> Email
                </a>
              </div>
            </div>
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-zinc-50 to-zinc-100 p-6 shadow-xl dark:border-white/10 dark:from-zinc-900 dark:to-zinc-800">
                <div className="mb-4 flex items-center gap-2 text-sm opacity-70">
                  <TerminalIcon size={16} /> Quick Terminal
                </div>
                <Terminal onNavigate={scrollTo} onTheme={setTheme} />
                <div className="mt-3 text-xs opacity-70">
                  Try: <code>projects</code>, <code>goto skills</code>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 opacity-80">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs dark:border-white/10">
              <GraduationCap size={14} /> B.Sc. CS & Software Engineering (’26)
              — Maynooth University
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs dark:border-white/10">
              <BriefcaseBusiness size={14} /> Citco — Data Operations Intern
              (Feb–Aug ’25)
            </div>
          </div>
        </section>

        {/* Projects */}
        <Section
          id="projects"
          title="Projects"
          icon={<Rocket />}
          subtitle="A few things I’m proud of. Code you can run and read."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.title} p={p} />
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section
          id="experience"
          title="Experience"
          icon={<BriefcaseBusiness />}
          subtitle="Internships, collabs, and highlights."
        >
          <div className="space-y-6 border-l pl-4 dark:border-white/10">
            {EXPERIENCE.map((e, idx) => (
              <TimelineItem key={idx} e={e} />
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section
          id="skills"
          title="Skills"
          icon={<Sparkles />}
          subtitle="Tools I use regularly."
        >
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
          </div>
        </Section>

        {/* Contact */}
        <Section
          id="contact"
          title="Contact"
          icon={<Mail />}
          subtitle="Open to graduate and entry level roles."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={`mailto:${PROFILE.email}`}
              className="flex items-center gap-3 rounded-2xl border p-4 hover:shadow dark:border-white/10"
            >
              <Mail /> {PROFILE.email}
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border p-4 hover:shadow dark:border-white/10"
            >
              <Github /> GitHub
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border p-4 hover:shadow dark:border-white/10"
            >
              <ExternalLink /> LinkedIn
            </a>
            <div className="flex items-center gap-3 rounded-2xl border p-4 dark:border-white/10">
              <Phone /> {PROFILE.phone}
            </div>
          </div>
        </Section>

        <footer className="py-10 text-center text-sm opacity-70">
          © {new Date().getFullYear()} {PROFILE.name}
        </footer>
      </main>

      <CommandPalette
        open={paletteOpen}
        setOpen={setPaletteOpen}
        commands={commands}
      />

      <AnimatePresence>
        {showScrollHint && (
          <motion.a
            href="#projects"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border bg-white/70 px-4 py-2 text-sm shadow backdrop-blur hover:bg-white/90 dark:border-white/10 dark:bg-zinc-900/70"
          >
            Scroll <ChevronDown className="inline" size={14} />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
