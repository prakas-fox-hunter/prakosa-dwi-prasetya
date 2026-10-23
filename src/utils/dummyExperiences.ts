export type DemoResult = {
  ok: boolean
  message: string
}

export type DemoMetric = {
  label: string
  value: string
  trend: string
  tone: 'positive' | 'neutral' | 'warning'
}

export type DemoMonitoringMenuKey =
  | 'home'
  | 'overview'
  | 'services'
  | 'incidents'
  | 'alerts'
  | 'voice-chat'
  | 'location'
  | 'settings'

export type DemoMonitoringMenuItem = {
  key: DemoMonitoringMenuKey
  label: string
  description: string
  icon: string
}

export type DemoSwaggerEndpoint = {
  method: 'GET' | 'POST'
  path: string
  summary: string
  response: string
}

export const demoMonitoringMenu: DemoMonitoringMenuItem[] = [
  { key: 'home', label: 'Home', description: 'Ringkasan kondisi sistem hari ini.', icon: '⌂' },
  { key: 'overview', label: 'Overview', description: 'Metrik performa dan tren layanan.', icon: '◈' },
  { key: 'services', label: 'Services', description: 'Status kesehatan seluruh service.', icon: '▦' },
  { key: 'incidents', label: 'Incidents', description: 'Daftar gangguan yang perlu ditinjau.', icon: '!' },
  { key: 'alerts', label: 'Alerts', description: 'Notifikasi dan aturan peringatan.', icon: '◉' },
  { key: 'settings', label: 'Settings', description: 'Preferensi dashboard dan workspace.', icon: '⚙' },
]

demoMonitoringMenu.splice(
  5,
  0,
  {
    key: 'voice-chat',
    label: 'Voice Chat',
    description: 'Transkripsi suara langsung di dalam monitoring.',
    icon: 'voice',
  },
  {
    key: 'location',
    label: 'Location',
    description: 'Lihat lokasi pada peta monitoring.',
    icon: 'location',
  },
)

export const demoSwaggerEndpoints: DemoSwaggerEndpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/monitoring/summary',
    summary: 'Mengambil ringkasan status monitoring.',
    response: '{ "status": "ok", "uptime": "99.98%" }',
  },
  {
    method: 'GET',
    path: '/api/v1/monitoring/services',
    summary: 'Menampilkan daftar layanan dan statusnya.',
    response: '{ "items": [{ "name": "API Gateway", "status": "healthy" }] }',
  },
  {
    method: 'POST',
    path: '/api/v1/monitoring/checks',
    summary: 'Menjalankan pemeriksaan service secara simulasi.',
    response: '{ "queued": true, "checkId": "demo-001" }',
  },
]

export function loginDemoUser(email: string, password: string): DemoResult {
  void email
  void password
  return { ok: true, message: 'Login demo berhasil.' }
}

export function registerDemoUser(name: string, email: string, password: string): DemoResult {
  void name
  void email
  void password
  return { ok: true, message: 'Registrasi demo berhasil. Silakan login.' }
}

export function getDemoDashboardMetrics(): DemoMetric[] {
  return [
    { label: 'Uptime', value: '99.98%', trend: '+0.12%', tone: 'positive' },
    { label: 'Request / menit', value: '1.284', trend: '+8.4%', tone: 'positive' },
    { label: 'Latency p95', value: '184 ms', trend: '-12 ms', tone: 'positive' },
    { label: 'Incident', value: '02', trend: '1 perlu ditinjau', tone: 'warning' },
  ]
}
