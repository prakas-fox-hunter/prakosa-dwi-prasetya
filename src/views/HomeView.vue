<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import PrakosaLogo from '@/components/PrakosaLogo.vue'

type Theme = 'light' | 'dark'
type ProjectCategory = 'backend' | 'data' | 'delivery'

type Project = {
  id: string
  name: string
  code: string
  context: string
  detail: string
  categories: ProjectCategory[]
  technologies: string[]
  contributions: string[]
}

const email = 'prakosadwiprasetya@gmail.com'
const linkedinUrl = 'https://www.linkedin.com/in/prakosa-dwi-prasetya/'

const navItems = [
  { id: 'about', label: 'Tentang' },
  { id: 'expertise', label: 'Keahlian' },
  { id: 'projects', label: 'Proyek' },
  { id: 'experience', label: 'Perjalanan' },
]

const tools: { name: string; slug: string; color: string; mark: string; customLogo?: boolean }[] = [
  { name: 'Docker', slug: 'docker', color: '2496ED', mark: 'D' },
  { name: 'GitHub', slug: 'github', color: '181717', mark: 'GH' },
  { name: 'Ubuntu', slug: 'ubuntu', color: 'E95420', mark: 'U' },
  { name: 'Java / Spring Boot', slug: 'springboot', color: '6DB33F', mark: 'SB' },
  { name: 'Vue.js', slug: 'vuedotjs', color: '4FC08D', mark: 'V' },
  { name: 'Dart', slug: 'dart', color: '0175C2', mark: 'D' },
  { name: 'Flutter', slug: 'flutter', color: '02569B', mark: 'F' },
  { name: 'WinSCP', slug: 'winscp', color: '73BA25', mark: 'W' },
  { name: 'SSH Remote', slug: 'openssh', color: 'EE7A00', mark: 'SSH' },
  { name: 'Hyper-V', slug: '', color: '0078D4', mark: 'HV' },
  { name: 'GitLab', slug: 'gitlab', color: 'FC6D26', mark: 'GL' },
]

const brokenToolLogos = ref<string[]>([])

function markToolLogoBroken(toolName: string) {
  brokenToolLogos.value = [...brokenToolLogos.value, toolName]
}

const projects: Project[] = [
  {
    id: 'hse',
    name: 'HSE',
    code: 'HS',
    context: 'Aplikasi bisnis',
    detail: 'Menerjemahkan kebutuhan menjadi fitur, menghubungkan berbagai fungsi, dan membantu mengatasi kendala aplikasi.',
    categories: ['backend', 'delivery'],
    technologies: ['Java', 'REST API', 'Integration'],
    contributions: [
      'Mengembangkan dan merawat fitur aplikasi.',
      'Mengubah kebutuhan bisnis menjadi solusi teknis.',
      'Mencari penyebab dan memperbaiki kendala aplikasi.',
    ],
  },
  {
    id: 'sdcos',
    name: 'SDCOS',
    code: 'SD',
    context: 'Backend dan integrasi layanan',
    detail: 'Membangun fitur backend, menghubungkan layanan, mengolah data, dan mengatasi kendala aplikasi.',
    categories: ['backend', 'data'],
    technologies: ['Java', 'Database', 'API'],
    contributions: [
      'Membantu mengembangkan fitur aplikasi.',
      'Menghubungkan layanan dan data.',
      'Mencari penyebab masalah dan merawat aplikasi.',
    ],
  },
  {
    id: 'klick-indomaret',
    name: 'Klick Indomaret',
    code: 'KI',
    context: 'Platform pemesanan makanan',
    detail: 'Membangun layanan Spring Boot dengan PostgreSQL dan Oracle, lalu menguji API menggunakan Postman.',
    categories: ['backend', 'data'],
    technologies: ['Spring Boot', 'PostgreSQL', 'Oracle', 'Postman'],
    contributions: [
      'Mengembangkan REST API menggunakan Spring Boot.',
      'Menyiapkan tabel, view, function, dan cursor di database.',
      'Menguji API dengan Postman.',
    ],
  },
  {
    id: 'ap2t',
    name: 'AP2T',
    code: 'A2',
    context: 'Platform layanan skala besar',
    detail: 'Mengembangkan REST API dan tugas terjadwal dengan Spring Boot dan Quarkus, mengelola database, serta menyiapkan rilis lewat GitLab CI/CD.',
    categories: ['backend', 'data', 'delivery'],
    technologies: ['Spring Boot', 'Quarkus', 'GitLab CI/CD', 'Oracle'],
    contributions: [
      'Membangun REST API dan tugas terjadwal.',
      'Mengelola database PostgreSQL dan Oracle.',
      'Merilis aplikasi lewat GitLab CI/CD.',
    ],
  },
  {
    id: 'newito',
    name: 'NEWITO',
    code: 'NW',
    context: 'Aplikasi bisnis',
    detail: 'Membangun API, mengatur tugas otomatis, menyiapkan database, serta membantu menguji dan merilis aplikasi.',
    categories: ['backend', 'data', 'delivery'],
    technologies: ['Java', 'Scheduler', 'PostgreSQL', 'GitLab'],
    contributions: [
      'Membangun REST API dan tugas terjadwal.',
      'Menyiapkan objek database di PostgreSQL dan Oracle.',
      'Menguji dan merilis aplikasi.',
    ],
  },
  {
    id: 'emis-kemenag',
    name: 'EMIS Kemenag',
    code: 'EM',
    context: 'Sistem informasi publik',
    detail: 'Mengembangkan aplikasi informasi, menghubungkan layanan dan data, serta membantu menyelesaikan kendala teknis.',
    categories: ['backend', 'data'],
    technologies: ['Java', 'Integration', 'Database'],
    contributions: [
      'Membantu mengembangkan aplikasi.',
      'Mengelola data dan menghubungkan layanan.',
      'Mencari penyebab kendala teknis.',
    ],
  },
]

