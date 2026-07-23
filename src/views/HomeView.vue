<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

type Theme = 'light' | 'dark'
type ProjectCategory = 'backend' | 'data' | 'delivery'

type Project = {
  id: string
  name: string
  code: string
  context: string
  summary: string
  detail: string
  categories: ProjectCategory[]
  technologies: string[]
  contributions: string[]
  tone: string
}

const email = 'prakosadwiprasetya@gmail.com'
const linkedinUrl = 'https://www.linkedin.com/in/prakosa-dwi-prasetya/'

const navItems = [
  { id: 'about', label: 'Tentang' },
  { id: 'expertise', label: 'Keahlian' },
  { id: 'projects', label: 'Proyek' },
  { id: 'experience', label: 'Perjalanan' },
]

const capabilities = [
  {
    number: '01',
    title: 'Backend systems',
    description: 'REST API dan scheduler yang mudah diuji dan dipelihara.',
    tags: ['Java', 'Spring Boot', 'Quarkus', 'REST API'],
  },
  {
    number: '02',
    title: 'Data engineering',
    description: 'Table, view, function, dan cursor untuk aplikasi bisnis.',
    tags: ['PostgreSQL', 'Oracle', 'SQL', 'Data flow'],
  },
  {
    number: '03',
    title: 'Delivery pipeline',
    description: 'Source code, CI/CD, container, dan deployment aplikasi.',
    tags: ['GitLab CI/CD', 'Docker', 'OpenShift', 'Git'],
  },
  {
    number: '04',
    title: 'Integration support',
    description: 'Pengujian endpoint dan troubleshooting alur integrasi.',
    tags: ['Postman', 'Vue.js', 'GWT', 'TIBCO'],
  },
]

const projects: Project[] = [
  {
    id: 'hse',
    name: 'HSE',
    code: 'HS',
    context: 'Enterprise application',
    summary: 'Pengembangan dan pemeliharaan aplikasi bisnis.',
    detail: 'Implementasi kebutuhan, integrasi fungsi, dan analisis kendala aplikasi enterprise.',
    categories: ['backend', 'delivery'],
    technologies: ['Java', 'REST API', 'Integration'],
    contributions: [
      'Mengembangkan dan memelihara fungsi aplikasi.',
      'Menerjemahkan kebutuhan bisnis menjadi solusi teknis.',
      'Menganalisis serta menyelesaikan kendala aplikasi.',
    ],
    tone: 'cyan',
  },
  {
    id: 'sdcos',
    name: 'SDCOS',
    code: 'SD',
    context: 'Backend & integration',
    summary: 'Backend, integrasi layanan, dan pengolahan data.',
    detail: 'Pengembangan fitur, integrasi layanan, pengolahan data, dan troubleshooting.',
    categories: ['backend', 'data'],
    technologies: ['Java', 'Database', 'API'],
    contributions: [
      'Mendukung pengembangan fitur aplikasi.',
      'Berpartisipasi dalam integrasi layanan dan data.',
      'Mendukung troubleshooting dan pemeliharaan.',
    ],
    tone: 'blue',
  },
  {
    id: 'klick-indomaret',
    name: 'Klick Indomaret',
    code: 'KI',
    context: 'Food ordering platform',
    summary: 'REST API untuk klik-order-food dan klik-order-view.',
    detail: 'Layanan Spring Boot dengan PostgreSQL, Oracle, dan pengujian melalui Postman.',
    categories: ['backend', 'data'],
    technologies: ['Spring Boot', 'PostgreSQL', 'Oracle', 'Postman'],
    contributions: [
      'Mengembangkan REST API menggunakan Spring Boot.',
      'Membuat table, view, function, dan cursor.',
      'Melakukan pengujian dan validasi API dengan Postman.',
    ],
    tone: 'lime',
  },
  {
    id: 'ap2t',
    name: 'AP2T',
    code: 'A2',
    context: 'Large-scale service platform',
    summary: 'API, scheduler, database, dan delivery enterprise.',
    detail: 'REST API dan scheduler dengan Spring Boot, Quarkus, database, dan GitLab CI/CD.',
    categories: ['backend', 'data', 'delivery'],
    technologies: ['Spring Boot', 'Quarkus', 'GitLab CI/CD', 'Oracle'],
    contributions: [
      'Mengembangkan REST API dan scheduler.',
      'Mengelola PostgreSQL dan Oracle Database.',
      'Menjalankan deployment melalui GitLab CI/CD.',
    ],
    tone: 'violet',
  },
  {
    id: 'newito',
    name: 'NEWITO',
    code: 'NW',
    context: 'Business application',
    summary: 'Backend, scheduler, database, dan CI/CD.',
    detail: 'Endpoint, scheduler, object database, API testing, dan delivery aplikasi.',
    categories: ['backend', 'data', 'delivery'],
    technologies: ['Java', 'Scheduler', 'PostgreSQL', 'GitLab'],
    contributions: [
      'Mengembangkan REST API serta scheduler.',
      'Membuat object database PostgreSQL dan Oracle.',
      'Mendukung pengujian dan deployment aplikasi.',
    ],
    tone: 'orange',
  },
  {
    id: 'emis-kemenag',
    name: 'EMIS Kemenag',
    code: 'EM',
    context: 'Public-sector information system',
    summary: 'Pengembangan dan integrasi sistem informasi.',
    detail: 'Pengembangan aplikasi, integrasi layanan, pengelolaan data, dan analisis kendala.',
    categories: ['backend', 'data'],
    technologies: ['Java', 'Integration', 'Database'],
    contributions: [
      'Mendukung proses pengembangan aplikasi.',
      'Mendukung pengelolaan data dan integrasi layanan.',
      'Menganalisis kendala teknis pada aplikasi.',
    ],
    tone: 'rose',
  },
]

