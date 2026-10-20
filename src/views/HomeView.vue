<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import PrakosaLogo from '@/components/PrakosaLogo.vue'

type Theme = 'light' | 'dark'
type Locale = 'id' | 'en'
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
const phone = '+62 895 1947 6506'
const linkedinUrl = 'https://www.linkedin.com/in/prakosa-dwi-prasetya/'
const cvFilename = 'CV Prakosa Dwi Prasetya English - 4_1.pdf'
const cvUrl = `${import.meta.env.BASE_URL}${encodeURIComponent(cvFilename)}`

const locale = ref<Locale>('id')
const translations = {
  id: {
    pageTitle: 'Prakosa Dwi Prasetya — Java Engineer',
    metaDescription: 'Portfolio Prakosa Dwi Prasetya, Java Engineer dari Bekasi dengan pengalaman Spring Boot, Quarkus, PostgreSQL, Oracle Database, MariaDB, Docker, dan GitLab CI/CD.',
    ogLocale: 'id_ID',
    switchLanguage: 'Ganti bahasa ke English',
    navAria: 'Navigasi utama',
    nav: { about: 'Tentang', expertise: 'Keahlian', projects: 'Proyek', experience: 'Perjalanan' },
    skip: 'Lewati ke konten utama',
    home: 'Beranda Prakosa Dwi Prasetya',
    themeDark: 'Aktifkan tema gelap',
    themeLight: 'Aktifkan tema terang',
    contactMe: 'Hubungi saya',
    downloadCv: 'Unduh CV',
    openNav: 'Buka navigasi',
    closeNav: 'Tutup navigasi',
    availability: 'Java Engineer dari Bekasi, Indonesia',
    heroLead:
      'Saya Prakosa Dwi Prasetya, Java Engineer dari Bekasi. Saya membangun API, menghubungkan data, dan menyiapkan aplikasi untuk dirilis.',
    viewProjects: 'Lihat proyek saya',
    viewJourney: 'Kenali perjalanan saya',
    workflow: 'ALUR KERJA',
    javaDevelopment: 'PENGEMBANGAN JAVA',
    workflowHeading: 'Dari kebutuhan sampai siap rilis.',
    workflowCaption: 'Membangun layanan yang mudah digunakan dan dirawat.',
    workflowAria: 'Alur dari layanan API hingga deployment',
    service: 'LAYANAN',
    data: 'DATA',
    release: 'RILIS',
    apiService: 'Layanan API',
    dataStorage: 'Penyimpanan data',
    appRelease: 'Proses rilis aplikasi',
    city: 'BEKASI, INDONESIA',
    experienceSummaryAria: 'Ringkasan pengalaman',
    yearsExperience: 'Tahun pengalaman',
    keyProjects: 'Proyek utama',
    techCompanies: 'Perusahaan teknologi',
    aboutEyebrow: '01 / Tentang',
    aboutHeading: 'Bersedia Melayani Anda.',
    aboutLead: 'Saya membangun layanan yang terstruktur, mudah dipahami, dan siap dirilis.',
    aboutAvailability: 'Saya dapat bekerja secara kontrak maupun berbasis proyek.',
    aboutData:
      'Saya memakai Spring Boot, Quarkus, dan TIBCO untuk membangun API; PostgreSQL, Oracle Database, dan MariaDB untuk mengelola data.',
    aboutDelivery:
      'Untuk menguji dan merilis aplikasi, saya menggunakan Postman, GitLab CI/CD, Docker, dan OpenShift.',
    tellMe: 'Ceritakan kebutuhan Anda',
    expertiseEyebrow: '04 / Keahlian',
    toolsTitle: 'Tools Development',
    toolsAria: 'Tools development',
    logo: 'Logo',
    projectsEyebrow: '03 / Proyek',
    projectsTitle: 'Project Experience',
    projectHint: 'Pilih proyek untuk melihat detailnya.',
    projectFilters: { all: 'Semua', backend: 'Backend', data: 'Data', delivery: 'Rilis' },
    filterAria: 'Filter proyek',
    previousProject: 'Proyek sebelumnya',
    nextProject: 'Proyek berikutnya',
    projectCarousel: 'Carousel proyek',
    projectDetails: 'Lihat detail proyek {name}',
    seeDetails: 'Lihat detail',
    moreProjectsStart: 'Saya juga pernah terlibat dalam proyek',
    moreProjectsEnd: 'dan',
    experienceEyebrow: '02 / Perjalanan',
    experienceTitle: 'Perjalanan Karier Saya.',
    experienceIntro:
      'Saya mengembangkan backend dan middleware, mengelola database, serta membantu merilis aplikasi.',
    education: 'Pendidikan',
    degree: 'S1 Teknik Informatika',
    university: 'Universitas YARSI, IPK 3,47',
    contactEyebrow: '05 / Kontak',
    contactTitle: 'Punya Ide? Mari Berdiskusi.',
    contactIntro: 'Ada kebutuhan Java, integrasi, atau database? Ceritakan kepada saya.',
    email: 'Email',
    phone: 'Telepon',
    linkedin: 'LinkedIn',
    quickContact: 'Kontak cepat',
    copyEmail: 'Salin alamat email',
    emailCopied: 'Email tersalin',
    name: 'Nama',
    yourName: 'Nama Anda',
    subject: 'Topik',
    subjectPlaceholder: 'Contoh: Integrasi REST API',
    message: 'Pesan',
    messagePlaceholder: 'Tuliskan pesan atau kebutuhan Anda.',
    continueByEmail: 'Lanjutkan lewat email',
    emailFormNote: 'Form ini akan membuka aplikasi email Anda. Pesan tidak dikirim otomatis.',
    emailSubject: 'Diskusi proyek Java',
    emailGreeting: 'Halo Prakosa Dwi Prasetya,',
    emailSignoff: 'Salam,',
    backToTop: 'Kembali ke atas',
    aboutProject: 'Tentang proyek',
    closeProject: 'Tutup detail proyek',
    yourContribution: 'Yang saya kerjakan',
    similarProject: 'Ceritakan proyek serupa',
  },
  en: {
    pageTitle: 'Prakosa Dwi Prasetya — Java Engineer',
    metaDescription: 'Portfolio of Prakosa Dwi Prasetya, a Java Engineer based in Bekasi with experience in Spring Boot, Quarkus, PostgreSQL, Oracle Database, MariaDB, Docker, and GitLab CI/CD.',
    ogLocale: 'en_US',
    switchLanguage: 'Switch language to Indonesian',
    navAria: 'Main navigation',
    nav: { about: 'About', expertise: 'Tools', projects: 'Projects', experience: 'Experience' },
    skip: 'Skip to main content',
    home: 'Prakosa Dwi Prasetya home',
    themeDark: 'Enable dark theme',
    themeLight: 'Enable light theme',
    contactMe: 'Get in touch',
    downloadCv: 'Download CV',
    openNav: 'Open navigation',
    closeNav: 'Close navigation',
    availability: 'Java Engineer based in Bekasi, Indonesia',
    heroLead:
      'I’m Prakosa Dwi Prasetya, a Java Engineer based in Bekasi. I build APIs, connect data, and prepare applications for release.',
    viewProjects: 'Explore my projects',
    viewJourney: 'Explore my experience',
    workflow: 'HOW I WORK',
    javaDevelopment: 'JAVA DEVELOPMENT',
    workflowHeading: 'From requirements to release.',
    workflowCaption: 'Building services that are easy to use and maintain.',
    workflowAria: 'Workflow from API services to deployment',
    service: 'SERVICE',
    data: 'DATA',
    release: 'RELEASE',
    apiService: 'API services',
    dataStorage: 'Data storage',
    appRelease: 'Application release',
    city: 'BEKASI, INDONESIA',
    experienceSummaryAria: 'Experience summary',
    yearsExperience: 'Years of experience',
    keyProjects: 'Key projects',
    techCompanies: 'Technology companies',
    aboutEyebrow: '01 / About',
    aboutHeading: 'Here To Help You Build.',
    aboutLead: 'I build well-structured services that are easy to understand and ready to ship.',
    aboutAvailability: 'I’m available for contract and project-based work.',
    aboutData:
      'I use Spring Boot, Quarkus, and TIBCO to build APIs, and PostgreSQL, Oracle Database, and MariaDB to manage data.',
    aboutDelivery:
      'I test and release applications with Postman, GitLab CI/CD, Docker, and OpenShift.',
    tellMe: 'Tell me what you need',
    expertiseEyebrow: '04 / Tools',
    toolsTitle: 'Development Tools',
    toolsAria: 'Development tools',
    logo: 'Logo',
    projectsEyebrow: '03 / Projects',
    projectsTitle: 'Project Experience',
    projectHint: 'Select a project to view its details.',
    projectFilters: { all: 'All', backend: 'Backend', data: 'Data', delivery: 'Release' },
    filterAria: 'Project filters',
    previousProject: 'Previous project',
    nextProject: 'Next project',
    projectCarousel: 'Project carousel',
    projectDetails: 'View {name} project details',
    seeDetails: 'View details',
    moreProjectsStart: 'I’ve also contributed to',
    moreProjectsEnd: 'and',
    experienceEyebrow: '02 / Experience',
    experienceTitle: 'My Career Journey.',
    experienceIntro:
      'I build backend and middleware services, manage databases, and help ship applications.',
    education: 'Education',
    degree: 'BSc in Informatics Engineering',
    university: 'Universitas YARSI, GPA 3.47',
    contactEyebrow: '05 / Contact',
    contactTitle: 'Have An Idea? Let’s Talk.',
    contactIntro: 'Need help with Java, integrations, or databases? Tell me about it.',
    email: 'Email',
    phone: 'Phone',
    linkedin: 'LinkedIn',
    quickContact: 'Quick contact',
    copyEmail: 'Copy email address',
    emailCopied: 'Email copied',
    name: 'Name',
    yourName: 'Your name',
    subject: 'Subject',
    subjectPlaceholder: 'For example: REST API integration',
    message: 'Message',
    messagePlaceholder: 'Tell me about your message or project.',
    continueByEmail: 'Continue by email',
    emailFormNote: 'This form opens your email app. Your message is not sent automatically.',
    emailSubject: 'Java project discussion',
    emailGreeting: 'Hello Prakosa Dwi Prasetya,',
    emailSignoff: 'Best,',
    backToTop: 'Back to top',
    aboutProject: 'About this project',
    closeProject: 'Close project details',
    yourContribution: 'What I worked on',
    similarProject: 'Let’s discuss a similar project',
  },
} as const