const experiences = [
  {
    period: 'Maret 2026 - Agustus 2026',
    company: 'TOGI Indonesia',
    role: 'Java Engineer (penempatan di DCI Indonesia Tbk)',
    summary: 'Mengembangkan dan mengintegrasikan aplikasi untuk operasional data center.',
  },
  {
    period: 'Oktober 2025 - Februari 2026',
    company: 'PT FAN 360',
    role: 'Java Engineer (penempatan di Indomarco)',
    summary: 'Membangun REST API dengan Spring Boot, mengelola PostgreSQL dan Oracle, serta menguji layanan pemesanan.',
  },
  {
    period: 'Oktober 2023 - Juli 2025',
    company: 'Mitra Utama Solusi Teknologi',
    role: 'Java Engineer',
    summary: 'Mengembangkan API, tugas terjadwal, dan CI/CD, serta mendukung pengembangan antarmuka untuk lima proyek.',
  },
  {
    period: 'Oktober 2022 - Oktober 2023',
    company: 'Mega Giga Solusindo',
    role: 'Java Engineer',
    summary: 'Membangun API dan tugas terjadwal, mengelola database, serta menguji dan merilis aplikasi di tiga proyek.',
  },
  {
    period: 'Oktober 2021 - April 2022',
    company: 'Juke Solusi Teknologi',
    role: 'Middleware & Database Engineer',
    summary: 'Mengembangkan REST API dengan TIBCO, menggunakan Docker dan OpenShift, serta memantau layanan di GCP.',
  },
]

const filters: { value: 'all' | ProjectCategory; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'backend', label: 'Backend' },
  { value: 'data', label: 'Data' },
  { value: 'delivery', label: 'Rilis' },
]