const experiences = [
  {
    period: 'Mar 2026 - Agu 2026',
    company: 'TOGI Indonesia',
    role: 'Java Engineer - penempatan DCI Indonesia Tbk',
    summary: 'Pengembangan, integrasi, dan operasional aplikasi di lingkungan data center.',
  },
  {
    period: 'Okt 2025 - Feb 2026',
    company: 'PT FAN 360',
    role: 'Java Engineer - Indomarco',
    summary: 'REST API Spring Boot, PostgreSQL, Oracle, dan pengujian layanan pemesanan.',
  },
  {
    period: 'Okt 2023 - Jul 2025',
    company: 'Mitra Utama Solusi Teknologi',
    role: 'Java Engineer',
    summary: 'API, scheduler, GitLab CI/CD, serta dukungan UI untuk lima proyek enterprise.',
  },
  {
    period: 'Okt 2022 - Okt 2023',
    company: 'Mega Giga Solusindo',
    role: 'Java Engineer',
    summary: 'REST API, scheduler, database, testing, dan delivery tiga proyek.',
  },
  {
    period: 'Okt 2021 - Apr 2022',
    company: 'Juke Solusi Teknologi',
    role: 'Middleware & Database Engineer',
    summary: 'REST API TIBCO, Docker, OpenShift, dan monitoring layanan GCP.',
  },
]

const filters: { value: 'all' | ProjectCategory; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'backend', label: 'Backend' },
  { value: 'data', label: 'Data' },
  { value: 'delivery', label: 'Delivery' },
]

const activeFilter = ref<'all' | ProjectCategory>('all')
const activeProject = ref<Project | null>(null)
const activeSection = ref('home')
const isMenuOpen = ref(false)
const theme = ref<Theme>('light')
const copyLabel = ref('Salin email')
const projectViewport = ref<HTMLElement | null>(null)
const currentYear = new Date().getFullYear()
const contactForm = reactive({ name: '', subject: '', message: '' })

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects
  return projects.filter((project) =>
    project.categories.includes(activeFilter.value as ProjectCategory),
  )
})

let revealObserver: IntersectionObserver | undefined
let sectionObserver: IntersectionObserver | undefined
let copyTimer: number | undefined