const copy = computed(() => translations[locale.value])

const navItems = [
  { id: 'about', key: 'about' },
  { id: 'experience', key: 'experience' },
  { id: 'projects', key: 'projects' },
  { id: 'expertise', key: 'expertise' },
] as const

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
  { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1', mark: 'PG' },
  { name: 'Oracle Database', slug: 'oracle', color: 'F80000', mark: 'ORA' },
  { name: 'MariaDB', slug: 'mariadb', color: '003545', mark: 'MDB' },
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
    id: 'klik-indomaret',
    name: 'Klik Indomaret',
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

const englishProjectCopy: Record<string, Pick<Project, 'context' | 'detail' | 'contributions'>> = {
  hse: {
    context: 'Business application',
    detail: 'Turning requirements into features, connecting business functions, and helping resolve application issues.',
    contributions: [
      'Developing and maintaining application features.',
      'Turning business needs into technical solutions.',
      'Finding root causes and fixing application issues.',
    ],
  },
  sdcos: {
    context: 'Backend and service integration',
    detail: 'Building backend features, connecting services, processing data, and resolving application issues.',
    contributions: [
      'Helping develop application features.',
      'Connecting services and data.',
      'Troubleshooting issues and maintaining applications.',
    ],
  },
  'klik-indomaret': {
    context: 'Food ordering platform',
    detail: 'Building Spring Boot services with PostgreSQL and Oracle, then testing APIs with Postman.',
    contributions: [
      'Developing REST APIs with Spring Boot.',
      'Preparing database tables, views, functions, and cursors.',
      'Testing APIs with Postman.',
    ],
  },
  ap2t: {
    context: 'Large-scale service platform',
    detail: 'Developing REST APIs and scheduled jobs with Spring Boot and Quarkus, managing databases, and preparing releases with GitLab CI/CD.',
    contributions: [
      'Building REST APIs and scheduled jobs.',
      'Managing PostgreSQL and Oracle databases.',
      'Releasing applications through GitLab CI/CD.',
    ],
  },
  newito: {
    context: 'Business application',
    detail: 'Building APIs, configuring scheduled jobs, preparing databases, and helping test and release applications.',
    contributions: [
      'Building REST APIs and scheduled jobs.',
      'Preparing PostgreSQL and Oracle database objects.',
      'Testing and releasing applications.',
    ],
  },
  'emis-kemenag': {
    context: 'Public information system',
    detail: 'Developing an information system, connecting services and data, and helping resolve technical issues.',
    contributions: [
      'Helping develop the application.',
      'Managing data and connecting services.',
      'Troubleshooting technical issues.',
    ],
  },
}

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

const englishExperienceCopy: Record<string, { period: string; role: string; summary: string }> = {
  'TOGI Indonesia': {
    period: 'March 2026 - August 2026',
    role: 'Java Engineer (assigned to DCI Indonesia Tbk)',
    summary: 'Developing and integrating applications for data center operations.',
  },
  'PT FAN 360': {
    period: 'October 2025 - February 2026',
    role: 'Java Engineer (assigned to Indomarco)',
    summary: 'Building Spring Boot REST APIs, managing PostgreSQL and Oracle, and testing ordering services.',
  },
  'Mitra Utama Solusi Teknologi': {
    period: 'October 2023 - July 2025',
    role: 'Java Engineer',
    summary: 'Developing APIs, scheduled jobs, and CI/CD, while supporting interface development across five projects.',
  },
  'Mega Giga Solusindo': {
    period: 'October 2022 - October 2023',
    role: 'Java Engineer',
    summary: 'Building APIs and scheduled jobs, managing databases, and testing and releasing applications across three projects.',
  },
  'Juke Solusi Teknologi': {
    period: 'October 2021 - April 2022',
    role: 'Middleware & Database Engineer',
    summary: 'Developing REST APIs with TIBCO, using Docker and OpenShift, and monitoring services on GCP.',
  },
}

const filters: { value: 'all' | ProjectCategory }[] = [
  { value: 'all' },
  { value: 'backend' },
  { value: 'data' },
  { value: 'delivery' },
]

const activeFilter = ref<'all' | ProjectCategory>('all')
const activeProjectIndex = ref(0)
const activeProjectId = ref<string | null>(null)
const activeSection = ref('home')
const isMenuOpen = ref(false)
const theme = ref<Theme>('light')
const copyStatus = ref<'ready' | 'copied' | 'fallback'>('ready')
const currentYear = new Date().getFullYear()
const contactForm = reactive({ name: '', subject: '', message: '' })

const localizedProjects = computed(() =>
  projects.map((project) =>
    locale.value === 'en'
      ? { ...project, ...englishProjectCopy[project.id] }
      : project,
  ),
)

const localizedExperiences = computed(() =>
  experiences.map((experience) =>
    locale.value === 'en'
      ? { ...experience, ...englishExperienceCopy[experience.company] }
      : experience,
  ),
)

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return localizedProjects.value
  return localizedProjects.value.filter((project) =>
    project.categories.includes(activeFilter.value as ProjectCategory),
  )
})

