<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { demoSwaggerEndpoints } from '@/utils/dummyExperiences'

const activeEndpoint = ref<number | null>(null)

function toggleResponse(index: number) {
  activeEndpoint.value = activeEndpoint.value === index ? null : index
}
</script>

<template>
  <main class="swagger-page">
    <header class="swagger-header">
      <RouterLink class="swagger-brand" to="/">
        <span class="swagger-brand-mark">PX</span>
        <span>
          <strong>Project Example</strong>
          <small>Swagger API</small>
        </span>
      </RouterLink>
      <div class="swagger-header-actions">
        <span class="swagger-badge">DUMMY / NO DATABASE</span>
        <RouterLink class="swagger-back-link" to="/">Kembali ke portfolio</RouterLink>
      </div>
    </header>

    <section class="swagger-content">
      <div class="swagger-hero">
        <div>
          <p class="swagger-eyebrow">03 / API DOCUMENTATION</p>
          <h1>Monitoring API</h1>
          <p>
            Dokumentasi endpoint versi dummy untuk menunjukkan bentuk kontrak REST API. Tombol
            “Try it out” hanya menampilkan response statis dan tidak mengirim request keluar.
          </p>
        </div>
        <div class="swagger-version-card">
          <span>OPENAPI</span>
          <strong>3.0.3</strong>
          <small>Local example</small>
        </div>
      </div>

      <div class="swagger-server-bar">
        <span class="swagger-server-dot"></span>
        <span>Server</span>
        <code>https://dummy-monitoring.local/api</code>
        <strong>MOCK</strong>
      </div>

      <section class="swagger-endpoints" aria-labelledby="endpoint-title">
        <div class="swagger-section-heading">
          <div>
            <p class="swagger-eyebrow">ENDPOINTS</p>
            <h2 id="endpoint-title">Monitoring</h2>
          </div>
          <span>{{ demoSwaggerEndpoints.length }} operations</span>
        </div>

        <article v-for="(endpoint, index) in demoSwaggerEndpoints" :key="endpoint.path" class="swagger-endpoint">
          <div class="swagger-endpoint-main">
            <span class="swagger-method" :class="endpoint.method.toLowerCase()">{{ endpoint.method }}</span>
            <code>{{ endpoint.path }}</code>
            <p>{{ endpoint.summary }}</p>
            <button class="swagger-try-button" type="button" @click="toggleResponse(index)">
              {{ activeEndpoint === index ? 'Hide response' : 'Try it out' }}
            </button>
          </div>
          <div v-if="activeEndpoint === index" class="swagger-response">
            <div class="swagger-response-heading">
              <span>Response</span>
              <strong>200 OK</strong>
            </div>
            <pre><code>{{ endpoint.response }}</code></pre>
          </div>
        </article>
      </section>

      <div class="swagger-footer-note">
        <span><i></i> Static documentation for portfolio demonstration</span>
        <RouterLink class="swagger-back-link" to="/dummy-monitoring">Lihat web monitoring <span aria-hidden="true">-&gt;</span></RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.swagger-page { min-height: 100vh; padding: 28px clamp(20px, 5vw, 76px) 56px; color: #1f2937; background: #f5f8fb; }
.swagger-header,
.swagger-content { width: min(1180px, 100%); margin-inline: auto; }
.swagger-header { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-bottom: 28px; border-bottom: 1px solid #dbe6ef; }
.swagger-brand,
.swagger-back-link { color: inherit; text-decoration: none; }
.swagger-brand { display: inline-flex; align-items: center; gap: 12px; }
.swagger-brand-mark { display: grid; width: 42px; height: 42px; color: #fff; background: #163a67; border-radius: 12px; place-items: center; font-weight: 900; }
.swagger-brand strong,
.swagger-brand small { display: block; }
.swagger-brand strong { font-size: 0.86rem; }
.swagger-brand small { color: #74859a; font-size: 0.68rem; }
.swagger-header-actions,
.swagger-server-bar,
.swagger-footer-note { display: flex; align-items: center; gap: 14px; }
.swagger-badge,
.swagger-section-heading > span { color: #74859a; font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem; letter-spacing: 0.08em; }
.swagger-back-link { color: #2563eb; font-size: 0.76rem; font-weight: 800; }
.swagger-back-link:hover { color: #163a67; }
.swagger-content { padding-top: 70px; }
.swagger-hero { display: grid; grid-template-columns: 1fr 220px; align-items: end; gap: 40px; }
.swagger-eyebrow { margin-bottom: 12px; color: #2563eb; font-family: 'IBM Plex Mono', monospace; font-size: 0.64rem; font-weight: 700; letter-spacing: 0.12em; }
.swagger-hero h1 { margin-bottom: 18px; color: #163a67; font-size: clamp(3rem, 7vw, 6.2rem); line-height: 0.9; letter-spacing: -0.08em; }
.swagger-hero p:not(.swagger-eyebrow) { max-width: 680px; color: #60758a; font-size: 0.95rem; line-height: 1.8; }
.swagger-version-card { display: grid; gap: 7px; padding: 24px; color: #fff; background: #163a67; border-radius: 16px; }
.swagger-version-card span,
.swagger-version-card small { color: #9ec8ed; font-family: 'IBM Plex Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; }
.swagger-version-card strong { font-size: 2rem; letter-spacing: -0.05em; }
.swagger-server-bar { margin-top: 52px; padding: 14px 16px; color: #60758a; background: #fff; border: 1px solid #dbe6ef; border-radius: 10px; font-size: 0.72rem; }
.swagger-server-dot { width: 8px; height: 8px; background: #21b477; border-radius: 50%; }
.swagger-server-bar code { flex: 1; color: #1f2937; font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; }
.swagger-server-bar strong { color: #21b477; font-family: 'IBM Plex Mono', monospace; font-size: 0.6rem; }
.swagger-endpoints { margin-top: 54px; }
.swagger-section-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 16px; }
.swagger-section-heading h2 { color: #163a67; font-size: 1.7rem; letter-spacing: -0.04em; }
.swagger-endpoint { overflow: hidden; background: #fff; border: 1px solid #dbe6ef; border-radius: 10px; }
.swagger-endpoint + .swagger-endpoint { margin-top: 12px; }
.swagger-endpoint-main { display: grid; grid-template-columns: 62px minmax(260px, 0.9fr) 1fr auto; align-items: center; gap: 18px; padding: 19px 22px; }
.swagger-method { padding: 6px 8px; color: #fff; border-radius: 5px; font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem; font-weight: 800; text-align: center; }
.swagger-method.get { background: #2563eb; }
.swagger-method.post { background: #a36a00; }
.swagger-endpoint-main code { color: #163a67; font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; font-weight: 700; }
.swagger-endpoint-main p { color: #74859a; font-size: 0.76rem; }
.swagger-try-button { padding: 8px 11px; color: #2563eb; background: #eff6ff; border: 1px solid #c9ddf5; border-radius: 6px; cursor: pointer; font: inherit; font-size: 0.65rem; font-weight: 800; }
.swagger-try-button:hover { color: #fff; background: #2563eb; }
.swagger-response { padding: 18px 22px 22px; background: #f7fafc; border-top: 1px solid #dbe6ef; }
.swagger-response-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; color: #74859a; font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem; }
.swagger-response-heading strong { color: #21b477; }
.swagger-response pre { margin: 0; padding: 16px; overflow-x: auto; color: #d8f8ff; background: #102b45; border-radius: 7px; font-size: 0.7rem; line-height: 1.7; }
.swagger-footer-note { justify-content: space-between; margin-top: 30px; color: #74859a; font-size: 0.68rem; }
.swagger-footer-note > span { display: inline-flex; align-items: center; gap: 9px; }
.swagger-footer-note i { width: 7px; height: 7px; background: #21b477; border-radius: 50%; }
@media (max-width: 820px) {
  .swagger-hero { grid-template-columns: 1fr; }
  .swagger-version-card { width: min(220px, 100%); }
  .swagger-endpoint-main { grid-template-columns: 62px 1fr auto; }
  .swagger-endpoint-main p { grid-column: 2 / -1; }
}
@media (max-width: 560px) {
  .swagger-page { padding-inline: 16px; }
  .swagger-header,
  .swagger-header-actions,
  .swagger-footer-note { align-items: flex-start; flex-direction: column; }
  .swagger-hero h1 { font-size: clamp(3rem, 16vw, 4.5rem); }
  .swagger-server-bar { align-items: flex-start; flex-wrap: wrap; }
  .swagger-server-bar code { flex-basis: 100%; order: 3; }
  .swagger-endpoint-main { grid-template-columns: 58px 1fr; gap: 12px; padding: 17px; }
  .swagger-endpoint-main p { grid-column: 1 / -1; }
  .swagger-try-button { grid-column: 1 / -1; justify-self: start; }
}
</style>
