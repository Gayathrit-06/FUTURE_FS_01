    const { useState, useEffect, useCallback } = React;

    /* ── Lucide icon wrapper ─────────────────────────────────────────── */
    function Icon({ name, className = '', style = {} }) {
      const ref = React.useRef(null);
      useEffect(() => {
        if (ref.current && window.lucide) {
          ref.current.innerHTML = '';
          const svg = lucide.createElement(lucide[name] || lucide.Circle);
          Object.assign(svg.style, style);
          if (className) svg.setAttribute('class', className);
          ref.current.appendChild(svg);
        }
      }, [name, className]);
      return <span ref={ref} style={{ display:'inline-flex', alignItems:'center', ...style }} />;
    }

    /* ── useTheme ────────────────────────────────────────────────────── */
    function useTheme() {
      const [theme, setTheme] = useState('dark');
      useEffect(() => {
        const stored = localStorage.getItem('theme') || 'dark';
        setTheme(stored);
        document.documentElement.classList.toggle('dark', stored === 'dark');
      }, []);
      const toggle = () => {
        setTheme(prev => {
          const next = prev === 'dark' ? 'light' : 'dark';
          document.documentElement.classList.toggle('dark', next === 'dark');
          localStorage.setItem('theme', next);
          return next;
        });
      };
      return { theme, toggle };
    }

    /* ── Router (hash-based) ─────────────────────────────────────────── */
    function useRoute() {
      const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');
      useEffect(() => {
        const handler = () => setRoute(window.location.hash.slice(1) || '/');
        window.addEventListener('hashchange', handler);
        return () => window.removeEventListener('hashchange', handler);
      }, []);
      return route;
    }

    function navigate(to) {
      window.location.hash = to;
      window.scrollTo(0, 0);
    }

    function Link({ to, children, className = '', onClick, activeClass = '', exact = false }) {
      const route = useRoute();
      const isActive = exact ? route === to : route === to;
      return (
        <a
          href={'#' + to}
          className={className + (isActive && activeClass ? ' ' + activeClass : '')}
          onClick={e => { if (onClick) onClick(e); }}
        >
          {children}
        </a>
      );
    }

    /* ── SectionTitle ────────────────────────────────────────────────── */
    function SectionTitle({ eyebrow, title }) {
      return (
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-[0.3em] mb-3"
             style={{ color: 'var(--accent-cyan)' }}>
            {eyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="gradient-text">{title}</span>
          </h2>
          <div className="mx-auto mt-4 h-px w-24"
               style={{ background: 'linear-gradient(to right, transparent, var(--accent-cyan), transparent)' }} />
        </div>
      );
    }

    /* ── Navbar ──────────────────────────────────────────────────────── */
    const navLinks = [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/projects', label: 'Projects' },
      { to: '/skills', label: 'Skills' },
      { to: '/certifications', label: 'Certifications' },
      { to: '/contact', label: 'Contact' },
    ];

    function Navbar() {
      const [open, setOpen] = useState(false);
      const { theme, toggle } = useTheme();
      const route = useRoute();

      return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
                style={{ background: 'color-mix(in oklab, var(--background) 70%, transparent)', borderColor: 'var(--border)' }}>
          <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
            <a href="#/" className="font-bold text-lg tracking-tight"
               style={{ background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Gayathri T
            </a>

            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map(l => (
                <li key={l.to}>
                  <a href={'#' + l.to}
                     className={'px-4 py-2 text-sm rounded-full transition-all inline-block ' +
                       (route === l.to
                         ? 'text-foreground'
                         : 'hover:text-foreground')}
                     style={route === l.to
                       ? { color: 'var(--foreground)', background: 'color-mix(in oklab, var(--foreground) 10%, transparent)' }
                       : { color: 'color-mix(in oklab, var(--foreground) 60%, transparent)' }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <button onClick={toggle} aria-label="Toggle theme"
                      className="grid place-items-center h-10 w-10 rounded-full border transition-all"
                      style={{ borderColor: 'var(--border)', background: 'color-mix(in oklab, var(--foreground) 5%, transparent)', color: 'var(--foreground)' }}>
                {theme === 'dark'
                  ? <Icon name="Sun" className="h-4 w-4" style={{ width: 16, height: 16 }} />
                  : <Icon name="Moon" className="h-4 w-4" style={{ width: 16, height: 16 }} />}
              </button>

              <button className="md:hidden p-2" onClick={() => setOpen(s => !s)} aria-label="Toggle menu"
                      style={{ color: 'var(--foreground)' }}>
                <span className="ham-line" style={{ transform: open ? 'translateY(8px) rotate(45deg)' : '' }} />
                <span className="ham-line" style={{ opacity: open ? 0 : 1, marginTop: 6 }} />
                <span className="ham-line" style={{ transform: open ? 'translateY(-8px) rotate(-45deg)' : '', marginTop: 6 }} />
              </button>
            </div>
          </nav>

          {open && (
            <div className="md:hidden border-t animate-fade-in"
                 style={{ borderColor: 'var(--border)', background: 'color-mix(in oklab, var(--background) 95%, transparent)', backdropFilter: 'blur(16px)' }}>
              <ul className="flex flex-col px-6 py-4 gap-1">
                {navLinks.map(l => (
                  <li key={l.to}>
                    <a href={'#' + l.to}
                       onClick={() => setOpen(false)}
                       className="block w-full text-left px-4 py-3 rounded-lg text-sm"
                       style={route === l.to
                         ? { background: 'color-mix(in oklab, var(--foreground) 10%, transparent)', color: 'var(--foreground)' }
                         : { color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>
      );
    }

    /* ── Hero ────────────────────────────────────────────────────────── */
    function Hero() {
      return (
        <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
          <div className="pointer-events-none absolute inset-0" style={{ zIndex: -1 }}>
            <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full blur-3xl"
                 style={{ background: 'oklch(0.5 0.2 260 / 0.3)' }} />
            <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full blur-3xl"
                 style={{ background: 'oklch(0.55 0.18 200 / 0.3)' }} />
            <div className="absolute inset-0 opacity-[0.04]"
                 style={{ backgroundImage: 'linear-gradient(oklch(0.9 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0 0) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          </div>

          <div className="mx-auto max-w-7xl w-full grid md:grid-cols-[1.25fr_1fr] gap-16 md:gap-24 lg:gap-32 items-center">
            <div className="order-2 md:order-1 animate-fade-in">
              <p className="text-base md:text-lg font-mono uppercase tracking-[0.35em] mb-4"
                 style={{ color: 'var(--accent-cyan)' }}>
                Hello, I'm
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
                <span className="gradient-text">Gayathri T</span>
              </h1>
              <p className="mt-6 text-xl md:text-2xl lg:text-3xl font-medium"
                 style={{ color: 'color-mix(in oklab, var(--foreground) 80%, transparent)' }}>
                Problem Solver <span style={{ color: 'var(--accent-cyan)' }}>•</span>{' '}
                Frontend Enthusiast <span style={{ color: 'var(--accent-cyan)' }}>•</span>{' '}
                Tech Explorer
              </p>
              <div className="mt-5 space-y-1 text-base md:text-lg leading-relaxed"
                   style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}>
                <p>Currently Pursuing 3rd Year B.Tech Information Technology at</p>
                
                <p>
                  <span className="font-semibold" style={{ color: 'var(--accent-cyan)' }}>College of Engineering Guindy (CEG)</span>,{' '}
                  <span className="font-semibold" style={{ color: 'var(--accent-cyan)' }}>Chennai, India </span>
                </p>
                <p><span className="font-semibold" style={{ color: 'var(--accent-cyan)' }}>NxtWave CCBP 4.0</span> Learner</p>
                <p>Passionate about building responsive web applications using HTML, CSS, JavaScript, React.js, Node.js, and SQL. Interested in Full-Stack Development and solving real-world problems through technology.</p>
              </div>

              <div className="mt-10">
                <a href="#/about"
                   className="group relative inline-flex items-center gap-2 px-9 py-4 text-base md:text-lg rounded-full font-medium transition-all"
                   style={{ color: 'var(--primary-foreground)', background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))' }}
                   onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px -5px color-mix(in oklab, var(--accent-cyan) 40%, transparent)'}
                   onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                  About Me
                  <Icon name="ArrowRight" style={{ width: 20, height: 20 }} />
                </a>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center md:justify-start">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full blur-2xl opacity-50 animate-pulse"
                     style={{ background: 'linear-gradient(to top right, oklch(0.7 0.2 260), oklch(0.7 0.18 310), oklch(0.75 0.18 200))' }} />
                <div className="relative h-72 w-72 sm:h-80 sm:w-80 md:h-96 md:w-96 lg:h-[28rem] lg:w-[28rem] rounded-full p-1"
                     style={{ background: 'linear-gradient(to top right, oklch(0.75 0.18 220), oklch(0.7 0.2 310), oklch(0.75 0.18 200))' }}>
                  <div className="h-full w-full rounded-full overflow-hidden" style={{ background: 'var(--background)' }}>
                    <img src="assets/profiles.jpg" alt="Gayathri T" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    /* ── About ───────────────────────────────────────────────────────── */
    const aboutCards = [
      {
        icon: 'GraduationCap', title: 'Education',
        lines: ['B.Tech Information Technology', 'NxtWave CCBP 4.0 Program'],
      },
      {
        icon: 'Target', title: 'Career Goals',
        lines: ['Become a skilled Frontend developer', 'Contribute to innovative technology solutions'],
      },
      {
        icon: 'Sparkles', title: 'Interests',
        lines: ['Frontend Development & Web Technologies', 'Problem solving & exploring new tech', 'SQL'],
      },
    ];

    function About() {
      return (
        <section id="about" className="relative py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="Get to know me" title="About Me" />

            <div className="grid lg:grid-cols-5 gap-10 mt-12">
              <div className="lg:col-span-3 space-y-5 leading-relaxed"
                   style={{ color: 'color-mix(in oklab, var(--foreground) 75%, transparent)' }}>
                <p>
                  I am <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Gayathri T</span>, Currently pursuing my 3rd year B.Tech Information Technology student at{' '}
                  <span className="font-semibold" style={{ color: 'var(--accent-cyan)' }}>College of Engineering Guindy (CEG), Anna University, Chennai</span>.
                </p>
                <p>
                  As a{' '}<span className="font-semibold" style={{ color: 'var(--accent-cyan)' }}>NxtWave CCBP 4.0</span>{' '}
                  learner, I continuously develop my skills in Frontend Development, Web Technologies, Programming, and Software Development through hands-on projects and practical learning.
                </p>
                <p>I am passionate about building responsive web applications, exploring modern technologies, and solving real-world problems through technology.</p>
                <p>My goal is to become a skilled Software Developer and contribute to innovative technology solutions while continuously growing both technically and professionally.</p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a href="resume/Resume.pdf" download
                     className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
                     style={{ color: 'var(--primary-foreground)', background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-purple))' }}
                     onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px -5px color-mix(in oklab, var(--accent-cyan) 40%, transparent)'}
                     onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                    <Icon name="Download" style={{ width: 16, height: 16 }} />
                    Download Resume
                  </a>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {aboutCards.map(({ icon, title, lines }) => (
                  <div key={title}
                       className="group relative rounded-2xl p-5 backdrop-blur-xl transition-all"
                       style={{
                         background: 'color-mix(in oklab, var(--foreground) 3%, transparent)',
                         border: '1px solid color-mix(in oklab, var(--foreground) 10%, transparent)',
                       }}
                       onMouseEnter={e => { e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--accent-cyan) 50%, transparent)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'color-mix(in oklab, var(--foreground) 5%, transparent)'; }}
                       onMouseLeave={e => { e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--foreground) 10%, transparent)'; e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'color-mix(in oklab, var(--foreground) 3%, transparent)'; }}>
                    <div className="flex items-start gap-4">
                      <div className="grid place-items-center h-11 w-11 rounded-xl border"
                           style={{ background: 'linear-gradient(to bottom right, oklch(0.75 0.18 220 / 0.2), oklch(0.7 0.2 310 / 0.2))', borderColor: 'color-mix(in oklab, var(--foreground) 10%, transparent)' }}>
                        <Icon name={icon} style={{ width: 20, height: 20, color: 'oklch(0.75 0.18 220)' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h3>
                        <ul className="mt-1 space-y-0.5 text-sm" style={{ color: 'color-mix(in oklab, var(--foreground) 65%, transparent)' }}>
                          {lines.map(l => <li key={l}>{l}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    /* ── Projects ────────────────────────────────────────────────────── */
    const projects = [
      {
        title: 'Hostel Leave Management System',
        description: 'A web-based hostel leave management system that lets students request leaves and wardens review and approve them, backed by a PostgreSQL database.',
        tech: ['HTML', 'CSS', 'JavaScript', 'PostgreSQL'],
        image: 'assets/projects/hostel-dashboard.png',
        github: 'https://github.com/Gayathrit-06/Hostel-Leave-Management-System',
      },
      {
        title: 'StayFinder — PG & Hostel Search Management System',
        description: 'A full-stack PG & hostel discovery and management platform with customer, owner and super admin roles, powered by custom DSA (BST, AVL, Trie, HashMap) for fast search and indexing.',
        tech: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'DSA (BST, AVL, Trie, HashMap)'],
        image: 'assets/projects/stayfinder.png',
        github: 'https://github.com/Gayathrit-06/StayFinder-PG-Hostel-Search-Management-System',
      },
      {
        title: 'Client Lead Management System (Mini CRM)',
        description: 'Built a secure admin dashboard to manage client leads — add, edit, delete, track status, add follow-up notes, view pipeline and analytics.',
        tech: ['React.js', 'HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB'],
        image: 'assets/projects/mini-crm.png',
        github: 'https://github.com/Gayathrit-06/FUTURE_FS_02',
      },
      {
        title: 'Restaurant',
        description: 'Sri Murugan Mess is a single-page restaurant website where customers can browse a South Indian menu, order food online, book a table, and pay for both using an in-app digital wallet — all backed by a simple login/signup system with order and booking history.',
        tech: ['JavaScript', 'HTML5', 'CSS3'],
        image: 'assets/projects/restaurant.png',
        github: 'https://github.com/Gayathrit-06/FUTURE_FS_03',
      },
    ];

    function Projects() {
      return (
        <section id="projects" className="relative py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="Featured work" title="Projects" />

            <div className="mt-14 grid sm:grid-cols-2 gap-6">
              {projects.map(p => (
                <article key={p.title}
                         className="group relative rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-500"
                         style={{
                           background: 'color-mix(in oklab, var(--foreground) 3%, transparent)',
                           border: '1px solid color-mix(in oklab, var(--foreground) 10%, transparent)',
                         }}
                         onMouseEnter={e => { e.currentTarget.style.borderColor = 'oklch(0.75 0.18 220 / 0.5)'; e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 30px 60px -20px oklch(0.5 0.2 260 / 0.5)'; }}
                         onMouseLeave={e => { e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--foreground) 10%, transparent)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={p.image} alt={p.title} loading="lazy"
                         className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0"
                         style={{ background: 'linear-gradient(to top, var(--background), color-mix(in oklab, var(--background) 40%, transparent), transparent)' }} />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold transition-colors" style={{ color: 'var(--foreground)' }}>{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: 'color-mix(in oklab, var(--foreground) 65%, transparent)' }}>{p.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tech.map(t => (
                        <span key={t} className="px-3 py-1 text-xs font-mono rounded-full"
                              style={{ background: 'color-mix(in oklab, var(--foreground) 5%, transparent)', border: '1px solid color-mix(in oklab, var(--foreground) 10%, transparent)', color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6">
                      <a href={p.github} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                         style={{ border: '1px solid color-mix(in oklab, var(--foreground) 15%, transparent)', background: 'color-mix(in oklab, var(--foreground) 5%, transparent)', color: 'var(--foreground)' }}
                         onMouseEnter={e => { e.currentTarget.style.background = 'color-mix(in oklab, var(--foreground) 10%, transparent)'; e.currentTarget.style.borderColor = 'oklch(0.75 0.18 220 / 0.6)'; }}
                         onMouseLeave={e => { e.currentTarget.style.background = 'color-mix(in oklab, var(--foreground) 5%, transparent)'; e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--foreground) 15%, transparent)'; }}>
                        <Icon name="Github" style={{ width: 16, height: 16 }} />
                        GitHub Code
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ── Skills ──────────────────────────────────────────────────────── */
    const skillCategories = [
      {
        title: 'Programming Languages',
        skills: [
          { name: 'C', color: 'oklch(0.65 0.18 250)', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3C9.5 3 4 8.5 4 15.5S9.5 28 16.5 28 29 22.5 29 15.5 23.5 3 16.5 3zm0 2c4.7 0 8.7 3.2 9.9 7.5H6.6C7.8 8.2 11.8 5 16.5 5zm0 21C11 26 6.6 21.9 6.1 16.5h20.8C26.4 21.9 22 26 16.5 26z"/></svg>' },
          { name: 'C++', color: 'oklch(0.6 0.2 260)', letter: 'C++' },
          { name: 'Python', color: 'oklch(0.78 0.16 90)', letter: 'Py' },
        ],
      },
      {
        title: 'Programming Concepts',
        skills: [
          { name: 'Object-Oriented Programming', color: 'oklch(0.72 0.18 310)', lucide: 'Boxes' },
          { name: 'Data Structures', color: 'oklch(0.72 0.18 160)', lucide: 'Network' },
        ],
      },
      {
        title: 'Web Development',
        skills: [
          { name: 'HTML', color: 'oklch(0.68 0.2 40)', letter: 'H' },
          { name: 'CSS', color: 'oklch(0.65 0.18 240)', letter: 'CS' },
          { name: 'JavaScript', color: 'oklch(0.85 0.18 95)', letter: 'JS' },
          { name: 'React.js', color: 'oklch(0.78 0.13 210)', letter: 'Re' },
          { name: 'Flask', color: 'oklch(0.92 0.02 250)', letter: 'Fl' },
          { name: 'Bootstrap 5', color: 'oklch(0.6 0.2 290)', letter: 'B5' },
        ],
      },
      {
        title: 'Databases & Tools',
        skills: [
          { name: 'PostgreSQL', color: 'oklch(0.65 0.13 240)', letter: 'PG' },
          { name: 'Git', color: 'oklch(0.65 0.2 30)', letter: 'Git' },
          { name: 'GitHub', color: 'oklch(0.9 0.01 250)', lucide: 'Github' },
          { name: 'VS Code', color: 'oklch(0.68 0.16 230)', letter: 'VS' },
        ],
      },
    ];

    function SkillChip({ skill }) {
      return (
        <span className="skill-chip"
              style={{
                borderColor: `color-mix(in oklab, ${skill.color} 35%, transparent)`,
                background: `linear-gradient(135deg, color-mix(in oklab, ${skill.color} 14%, transparent), color-mix(in oklab, ${skill.color} 4%, transparent))`,
                color: 'var(--foreground)',
              }}>
          {skill.lucide
            ? <Icon name={skill.lucide} style={{ width: 16, height: 16, color: skill.color }} />
            : <span style={{ width: 16, height: 16, fontSize: 11, fontWeight: 700, color: skill.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{skill.letter || skill.name[0]}</span>
          }
          {skill.name}
        </span>
      );
    }

    function SkillsSection() {
      return (
        <section id="skills" className="relative w-full skill-grid-bg py-24 px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <p className="text-xs font-mono uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--accent-cyan)' }}>
                What I work with
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text">
                Skills & Technologies
              </h2>
              <div className="mx-auto mt-4 h-px w-24"
                   style={{ background: 'linear-gradient(to right, transparent, var(--accent-cyan), transparent)' }} />
            </div>

            <div className="space-y-8">
              {skillCategories.map(cat => (
                <div key={cat.title} className="category-card animate-fade-in">
                  <h3 className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>{cat.title}</h3>
                  <div className="mt-2 h-[2px] w-16 rounded-full"
                       style={{ background: 'linear-gradient(to right, oklch(0.78 0.15 210), transparent)' }} />
                  <div className="mt-5 flex flex-wrap gap-3">
                    {cat.skills.map(s => <SkillChip key={s.name} skill={s} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ── Certifications ──────────────────────────────────────────────── */
    const certItems = [
      { name: 'Build Your Own Responsive Website', org: 'NxtWave CCBP 4.0 Academy', category: 'course', description: 'Built responsive websites using Bootstrap and Flexbox.', image: 'assets/certificates/responsive.png' },
      { name: 'Build Your Own Static Website', org: 'NxtWave CCBP 4.0 Academy', category: 'course', description: 'Created static websites using HTML, CSS, and Bootstrap.', image: 'assets/certificates/static.png' },
      { name: 'Introduction to Databases', org: 'NxtWave CCBP 4.0 Academy', category: 'course', description: 'Learned SQL fundamentals and relational database concepts.', image: 'assets/certificates/databases.png' },
      { name: 'Python for Data Science', org: 'NPTEL — IIT Madras', category: 'course', description: 'Elite certification (4-week course) by NPTEL, funded by MoE, Govt. of India.', image: 'assets/certificates/nptel.png' },
      { name: 'Generative AI Mastery Workshop — GenAI Buildathon', org: 'NxtWave × OpenAI Academy', category: 'certification', description: 'Participated in India\'s Biggest GenAI Buildathon and completed the Generative AI Mastery Workshop as part of the OpenAI Academy learning community by NxtWave.', images: ['assets/certificates/buildathon-participation.jpg', 'assets/certificates/buildathon-project.png'] },
      { name: 'Inside the Startup Ecosystem — Podcast', org: 'NxtWave CCBP 4.0 Academy', category: 'certification', description: 'Podcast by Ms. Vinutha Naga Rallapalli (Principal Consultant at WE Hub, Founder & CEO at The Funding Office) on startup ideation, validation, funding, Angel & VC investors, and the key risks founders navigate.', image: 'assets/certificates/startup-ecosystem.png' },
      { name: 'Brain Fitness for High Achievers — Masterclass', org: 'NxtWave CCBP 4.0 Academy', category: 'certification', description: 'Masterclass by Dr. Patrick Porter, Ph.D., Founder at BrainTap, on brain fitness techniques for high achievers.', image: 'assets/certificates/brain-fitness.jpg' },
      { name: 'Your Next Big Career Opportunity: Autonomous Vehicles', org: 'NxtWave CCBP 4.0 Academy', category: 'certification', description: 'Masterclass by Mr. Shinpei Kato, Founder & CEO of Tier IV, on emerging career opportunities in autonomous vehicles.', image: 'assets/certificates/autonomous-vehicles.jpg' },
      { name: 'Think Like a CEO: Even Before You Graduate', org: 'NxtWave CCBP 4.0 Academy', category: 'certification', description: 'Masterclass by Mr. Kishore Indukuri, Founder & CEO of Sid\'s Farm, on developing a CEO mindset early in your career.', image: 'assets/certificates/think-like-ceo.png' },
      { name: 'What Google Looks for in Future Engineers — Podcast', org: 'NxtWave CCBP 4.0 Academy', category: 'certification', description: 'Podcast by Mr. Mrinal Ahlawat, Staff Engineer at Google, on product thinking and real-world skills for top tech roles.', image: 'assets/certificates/google-future-engineers.jpg' },
      { name: 'LLMs & Agentic AI 101: AI Tech You Must Know', org: 'NxtWave CCBP 4.0 Academy', category: 'certification', description: 'Masterclass by Ms. Drishti Wali, Software Engineer at Ion Health, on LLMs, NLP, Agentic AI and the future skills needed to thrive in an AI-first world.', image: 'assets/certificates/llms-agentic-ai.jpg' },
      { name: 'AI Workflows & Automation Workshop', org: 'NxtWave CCBP 4.0 Academy', category: 'workshop', description: 'Attended the AI Workflows & Automation Workshop using Make.com and completed the hands-on project — building end-to-end automation workflows with AI agents, MCP servers and APIs.', images: ['assets/certificates/ai-participation.jpg', 'assets/certificates/ai-project.jpg'] },
      { name: 'Model Context Protocol Mega Workshop', org: 'NxtWave CCBP 4.0 Academy', category: 'workshop', description: 'Attended the MCP Mega Workshop and completed the hands-on project — integrating AI with Cursor IDE, Pipedream, and MCP Servers to build prompt-driven AI workflows.', images: ['assets/certificates/mcp-participation.jpg', 'assets/certificates/mcp-project.jpg'] },
    ];

    const certTabs = [
      { id: 'all', label: 'All' },
      { id: 'certification', label: 'Podcasts' },
      { id: 'course', label: 'Courses' },
      { id: 'workshop', label: 'Workshops' },
    ];

    const categoryMeta = {
      certification: { title: 'Certificates', icon: 'Award' },
      course: { title: 'Courses', icon: 'GraduationCap' },
      workshop: { title: 'Workshops', icon: 'BookOpen' },
    };

    function CertCard({ item, onOpen }) {
      const thumb = item.image ?? item.images?.[0];
      const extraCount = item.images ? item.images.length - 1 : 0;
      const meta = categoryMeta[item.category];
      return (
        <div className="group relative rounded-2xl p-6 backdrop-blur-xl transition-all overflow-hidden"
             style={{ background: 'color-mix(in oklab, var(--card) 80%, transparent)', border: '1px solid var(--border)' }}
             onMouseEnter={e => { e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--accent-cyan) 60%, transparent)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 50px -20px var(--accent-cyan)'; }}
             onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl opacity-40 transition-opacity"
               style={{ background: 'color-mix(in oklab, var(--accent-purple) 30%, transparent)' }} />
          <div className="relative">
            {thumb && (
              <button onClick={() => onOpen(item)} aria-label={`View ${item.name} certificate`}
                      className="relative block w-full mb-4 overflow-hidden rounded-lg border bg-white"
                      style={{ borderColor: 'var(--border)', cursor: 'pointer' }}>
                <img src={thumb} alt={`${item.name} certificate`} loading="lazy"
                     className="w-full h-40 object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                {extraCount > 0 && (
                  <span className="absolute top-2 right-2 rounded-full text-white text-xs font-medium px-2.5 py-1 backdrop-blur-sm"
                        style={{ background: 'rgba(0,0,0,0.7)' }}>
                    +{extraCount} more
                  </span>
                )}
              </button>
            )}
            <div className="grid place-items-center h-12 w-12 rounded-xl border"
                 style={{ background: 'linear-gradient(135deg, color-mix(in oklab, var(--accent-cyan) 22%, transparent), color-mix(in oklab, var(--accent-purple) 22%, transparent))', borderColor: 'color-mix(in oklab, var(--foreground) 10%, transparent)' }}>
              <Icon name={meta.icon} style={{ width: 24, height: 24, color: 'var(--accent-cyan)' }} />
            </div>
            <h3 className="mt-4 font-semibold leading-snug" style={{ color: 'var(--foreground)' }}>{item.name}</h3>
            <p className="mt-1 text-sm" style={{ color: 'color-mix(in oklab, var(--foreground) 60%, transparent)' }}>{item.org}</p>
            {item.description && <p className="mt-4 text-sm leading-relaxed" style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}>{item.description}</p>}
            {thumb && (
              <button onClick={() => onOpen(item)}
                      className="mt-4 text-xs font-medium hover:underline"
                      style={{ color: 'var(--accent-cyan)', cursor: 'pointer', background: 'none', border: 'none' }}>
                {item.images && item.images.length > 1
                  ? `Click to view all ${item.images.length} certificates →`
                  : 'Click to view full certificate →'}
              </button>
            )}
          </div>
        </div>
      );
    }

    function Certifications() {
      const [active, setActive] = useState('all');
      const [lightbox, setLightbox] = useState(null);

      useEffect(() => {
        if (!lightbox) return;
        const onKey = e => { if (e.key === 'Escape') setLightbox(null); };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
      }, [lightbox]);

      const groups = active === 'all' ? ['certification', 'course', 'workshop'] : [active];

      return (
        <section id="certifications" className="relative py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="Achievements" title="Certificates" />

            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {certTabs.map(t => {
                const isActive = active === t.id;
                return (
                  <button key={t.id} onClick={() => setActive(t.id)}
                          className="px-5 py-2 rounded-full text-sm font-medium border backdrop-blur-md transition-all"
                          style={isActive ? {
                            borderColor: 'color-mix(in oklab, var(--accent-cyan) 70%, transparent)',
                            color: 'var(--foreground)',
                            boxShadow: '0 0 20px -4px var(--accent-cyan)',
                            background: 'linear-gradient(135deg, color-mix(in oklab, var(--accent-cyan) 18%, transparent), color-mix(in oklab, var(--accent-purple) 18%, transparent))',
                          } : {
                            borderColor: 'var(--border)',
                            background: 'color-mix(in oklab, var(--foreground) 4%, transparent)',
                            color: 'color-mix(in oklab, var(--foreground) 70%, transparent)',
                          }}>
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-14 space-y-14">
              {groups.map(cat => {
                const list = certItems.filter(i => i.category === cat);
                if (!list.length) return null;
                return (
                  <div key={cat}>
                    <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--foreground)' }}>{categoryMeta[cat].title}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {list.map(item => <CertCard key={item.name} item={item} onOpen={setLightbox} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {lightbox && (
            <div className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-8"
                 style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
                 onClick={() => setLightbox(null)}>
              <button onClick={() => setLightbox(null)}
                      className="absolute top-4 right-4 grid place-items-center h-11 w-11 rounded-full text-white transition-colors"
                      style={{ background: 'rgba(255,255,255,0.1)', cursor: 'pointer', border: 'none' }}
                      aria-label="Close">
                <Icon name="X" style={{ width: 24, height: 24, color: 'white' }} />
              </button>
              <div className="relative max-w-6xl w-full max-h-full overflow-y-auto"
                   onClick={e => e.stopPropagation()}>
                {(lightbox.images ?? (lightbox.image ? [lightbox.image] : [])).map((src, i) => (
                  <img key={src} src={src} alt={`${lightbox.name} certificate ${i + 1}`}
                       className="w-full h-auto rounded-xl shadow-2xl bg-white mb-4 last:mb-0"
                       style={{ maxHeight: '85vh', objectFit: 'contain' }} />
                ))}
                <div className="mt-3 text-center text-white">
                  <p className="font-semibold">{lightbox.name}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{lightbox.org}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      );
    }

    /* ── Contact ─────────────────────────────────────────────────────── */
    const contactItems = [
      { icon: 'Linkedin', label: 'LinkedIn', value: 'linkedin.com/in/gayathrithanigaimani', href: 'https://linkedin.com/in/gayathrithanigaimani', external: true },
      { icon: 'Github', label: 'GitHub', value: 'github.com/Gayathrit-06', href: 'https://github.com/Gayathrit-06', external: true },
      { icon: 'Code', label: 'LeetCode', value: 'leetcode.com/u/Gayathrit08', href: 'https://leetcode.com/u/Gayathrit08', external: true },
      { icon: 'Mail', label: 'Email', value: 'gayathrit2006@gmail.com', href: 'mailto:gayathrit2006@gmail.com', external: false },
      { icon: 'MapPin', label: 'Location', value: 'Chennai, Tamil Nadu, India', href: '#', external: false },
    ];

    function Contact() {
      return (
        <section id="contact" className="relative py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <SectionTitle eyebrow="Let's connect" title="Get in Touch" />

            <p className="mt-8 max-w-2xl mx-auto text-center leading-relaxed"
               style={{ color: 'color-mix(in oklab, var(--foreground) 70%, transparent)' }}>
              Feel free to reach out via email or connect on platforms below!
            </p>

            <div className="mt-12 grid sm:grid-cols-3 gap-5">
              {contactItems.map(({ icon, label, value, href, external }) => (
                <a key={label} href={href}
                   target={external ? '_blank' : undefined}
                   rel={external ? 'noopener noreferrer' : undefined}
                   className="group flex flex-col items-center text-center gap-3 rounded-2xl p-7 backdrop-blur-xl transition-all"
                   style={{ background: 'color-mix(in oklab, var(--card) 80%, transparent)', border: '1px solid var(--border)' }}
                   onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--accent-cyan) 60%, transparent)'; e.currentTarget.style.boxShadow = '0 20px 50px -20px var(--accent-cyan)'; }}
                   onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = ''; }}>
                  <div className="grid place-items-center h-14 w-14 rounded-xl border transition-transform group-hover:scale-110"
                       style={{ background: 'linear-gradient(135deg, color-mix(in oklab, var(--accent-cyan) 22%, transparent), color-mix(in oklab, var(--accent-purple) 22%, transparent))', borderColor: 'color-mix(in oklab, var(--foreground) 10%, transparent)' }}>
                    <Icon name={icon} style={{ width: 24, height: 24, color: 'var(--accent-cyan)' }} />
                  </div>
                  <p className="text-xs font-mono uppercase tracking-[0.2em]"
                     style={{ color: 'color-mix(in oklab, var(--foreground) 55%, transparent)' }}>{label}</p>
                  <p className="font-medium break-all" style={{ color: 'var(--foreground)' }}>{value}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ── Footer ──────────────────────────────────────────────────────── */
    function Footer() {
      return (
        <footer className="relative mt-auto backdrop-blur-xl" style={{ background: 'color-mix(in oklab, var(--background) 60%, transparent)' }}>
          <div className="h-px w-full"
               style={{ background: 'linear-gradient(to right, transparent, oklch(0.78 0.15 210), transparent)' }} />
          <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-center text-center">
            <p className="text-sm" style={{ color: 'var(--foreground)' }}>
              © 2026{' '}
              <span className="font-semibold" style={{ color: 'var(--accent-cyan)' }}>Gayathri Thanigaimani</span>
              . All rights reserved.
            </p>
          </div>
        </footer>
      );
    }

    /* ── App / Router ────────────────────────────────────────────────── */
    function PageWrapper({ children }) {
      return (
        <div className="flex min-h-screen flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
          <Navbar />
          <main className="flex-1 pt-0">{children}</main>
          <Footer />
        </div>
      );
    }

    function App() {
      const route = useRoute();
      let Page;
      if (route === '/' || route === '') Page = <Hero />;
      else if (route === '/about') Page = <About />;
      else if (route === '/projects') Page = <Projects />;
      else if (route === '/skills') Page = <SkillsSection />;
      else if (route === '/certifications') Page = <Certifications />;
      else if (route === '/contact') Page = <Contact />;
      else Page = (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-7xl font-bold" style={{ color: 'var(--foreground)' }}>404</h1>
            <h2 className="mt-4 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Page not found</h2>
            <a href="#/" className="mt-6 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
               style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              Go home
            </a>
          </div>
        </div>
      );
      return <PageWrapper>{Page}</PageWrapper>;
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