function applyTheme(value: Theme) {
  document.documentElement.dataset.theme = value
  document.documentElement.style.colorScheme = value
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function scrollProjects(direction: 1 | -1) {
  const viewport = projectViewport.value
  if (!viewport) return

  viewport.scrollBy({ left: viewport.clientWidth * 0.78 * direction, behavior: 'smooth' })
}

function updateCardTilt(event: PointerEvent) {
  if (
    event.pointerType === 'touch' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return

  const card = event.currentTarget as HTMLElement
  const bounds = card.getBoundingClientRect()
  const x = (event.clientX - bounds.left) / bounds.width - 0.5
  const y = (event.clientY - bounds.top) / bounds.height - 0.5

  card.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`)
  card.style.setProperty('--tilt-y', `${(x * 11).toFixed(2)}deg`)
}

function resetCardTilt(event: PointerEvent) {
  const card = event.currentTarget as HTMLElement
  card.style.setProperty('--tilt-x', '0deg')
  card.style.setProperty('--tilt-y', '0deg')
}

function openProject(project: Project) {
  activeProject.value = project
  nextTick(() => document.querySelector<HTMLButtonElement>('.modal-close')?.focus())
}

function closeProject() {
  activeProject.value = null
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email)
    copyLabel.value = 'Email tersalin'
  } catch {
    copyLabel.value = email
  }

  window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => {
    copyLabel.value = 'Salin email'
  }, 2400)
}

function sendMessage() {
  const subject = contactForm.subject || 'Diskusi proyek Java'
  const body = [`Halo Prakosa,`, '', contactForm.message, '', `Salam,`, contactForm.name]
    .filter((line) => line !== '')
    .join('\n')

  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeProject()
    isMenuOpen.value = false
  }
}

watch(theme, (value) => {
  applyTheme(value)
  localStorage.setItem('portfolio-theme', value)
})

watch(activeProject, (project) => {
  document.body.classList.toggle('modal-open', Boolean(project))
})

watch(activeFilter, async () => {
  await nextTick()
  projectViewport.value?.scrollTo({ left: 0, behavior: 'smooth' })
})

watch(isMenuOpen, (isOpen) => {
  document.body.classList.toggle('menu-open', isOpen)
})

onMounted(() => {
  const savedTheme = localStorage.getItem('portfolio-theme') as Theme | null
  theme.value =
    savedTheme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  applyTheme(theme.value)

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]')

  if (reducedMotion) {
    revealElements.forEach((element) => element.classList.add('is-visible'))
  } else {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    revealElements.forEach((element) => revealObserver?.observe(element))
  }

  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) activeSection.value = visible.target.id
    },
    { rootMargin: '-25% 0px -60% 0px', threshold: [0.01, 0.25, 0.6] },
  )

  document.querySelectorAll<HTMLElement>('main section[id]').forEach((section) => {
    sectionObserver?.observe(section)
  })

  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  sectionObserver?.disconnect()
  document.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('menu-open', 'modal-open')
  window.clearTimeout(copyTimer)
})
</script>

<template>
  <div class="portfolio-app">
    <a class="skip-link" href="#main">Lewati ke konten utama</a>

    <header class="site-header">
      <div class="shell nav-shell">
        <a class="brand" href="#home" aria-label="Beranda Prakosa Dwi Prasetya">
          <span class="brand-mark">PD</span>
          <span class="brand-copy">
            <strong>Prakosa Dwi</strong>
            <small>Java Engineer</small>
          </span>
        </a>

        <nav :class="['nav-links', { 'is-open': isMenuOpen }]" aria-label="Navigasi utama">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="`#${item.id}`"
            :class="{ active: activeSection === item.id }"
            @click="isMenuOpen = false"
          >
            {{ item.label }}
          </a>
        </nav>

        <div class="nav-actions">
          <button
            class="icon-button"
            type="button"
            :aria-label="theme === 'light' ? 'Aktifkan tema gelap' : 'Aktifkan tema terang'"
            @click="toggleTheme"
          >
            <svg v-if="theme === 'light'" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path
                d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"
              />
            </svg>
          </button>
          <a class="button button-small button-dark desktop-cta" href="#contact">Mari bicara</a>
          <button
            class="icon-button menu-button"
            type="button"
            :aria-expanded="isMenuOpen"
            aria-label="Buka navigasi"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path v-if="!isMenuOpen" d="M4 7h16M4 12h16M4 17h16" />
              <path v-else d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main id="main">
      <section id="home" class="hero section-pad">
        <div class="shell hero-grid">
          <div class="hero-copy" data-reveal>
            <p class="availability"><span></span> Java Engineer dari Bekasi, Indonesia</p>
            <h1>
              Backend Java yang
              <span class="accent-line">andal dan siap berkembang.</span>
            </h1>
            <p class="hero-lead">
              Saya Prakosa. Saya membangun API, integrasi data, dan pipeline deployment untuk
              aplikasi enterprise.
            </p>

            <div class="hero-actions">
              <a class="button button-primary" href="#projects"
                >Lihat proyek <span aria-hidden="true">-&gt;</span></a
              >
              <a class="text-link" href="#experience"
                >Telusuri perjalanan <span aria-hidden="true">&darr;</span></a
              >
            </div>

            <div class="hero-proof" aria-label="Ringkasan pengalaman">
              <div><strong>4+</strong><span>Tahun pengalaman</span></div>
              <div><strong>8</strong><span>Proyek utama</span></div>
              <div><strong>5</strong><span>Perusahaan teknologi</span></div>
            </div>
          </div>

          <div class="hero-visual" data-reveal>
            <div class="profile-illustration">
              <div class="visual-grid" aria-hidden="true"></div>
              <div class="profile-topline"><span>PROFILE / 01</span><span>BEKASI</span></div>
              <div class="profile-monogram" aria-label="Inisial Prakosa Dwi Prasetya">PDP</div>
              <div class="profile-role">
                <span>Java Engineer</span>
                <small>Backend - Data - Delivery</small>
              </div>
              <div class="code-card" aria-label="Teknologi utama">
                <div class="code-card-head">
                  <span></span><span></span><span></span><b>stack.json</b>
                </div>
                <code
                  >{<br />&nbsp; "core": "Spring Boot",<br />&nbsp; "data": ["PostgreSQL",
                  "Oracle"],<br />&nbsp; "ship": "GitLab CI/CD"<br />}</code
                >
              </div>
            </div>
            <div class="visual-badge badge-one"><span>01</span> API Engineering</div>
            <div class="visual-badge badge-two"><span>02</span> Reliable delivery</div>
          </div>
        </div>
      </section>

      <section class="toolbelt" aria-label="Teknologi yang digunakan">
        <div class="shell toolbelt-track">
          <span>Java</span><i></i><span>Spring Boot</span><i></i><span>Quarkus</span><i></i>
          <span>PostgreSQL</span><i></i><span>Oracle</span><i></i><span>GitLab CI/CD</span><i></i>
          <span>Docker</span><i></i><span>OpenShift</span>
        </div>
      </section>

      <section id="about" class="section-pad about-section">
        <div class="shell about-grid">
          <div class="section-intro" data-reveal>
            <p class="eyebrow">01 / Tentang</p>
            <h2>Berpikir dari alur bisnis, membangun sampai production.</h2>
          </div>

          <div class="about-copy" data-reveal>
            <p class="about-lead">
              Saya membangun layanan yang rapi, mudah ditelusuri, dan siap dikirim.
            </p>
            <div class="about-columns">
              <p>Spring Boot, Quarkus, dan TIBCO untuk API; PostgreSQL dan Oracle untuk data.</p>
              <p>GitLab CI/CD, Docker, OpenShift, dan Postman untuk testing hingga delivery.</p>
            </div>
            <a class="inline-link" href="#contact"
              >Diskusikan kebutuhan teknis <span aria-hidden="true">-&gt;</span></a
            >
          </div>
        </div>
      </section>

      <section id="expertise" class="section-pad expertise-section">
        <div class="shell">
          <div class="section-heading" data-reveal>
            <div>
              <p class="eyebrow">02 / Keahlian</p>
              <h2>Dari kode sampai production.</h2>
            </div>
            <p>Empat area kerja utama.</p>
          </div>

          <div class="capability-grid">
            <article
              v-for="capability in capabilities"
              :key="capability.number"
              class="capability-card"
              data-reveal
            >
              <div class="capability-top">
                <span>{{ capability.number }}</span
                ><i></i>
              </div>
              <h3>{{ capability.title }}</h3>
              <p>{{ capability.description }}</p>
              <ul>
                <li v-for="tag in capability.tags" :key="tag">{{ tag }}</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="projects" class="section-pad projects-section">
        <div class="shell">
          <div class="section-heading projects-heading" data-reveal>
            <div>
              <p class="eyebrow">03 / Selected work</p>
              <h2>Proyek pilihan.</h2>
            </div>
            <p>Geser kartu atau gunakan tombol navigasi.</p>
          </div>

          <div class="project-filters" data-reveal aria-label="Filter proyek">
            <button
              v-for="filter in filters"
              :key="filter.value"
              type="button"
              :class="{ active: activeFilter === filter.value }"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
              <span>{{
                filter.value === 'all'
                  ? projects.length
                  : projects.filter((project) =>
                      project.categories.includes(filter.value as ProjectCategory),
                    ).length
              }}</span>
            </button>
          </div>

          <div class="carousel-actions" data-reveal>
            <p><span></span> Drag / scroll</p>
            <div>
              <button type="button" aria-label="Proyek sebelumnya" @click="scrollProjects(-1)">
                &larr;
              </button>
              <button type="button" aria-label="Proyek berikutnya" @click="scrollProjects(1)">
                &rarr;
              </button>
            </div>
          </div>

          <div
            ref="projectViewport"
            class="project-viewport"
            tabindex="0"
            aria-label="Carousel proyek"
          >
            <TransitionGroup name="project-list" tag="div" class="project-track">
              <article
                v-for="project in filteredProjects"
                :key="project.id"
                class="project-card"
                @pointermove="updateCardTilt"
                @pointerleave="resetCardTilt"
              >
                <button
                  type="button"
                  class="project-card-button"
                  :aria-label="`Lihat detail proyek ${project.name}`"
                  @click="openProject(project)"
                >
                  <div :class="['project-art', `tone-${project.tone}`]">
                    <div class="project-browser">
                      <div class="browser-head">
                        <span></span><span></span><span></span><b>/api/{{ project.id }}</b>
                      </div>
                      <div class="browser-body">
                        <div class="browser-sidebar"></div>
                        <div class="browser-content">
                          <i></i><i></i><i></i>
                          <div><span></span><span></span><span></span></div>
                        </div>
                      </div>
                    </div>
                    <strong>{{ project.code }}</strong>
                  </div>
                  <div class="project-card-copy">
                    <div class="project-context">
                      <span>{{ project.context }}</span
                      ><span aria-hidden="true">&nearr;</span>
                    </div>
                    <h3>{{ project.name }}</h3>
                    <p>{{ project.summary }}</p>
                    <ul>
                      <li v-for="technology in project.technologies.slice(0, 3)" :key="technology">
                        {{ technology }}
                      </li>
                    </ul>
                  </div>
                </button>
              </article>
            </TransitionGroup>
          </div>

          <p class="more-projects" data-reveal>
            Pengalaman lain mencakup <strong>IWOOD, AP1, REC, SEMAR, SAKTI,</strong> dan
            <strong>EV2GO</strong>.
          </p>
        </div>
      </section>

      <section id="experience" class="section-pad experience-section">
        <div class="shell experience-layout">
          <div class="experience-sticky" data-reveal>
            <p class="eyebrow">04 / Perjalanan</p>
            <h2>Empat tahun membangun sistem.</h2>
            <p>Backend, middleware, database, dan deployment dalam satu alur kerja.</p>

            <div class="education-card">
              <small>Pendidikan</small>
              <strong>S1 Teknik Informatika</strong>
              <span>Universitas YARSI - IPK 3,47</span>
              <span>2017 - 2021</span>
            </div>
          </div>

          <ol class="experience-list">
            <li v-for="(experience, index) in experiences" :key="experience.company" data-reveal>
              <div class="timeline-marker">
                <span>{{ String(index + 1).padStart(2, '0') }}</span>
              </div>
              <article>
                <p class="experience-period">{{ experience.period }}</p>
                <h3>{{ experience.company }}</h3>
                <p class="experience-role">{{ experience.role }}</p>
                <p class="experience-summary">{{ experience.summary }}</p>
              </article>
            </li>
          </ol>
        </div>
      </section>

      <section id="contact" class="section-pad contact-section">
        <div class="shell contact-panel" data-reveal>
          <div class="contact-copy">
            <p class="eyebrow">05 / Kontak</p>
            <h2>Mari bangun sistem yang lebih baik.</h2>
            <p>Ceritakan kebutuhan Java, integrasi, atau database Anda.</p>

            <div class="contact-links">
              <a :href="`mailto:${email}`"
                ><small>Email</small><strong>{{ email }}</strong></a
              >
              <a :href="linkedinUrl" target="_blank" rel="noopener noreferrer"
                ><small>LinkedIn</small><strong>/in/prakosa-dwi-prasetya &nearr;</strong></a
              >
              <button type="button" @click="copyEmail">
                <small>Quick action</small><strong>{{ copyLabel }}</strong>
              </button>
            </div>
          </div>

          <form class="contact-form" @submit.prevent="sendMessage">
            <label>
              <span>Nama</span>
              <input
                v-model="contactForm.name"
                type="text"
                name="name"
                autocomplete="name"
                placeholder="Nama kamu"
                required
              />
            </label>
            <label>
              <span>Topik</span>
              <input
                v-model="contactForm.subject"
                type="text"
                name="subject"
                placeholder="Contoh: Integrasi REST API"
                required
              />
            </label>
            <label>
              <span>Pesan</span>
              <textarea
                v-model="contactForm.message"
                name="message"
                rows="5"
                placeholder="Ceritakan kebutuhan singkatnya..."
                required
              ></textarea>
            </label>
            <button class="button button-primary form-submit" type="submit">
              Buka di email <span aria-hidden="true">-&gt;</span>
            </button>
            <small>Membuka aplikasi email. Tidak ada data yang disimpan.</small>
          </form>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="shell footer-inner">
        <p>&copy; {{ currentYear }} Prakosa Dwi Prasetya</p>
        <p>Dibangun dengan Vue - dirancang untuk tetap sederhana.</p>
        <a href="#home">Kembali ke atas &uarr;</a>
      </div>
    </footer>

    <Transition name="modal">
      <div
        v-if="activeProject"
        class="modal-backdrop"
        role="presentation"
        @mousedown.self="closeProject"
      >
        <section
          class="project-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`modal-${activeProject.id}`"
        >
          <button
            class="icon-button modal-close"
            type="button"
            aria-label="Tutup detail proyek"
            @click="closeProject"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
          <p class="eyebrow">Project detail</p>
          <h2 :id="`modal-${activeProject.id}`">{{ activeProject.name }}</h2>
          <p class="modal-context">{{ activeProject.context }}</p>
          <p class="modal-description">{{ activeProject.detail }}</p>
          <h3>Kontribusi utama</h3>
          <ul class="contribution-list">
            <li v-for="contribution in activeProject.contributions" :key="contribution">
              {{ contribution }}
            </li>
          </ul>
          <ul class="modal-tags">
            <li v-for="technology in activeProject.technologies" :key="technology">
              {{ technology }}
            </li>
          </ul>
          <a class="button button-dark" href="#contact" @click="closeProject"
            >Diskusikan proyek serupa <span aria-hidden="true">-&gt;</span></a
          >
        </section>
      </div>
    </Transition>
  </div>
</template>