const activeFilter = ref<'all' | ProjectCategory>('all')
const activeProject = ref<Project | null>(null)
const activeSection = ref('home')
const isMenuOpen = ref(false)
const theme = ref<Theme>('light')
const copyLabel = ref('Salin alamat email')
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

  const cards = [...viewport.querySelectorAll<HTMLElement>('.project-card')]
  if (cards.length === 0) return

  const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
  let currentIndex = 0
  let nearestDistance = Number.POSITIVE_INFINITY

  cards.forEach((card, index) => {
    const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2
    const distance = Math.abs(cardCenter - viewportCenter)

    if (distance < nearestDistance) {
      currentIndex = index
      nearestDistance = distance
    }
  })

  const nextIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + direction))
  const targetCard = cards[nextIndex]
  if (!targetCard) return

  const targetCenter = targetCard.getBoundingClientRect().left + targetCard.offsetWidth / 2

  viewport.scrollBy({ left: targetCenter - viewportCenter, behavior: 'smooth' })
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
    copyLabel.value = 'Salin alamat email'
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
          <PrakosaLogo class="brand-logo" />
          <span class="brand-copy">
            <strong>Prakosa Dwi Prasetya</strong>
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
          <a class="button button-small button-dark desktop-cta" href="#contact">Hubungi saya</a>
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
            <h1>Software Engineer</h1>
            <p class="hero-lead">
              Saya Prakosa, Java Engineer dari Bekasi. Saya membangun API, menghubungkan data, dan
              menyiapkan aplikasi untuk dirilis.
            </p>

            <div class="hero-actions">
              <a class="button button-primary" href="#projects"
                >Lihat proyek saya <span aria-hidden="true">-&gt;</span></a
              >
              <a class="text-link" href="#experience"
                >Kenali perjalanan saya <span aria-hidden="true">&darr;</span></a
              >
            </div>
          </div>

          <div class="hero-visual" data-reveal>
            <div class="system-map" role="group" aria-labelledby="system-map-title">
              <div class="system-map-header">
                <span class="map-kicker"><i></i> ALUR KERJA</span>
                <span class="map-index">01 / 03</span>
              </div>

              <div class="system-map-heading">
                <p>PENGEMBANGAN JAVA</p>
                <h2 id="system-map-title">Dari kebutuhan<br /><span>sampai siap rilis.</span></h2>
                <span class="map-caption">Membangun layanan yang mudah digunakan dan dirawat.</span>
              </div>

              <div class="system-flow" role="list" aria-label="Alur dari layanan API hingga deployment">
                <div class="system-node" role="listitem">
                  <span class="node-icon">API</span>
                  <div class="node-copy">
                    <span class="node-label">01 / LAYANAN</span>
                    <strong>Layanan API</strong>
                    <small>Spring Boot / Quarkus</small>
                  </div>
                  <span class="node-status" aria-hidden="true"></span>
                </div>
                <span class="flow-connector" aria-hidden="true"><i></i></span>
                <div class="system-node" role="listitem">
                  <span class="node-icon node-icon-data">DB</span>
                  <div class="node-copy">
                    <span class="node-label">02 / DATA</span>
                    <strong>Penyimpanan data</strong>
                    <small>PostgreSQL / Oracle</small>
                  </div>
                  <span class="node-status" aria-hidden="true"></span>
                </div>
                <span class="flow-connector" aria-hidden="true"><i></i></span>
                <div class="system-node" role="listitem">
                  <span class="node-icon node-icon-delivery">CI</span>
                  <div class="node-copy">
                    <span class="node-label">03 / RILIS</span>
                    <strong>Proses rilis aplikasi</strong>
                    <small>GitLab CI/CD / Docker</small>
                  </div>
                  <span class="node-status" aria-hidden="true"></span>
                </div>
              </div>

              <div class="system-map-footer">
                <span><i></i> BEKASI, INDONESIA</span>
                <span>BACKEND <b>/</b> DATA <b>/</b> RILIS</span>
              </div>
            </div>
          </div>

          <div class="hero-proof" aria-label="Ringkasan pengalaman">
            <div><strong>4+</strong><span>Tahun pengalaman</span></div>
            <div><strong>8</strong><span>Proyek utama</span></div>
            <div><strong>5</strong><span>Perusahaan teknologi</span></div>
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
            <h2>Bersedia melayani Anda.</h2>
          </div>

          <div class="about-copy" data-reveal>
            <p class="about-lead">
              Saya membangun layanan yang terstruktur, mudah dipahami, dan siap dirilis.
            </p>
            <div class="about-columns">
              <p>
                Saya memakai Spring Boot, Quarkus, dan TIBCO untuk membangun API; PostgreSQL dan
                Oracle untuk mengelola data.
              </p>
              <p>
                Untuk menguji dan merilis aplikasi, saya menggunakan Postman, GitLab CI/CD, Docker,
                dan OpenShift.
              </p>
            </div>
            <a class="inline-link" href="#contact"
              >Ceritakan kebutuhan Anda <span aria-hidden="true">-&gt;</span></a
            >
          </div>
        </div>
      </section>

      <section id="expertise" class="section-pad expertise-section">
        <div class="shell">
          <div class="section-heading" data-reveal>
            <div>
              <p class="eyebrow">02 / Keahlian</p>
              <h2>Teknologi dan tools yang saya gunakan.</h2>
            </div>
          </div>

          <ul class="tools-list" data-reveal aria-label="Teknologi dan tools yang saya gunakan">
            <li v-for="tool in tools" :key="tool.name">
              <span class="tool-logo" :style="{ '--tool-color': `#${tool.color}` }">
                <PrakosaLogo v-if="tool.customLogo" class="tool-custom-logo" />
                <img
                  v-else-if="tool.slug && !brokenToolLogos.includes(tool.name)"
                  :src="`https://cdn.simpleicons.org/${tool.slug}/${tool.color}`"
                  :alt="`Logo ${tool.name}`"
                  loading="lazy"
                  @error="markToolLogoBroken(tool.name)"
                />
                <span v-else class="tool-logo-fallback" aria-hidden="true">{{ tool.mark }}</span>
              </span>
              <span class="tool-name">{{ tool.name }}</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="projects" class="section-pad projects-section">
        <div class="shell">
          <div class="section-heading projects-heading" data-reveal>
            <div>
              <p class="eyebrow">03 / Proyek</p>
              <h2>Project</h2>
            </div>
            <p>Geser untuk melihat proyek lain, atau gunakan tombol panah.</p>
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
            <p><span></span> Geser untuk melihat proyek lain</p>
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
              >
                <div class="project-card-copy">
                  <div class="project-context">
                    <span>{{ project.context }}</span
                    ><span>{{ project.code }}</span>
                  </div>
                  <h3>{{ project.name }}</h3>
                  <p>{{ project.detail }}</p>
                  <ul>
                    <li v-for="technology in project.technologies.slice(0, 3)" :key="technology">
                      {{ technology }}
                    </li>
                  </ul>
                  <button
                    type="button"
                    class="project-detail-button"
                    :aria-label="`Lihat detail proyek ${project.name}`"
                    @click="openProject(project)"
                  >
                    <span>Lihat detail</span><span aria-hidden="true">&nearr;</span>
                  </button>
                </div>
              </article>
            </TransitionGroup>
          </div>

          <p class="more-projects" data-reveal>
            Saya juga pernah terlibat dalam proyek <strong>IWOOD, AP1, REC, SEMAR, SAKTI,</strong>
            dan <strong>EV2GO</strong>.
          </p>
        </div>
      </section>

      <section id="experience" class="section-pad experience-section">
        <div class="shell experience-layout">
          <div class="experience-sticky" data-reveal>
            <p class="eyebrow">04 / Perjalanan</p>
            <h2>Perjalanan karier saya.</h2>
            <p>Saya mengembangkan backend dan middleware, mengelola database, serta membantu merilis aplikasi.</p>

            <div class="education-card">
              <small>Pendidikan</small>
              <strong>S1 Teknik Informatika</strong>
                <span>Universitas YARSI, IPK 3,47</span>
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
            <p>Ada kebutuhan Java, integrasi, atau database? Ceritakan kepada saya.</p>

            <div class="contact-links">
              <a :href="`mailto:${email}`"
                ><small>Email</small><strong>{{ email }}</strong></a
              >
              <a :href="linkedinUrl" target="_blank" rel="noopener noreferrer"
                ><small>LinkedIn</small><strong>/in/prakosa-dwi-prasetya &nearr;</strong></a
              >
              <button type="button" @click="copyEmail">
                <small>Kontak cepat</small><strong>{{ copyLabel }}</strong>
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
                placeholder="Nama Anda"
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
                placeholder="Tuliskan pesan atau kebutuhan Anda."
                required
              ></textarea>
            </label>
            <button class="button button-primary form-submit" type="submit">
              Lanjutkan lewat email <span aria-hidden="true">-&gt;</span>
            </button>
            <small>Form ini akan membuka aplikasi email Anda. Pesan tidak dikirim otomatis.</small>
          </form>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="shell footer-inner">
        <p>&copy; {{ currentYear }} Prakosa Dwi Prasetya</p>
        <p>Website ini dibuat dengan Vue.</p>
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
          <p class="eyebrow">Tentang proyek</p>
          <h2 :id="`modal-${activeProject.id}`">{{ activeProject.name }}</h2>
          <p class="modal-context">{{ activeProject.context }}</p>
          <p class="modal-description">{{ activeProject.detail }}</p>
          <h3>Yang saya kerjakan</h3>
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
            >Ceritakan proyek serupa <span aria-hidden="true">-&gt;</span></a
          >
        </section>
      </div>
    </Transition>
  </div>
</template>