const projectCardAngle = computed(() => 360 / Math.max(filteredProjects.value.length, 1))
const projectTrackStyle = computed(() => ({
  '--project-rotation': `${activeProjectIndex.value * projectCardAngle.value * -1}deg`,
}))

function projectCardStyle(index: number) {
  return {
    '--card-rotation': `${index * projectCardAngle.value}deg`,
  }
}

const selectedProject = computed(
  () => localizedProjects.value.find((project) => project.id === activeProjectId.value) ?? null,
)
const copyLabel = computed(() =>
  copyStatus.value === 'copied'
    ? copy.value.emailCopied
    : copyStatus.value === 'fallback'
      ? email
      : copy.value.copyEmail,
)

let revealObserver: IntersectionObserver | undefined
let sectionObserver: IntersectionObserver | undefined
let copyTimer: number | undefined

function applyTheme(value: Theme) {
  document.documentElement.dataset.theme = value
  document.documentElement.style.colorScheme = value
}

function applyLocale(value: Locale) {
  document.documentElement.lang = value
  document.title = translations[value].pageTitle
  document.querySelector('meta[name="description"]')?.setAttribute('content', translations[value].metaDescription)
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', translations[value].ogLocale)
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function toggleLocale() {
  locale.value = locale.value === 'id' ? 'en' : 'id'
  applyLocale(locale.value)
  localStorage.setItem('portfolio-locale', locale.value)
}

function rotateProjects(direction: 1 | -1) {
  const totalProjects = filteredProjects.value.length
  if (totalProjects === 0) return

  activeProjectIndex.value =
    (activeProjectIndex.value + direction + totalProjects) % totalProjects
}

function openProject(project: Project) {
  activeProjectId.value = project.id
  nextTick(() => document.querySelector<HTMLButtonElement>('.modal-close')?.focus())
}

function closeProject() {
  activeProjectId.value = null
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email)
    copyStatus.value = 'copied'
  } catch {
    copyStatus.value = 'fallback'
  }

  window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => {
    copyStatus.value = 'ready'
  }, 2400)
}

function sendMessage() {
  const subject = contactForm.subject || copy.value.emailSubject
  const body = [copy.value.emailGreeting, '', contactForm.message, '', copy.value.emailSignoff, contactForm.name]
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

watch(activeProjectId, (project) => {
  document.body.classList.toggle('modal-open', Boolean(project))
})

watch(activeFilter, () => {
  activeProjectIndex.value = 0
})

watch(isMenuOpen, (isOpen) => {
  document.body.classList.toggle('menu-open', isOpen)
})

onMounted(() => {
  const savedLocale = localStorage.getItem('portfolio-locale')
  if (savedLocale === 'en') locale.value = 'en'
  applyLocale(locale.value)

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
          const element = entry.target as HTMLElement

          if (element.classList.contains('tools-list')) {
            if (entry.isIntersecting) {
              element.classList.remove('is-visible')
              window.requestAnimationFrame(() => element.classList.add('is-visible'))
            } else {
              element.classList.remove('is-visible')
            }
            return
          }

          if (entry.isIntersecting) {
            element.classList.add('is-visible')
            revealObserver?.unobserve(element)
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
    <a class="skip-link" href="#main">{{ copy.skip }}</a>

    <header class="site-header">
      <div class="shell nav-shell">
        <a class="brand" href="#home" :aria-label="copy.home">
          <PrakosaLogo class="brand-logo" />
          <span class="brand-copy">
            <strong>Prakosa Dwi Prasetya</strong>
            <small>Java Engineer</small>
          </span>
        </a>

        <nav :class="['nav-links', { 'is-open': isMenuOpen }]" :aria-label="copy.navAria">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="`#${item.id}`"
            :class="{ active: activeSection === item.id }"
            @click="isMenuOpen = false"
          >
            {{ copy.nav[item.key] }}
          </a>
        </nav>

        <div class="nav-actions">
          <button
            class="icon-button"
            type="button"
            :aria-label="theme === 'light' ? copy.themeDark : copy.themeLight"
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
          <button class="language-toggle" type="button" :aria-label="copy.switchLanguage" @click="toggleLocale">
            <span :class="{ active: locale === 'id' }">ID</span><span aria-hidden="true">/</span>
            <span :class="{ active: locale === 'en' }">EN</span>
          </button>
          <a class="button button-small button-dark desktop-cta" href="#contact">{{ copy.contactMe }}</a>
          <button
            class="icon-button menu-button"
            type="button"
            :aria-expanded="isMenuOpen"
            :aria-label="isMenuOpen ? copy.closeNav : copy.openNav"
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
            <p class="availability"><span></span> {{ copy.availability }}</p>
            <h1>Software Engineer</h1>
            <p class="hero-lead">{{ copy.heroLead }}</p>

            <div class="hero-actions">
              <a class="button button-primary" href="#projects"
                >{{ copy.viewProjects }} <span aria-hidden="true">-&gt;</span></a
              >
              <a class="button button-dark" :href="cvUrl" :download="cvFilename"
                >{{ copy.downloadCv }} <span aria-hidden="true">&darr;</span></a
              >
              <a class="text-link" href="#experience"
                >{{ copy.viewJourney }} <span aria-hidden="true">&darr;</span></a
              >
            </div>
          </div>

          <div class="hero-visual" data-reveal>
            <div class="system-map" role="group" aria-labelledby="system-map-title">
              <div class="system-map-header">
                <span class="map-kicker"><i></i> {{ copy.workflow }}</span>
                <span class="map-index">01 / 03</span>
              </div>

              <div class="system-map-heading">
                <p>{{ copy.javaDevelopment }}</p>
                <h2 id="system-map-title">{{ copy.workflowHeading }}</h2>
                <span class="map-caption">{{ copy.workflowCaption }}</span>
              </div>

              <div class="system-flow" role="list" :aria-label="copy.workflowAria">
                <div class="system-node" role="listitem">
                  <span class="node-icon">API</span>
                  <div class="node-copy">
                  <span class="node-label">01 / {{ copy.service }}</span>
                    <strong>{{ copy.apiService }}</strong>
                    <small>Spring Boot / Quarkus</small>
                  </div>
                  <span class="node-status" aria-hidden="true"></span>
                </div>
                <span class="flow-connector" aria-hidden="true"><i></i></span>
                <div class="system-node" role="listitem">
                  <span class="node-icon node-icon-data">DB</span>
                  <div class="node-copy">
                  <span class="node-label">02 / {{ copy.data }}</span>
                    <strong>{{ copy.dataStorage }}</strong>
                    <small>PostgreSQL / Oracle</small>
                  </div>
                  <span class="node-status" aria-hidden="true"></span>
                </div>
                <span class="flow-connector" aria-hidden="true"><i></i></span>
                <div class="system-node" role="listitem">
                  <span class="node-icon node-icon-delivery">CI</span>
                  <div class="node-copy">
                  <span class="node-label">03 / {{ copy.release }}</span>
                    <strong>{{ copy.appRelease }}</strong>
                    <small>GitLab CI/CD / Docker</small>
                  </div>
                  <span class="node-status" aria-hidden="true"></span>
                </div>
              </div>

              <div class="system-map-footer">
                <span><i></i> {{ copy.city }}</span>
                <span>BACKEND <b>/</b> DATA <b>/</b> {{ copy.release }}</span>
              </div>
            </div>
          </div>

          <div class="hero-proof" :aria-label="copy.experienceSummaryAria">
            <div><strong>4+</strong><span>{{ copy.yearsExperience }}</span></div>
            <div><strong>8</strong><span>{{ copy.keyProjects }}</span></div>
            <div><strong>5</strong><span>{{ copy.techCompanies }}</span></div>
          </div>
        </div>
      </section>

      <section id="about" class="section-pad about-section">
        <div class="shell about-grid">
          <div class="section-intro" data-reveal>
            <p class="eyebrow">{{ copy.aboutEyebrow }}</p>
            <h2>{{ copy.aboutHeading }}</h2>
          </div>

          <div class="about-copy" data-reveal>
            <p class="about-lead">{{ copy.aboutLead }}</p>
            <p class="about-availability">{{ copy.aboutAvailability }}</p>
            <div class="about-columns">
              <p>{{ copy.aboutData }}</p>
              <p>{{ copy.aboutDelivery }}</p>
            </div>
            <a class="inline-link" href="#contact"
              >{{ copy.tellMe }} <span aria-hidden="true">-&gt;</span></a
            >
          </div>
        </div>
      </section>

      <section id="experience" class="section-pad experience-section">
        <div class="shell experience-layout">
          <div class="experience-sticky" data-reveal>
            <p class="eyebrow">{{ copy.experienceEyebrow }}</p>
            <h2>{{ copy.experienceTitle }}</h2>
            <p>{{ copy.experienceIntro }}</p>

            <div class="education-card">
              <small>{{ copy.education }}</small>
              <strong>{{ copy.degree }}</strong>
              <span>{{ copy.university }}</span>
              <span>2017 - 2021</span>
            </div>
          </div>

          <ol class="experience-list">
            <li v-for="(experience, index) in localizedExperiences" :key="experience.company" data-reveal>
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

      <section id="projects" class="section-pad projects-section">
        <div class="shell">
          <div class="section-heading projects-heading" data-reveal>
            <div>
              <p class="eyebrow">{{ copy.projectsEyebrow }}</p>
              <h2>{{ copy.projectsTitle }}</h2>
            </div>
            <p>{{ copy.projectHint }}</p>
          </div>

          <div class="project-filters" data-reveal :aria-label="copy.filterAria">
            <button
              v-for="filter in filters"
              :key="filter.value"
              type="button"
              :class="{ active: activeFilter === filter.value }"
              @click="activeFilter = filter.value"
            >
              {{ copy.projectFilters[filter.value] }}
              <span>{{
                filter.value === 'all'
                  ? projects.length
                  : projects.filter((project) =>
                      project.categories.includes(filter.value as ProjectCategory),
                    ).length
              }}</span>
            </button>
          </div>

          <div class="project-stage">
            <button
              type="button"
              class="project-nav-button project-nav-previous"
              :aria-label="copy.previousProject"
              @click="rotateProjects(-1)"
            >
              <svg class="project-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m14.5 5-7 7 7 7" />
              </svg>
            </button>

            <div
              class="project-viewport"
              tabindex="0"
              :aria-label="copy.projectCarousel"
              @keydown.left.prevent="rotateProjects(-1)"
              @keydown.right.prevent="rotateProjects(1)"
            >
              <div class="project-track" :style="projectTrackStyle">
                <article
                  v-for="(project, index) in filteredProjects"
                  :key="project.id"
                  :class="['project-card', { 'is-active': index === activeProjectIndex }]"
                  :style="projectCardStyle(index)"
                  :aria-current="index === activeProjectIndex ? 'true' : undefined"
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
                      :aria-label="copy.projectDetails.replace('{name}', project.name)"
                      @click="openProject(project)"
                    >
                      <span>{{ copy.seeDetails }}</span><span aria-hidden="true">&nearr;</span>
                    </button>
                  </div>
                </article>
              </div>
            </div>

            <button
              type="button"
              class="project-nav-button project-nav-next"
              :aria-label="copy.nextProject"
              @click="rotateProjects(1)"
            >
              <svg class="project-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9.5 5 7 7-7 7" />
              </svg>
            </button>
          </div>

          <p class="more-projects" data-reveal>
            {{ copy.moreProjectsStart }} <strong>IWOOD, AP1, REC, SEMAR, SAKTI,</strong>
            {{ copy.moreProjectsEnd }} <strong>EV2GO</strong>.
          </p>
        </div>
      </section>

      <section id="expertise" class="section-pad expertise-section">
        <div class="shell">
          <div class="section-heading" data-reveal>
            <div>
              <p class="eyebrow">{{ copy.expertiseEyebrow }}</p>
              <h2>{{ copy.toolsTitle }}</h2>
            </div>
          </div>

          <ul class="tools-list" data-reveal :aria-label="copy.toolsAria">
            <li v-for="(tool, index) in tools" :key="tool.name" :style="{ '--item-index': index }">
              <span class="tool-logo" :style="{ '--tool-color': `#${tool.color}` }">
                <PrakosaLogo v-if="tool.customLogo" class="tool-custom-logo" />
                <img
                  v-else-if="tool.slug && !brokenToolLogos.includes(tool.name)"
                  :src="`https://cdn.simpleicons.org/${tool.slug}/${tool.color}`"
                  :alt="`${copy.logo} ${tool.name}`"
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

      <section id="contact" class="section-pad contact-section">
        <div class="shell contact-panel" data-reveal>
          <div class="contact-copy">
            <p class="eyebrow">{{ copy.contactEyebrow }}</p>
            <h2>{{ copy.contactTitle }}</h2>
            <p>{{ copy.contactIntro }}</p>

            <div class="contact-links">
              <a :href="`mailto:${email}`"
                ><small>{{ copy.email }}</small><strong>{{ email }}</strong></a
              >
              <a :href="`tel:${phone.replaceAll(' ', '')}`"
                ><small>{{ copy.phone }}</small><strong>{{ phone }}</strong></a
              >
              <a :href="linkedinUrl" target="_blank" rel="noopener noreferrer"
                ><small>{{ copy.linkedin }}</small><strong>/in/prakosa-dwi-prasetya &nearr;</strong></a
              >
              <button type="button" @click="copyEmail">
                <small>{{ copy.quickContact }}</small><strong>{{ copyLabel }}</strong>
              </button>
            </div>
          </div>

          <form class="contact-form" @submit.prevent="sendMessage">
            <label>
              <span>{{ copy.name }}</span>
              <input
                v-model="contactForm.name"
                type="text"
                name="name"
                autocomplete="name"
                :placeholder="copy.yourName"
                required
              />
            </label>
            <label>
              <span>{{ copy.subject }}</span>
              <input
                v-model="contactForm.subject"
                type="text"
                name="subject"
                :placeholder="copy.subjectPlaceholder"
                required
              />
            </label>
            <label>
              <span>{{ copy.message }}</span>
              <textarea
                v-model="contactForm.message"
                name="message"
                rows="5"
                :placeholder="copy.messagePlaceholder"
                required
              ></textarea>
            </label>
            <button class="button button-primary form-submit" type="submit">
              {{ copy.continueByEmail }} <span aria-hidden="true">-&gt;</span>
            </button>
            <small>{{ copy.emailFormNote }}</small>
          </form>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="shell footer-inner">
        <p>&copy; {{ currentYear }} Prakosa Dwi Prasetya</p>
        <a href="#home">{{ copy.backToTop }} &uarr;</a>
      </div>
    </footer>

    <Transition name="modal">
      <div
        v-if="selectedProject"
        class="modal-backdrop"
        role="presentation"
        @mousedown.self="closeProject"
      >
        <section
          class="project-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`modal-${selectedProject.id}`"
        >
          <button
            class="icon-button modal-close"
            type="button"
            :aria-label="copy.closeProject"
            @click="closeProject"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
          <p class="eyebrow">{{ copy.aboutProject }}</p>
          <h2 :id="`modal-${selectedProject.id}`">{{ selectedProject.name }}</h2>
          <p class="modal-context">{{ selectedProject.context }}</p>
          <p class="modal-description">{{ selectedProject.detail }}</p>
          <h3>{{ copy.yourContribution }}</h3>
          <ul class="contribution-list">
            <li v-for="contribution in selectedProject.contributions" :key="contribution">
              {{ contribution }}
            </li>
          </ul>
          <ul class="modal-tags">
            <li v-for="technology in selectedProject.technologies" :key="technology">
              {{ technology }}
            </li>
          </ul>
          <a class="button button-dark" href="#contact" @click="closeProject"
            >{{ copy.similarProject }} <span aria-hidden="true">-&gt;</span></a
          >
        </section>
      </div>
    </Transition>
  </div>
</template>
