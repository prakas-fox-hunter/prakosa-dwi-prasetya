import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const viewSource = readFileSync(new URL('../src/views/DummyMonitoringView.vue', import.meta.url), 'utf8')
const indexSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

test('monitoring dashboard keeps the sidebar as a compact sticky rail', () => {
  const sidebarStyles = viewSource.match(/\.demo-sidebar\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

  assert.match(sidebarStyles, /position:\s*sticky;/)
  assert.match(sidebarStyles, /height:\s*auto;/)
  assert.match(sidebarStyles, /min-height:\s*100%;/)
  assert.match(sidebarStyles, /border-radius:\s*0;/)
  assert.match(sidebarStyles, /box-shadow:\s*none;/)
})

test('monitoring menu descriptions are available as tooltips only', () => {
  assert.match(viewSource, /:title="item\.description"/)
  assert.match(viewSource, /:aria-label="`\$\{item\.label\}: \$\{item\.description\}`"/)
  assert.doesNotMatch(viewSource, /\{\{ activeMenuItem\.description \}\}/)
})

test('monitoring login uses a full split visual and form panel', () => {
  const authScreenStyles = viewSource.match(/\.demo-auth-screen\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const authFormStyles = viewSource.match(/\.demo-auth-form\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const visualStyles = viewSource.match(/\.demo-auth-visual\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

  assert.doesNotMatch(viewSource, /class="demo-auth-card"/)
  assert.match(viewSource, /<section v-if="!isAuthenticated" class="demo-auth-screen">/)
  assert.match(viewSource, /<form[\s\S]*class="demo-auth-form"[\s\S]*?<header class="demo-auth-card-header">/)
  assert.match(authScreenStyles, /grid-template-columns:/)
    assert.match(viewSource, /monitoringServerVisual/)
  assert.match(authFormStyles, /background:\s*transparent;/)
  assert.match(authFormStyles, /border:\s*0;/)
  assert.match(authFormStyles, /border-radius:\s*0;/)
})

test('monitoring register keeps the same responsive form structure as login', () => {
  const authFormStyles = viewSource.match(/\.demo-auth-form\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const authHeaderStyles = viewSource.match(/\.demo-auth-card-header\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const authActionsStyles = viewSource.match(/\.demo-auth-card-actions\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const mobileStyles = viewSource.match(/@media \(max-width: 560px\)\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

  assert.match(viewSource, /<form[\s\S]*class="demo-auth-form"[\s\S]*:class="\{ 'is-register': authMode === 'register' \}"/)
  assert.match(viewSource, /<label v-if="authMode === 'register'">[\s\S]*<label>[\s\S]*<input[\s\S]*type="password"/)
  assert.match(authFormStyles, /box-sizing:\s*border-box;/)
  assert.match(authFormStyles, /min-width:\s*0;/)
  assert.match(authHeaderStyles, /flex-wrap:\s*wrap;/)
  assert.match(authActionsStyles, /flex-wrap:\s*wrap;/)
  assert.match(mobileStyles, /width:\s*100%;/)
  assert.match(mobileStyles, /flex-direction:\s*column;/)
})

test('monitoring auth screen fits the viewport without form scrolling', () => {
  const authScreenStyles = viewSource.match(/\.demo-auth-screen\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const authLayoutStyles =
    [...viewSource.matchAll(/\.demo-auth-layout\s*\{[\s\S]*?\n\}/g)].find((match) =>
      /min-height:\s*0;/.test(match[0]),
    )?.[0] ?? ''
  const loginPageStyles = viewSource.match(/\.demo-page\.is-login-screen\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const mobileStyles = viewSource.match(/@media \(max-width: 820px\)\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const compactMobileStyles = viewSource.match(/@media \(max-width: 560px\)\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

  assert.match(loginPageStyles, /height:\s*100svh;/)
  assert.match(authScreenStyles, /overflow:\s*hidden;/)
  assert.match(authLayoutStyles, /min-height:\s*0;/)
  assert.match(authLayoutStyles, /overflow:\s*hidden;/)
  assert.match(mobileStyles, /grid-template-rows:/)
  assert.match(compactMobileStyles, /min-height:\s*0;/)
  assert.match(viewSource, /@media \(max-width: 560px\) and \(max-height: 700px\)/)
  assert.match(viewSource, /grid-template-rows:\s*120px\s+minmax\(0, 1fr\);/)
})

test('monitoring dashboard uses local Font Awesome icons and compact navigation', () => {
  const sidebarStyles = viewSource.match(/\.demo-sidebar\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

  assert.match(indexSource, /font-awesome\/6\.7\.2\/css\/all\.min\.css/)
  assert.match(viewSource, /fa-gitlab/)
  assert.match(viewSource, /fa-server/)
  assert.match(viewSource, /fa-microchip/)
  assert.match(viewSource, /fa-house/)
  assert.match(viewSource, /fa-chart-line/)
  assert.match(viewSource, /fa-server/)
  assert.match(viewSource, /:class="\['fa-solid', menuIconClasses\[item\.key\]\]"/)
  assert.match(viewSource, /title="Kembali ke portfolio"/)
  assert.match(viewSource, /fa-house/)
  assert.match(viewSource, /fa-sun|fa-moon/)
  assert.doesNotMatch(viewSource, /<h1>\{\{ activeMenuItem\.label \}\}<\/h1>/)
  assert.match(sidebarStyles, /height:\s*auto;/)
  assert.match(sidebarStyles, /min-height:\s*100%;/)
  assert.match(sidebarStyles, /border-radius:\s*0;/)
  assert.match(sidebarStyles, /box-shadow:\s*none;/)
})

test('monitoring dashboard keeps an admin-style content hierarchy without menu hero titles', () => {
  const dashboardStyles = viewSource.match(/\.demo-dashboard\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

  assert.match(viewSource, /class="demo-dashboard-content"/)
  assert.match(viewSource, /class="demo-view-heading"/)
  assert.match(viewSource, /<h2>System status<\/h2>/)
  assert.match(viewSource, /<h2>Service health<\/h2>/)
  assert.match(viewSource, /<h2>Recent activity<\/h2>/)
  assert.doesNotMatch(viewSource, /class="demo-content-toolbar"/)
  assert.doesNotMatch(viewSource, /<h1>\{\{ activeMenuItem\.label \}\}<\/h1>/)
  assert.match(dashboardStyles, /min-width:\s*0;/)
})

test('monitoring dashboard content can shrink on narrow viewports', () => {
  const sidebarStyles = viewSource.match(/\.demo-sidebar\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const dashboardGridStyles = viewSource.match(/\.demo-dashboard-grid\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

  assert.match(sidebarStyles, /min-width:\s*0;/)
  assert.match(dashboardGridStyles, /min-width:\s*0;/)
})

test('monitoring sidebar menus render distinct dashboard views without a hero toolbar', () => {
  assert.doesNotMatch(viewSource, /class="demo-content-toolbar"/)
  assert.match(viewSource, /v-if="activeMenu === 'home'"/)
  assert.match(viewSource, /v-else-if="activeMenu === 'overview'"/)
  assert.match(viewSource, /v-else-if="activeMenu === 'services'"/)
  assert.match(viewSource, /v-else-if="activeMenu === 'incidents'"/)
  assert.match(viewSource, /v-else-if="activeMenu === 'alerts'"/)
  assert.match(viewSource, /v-else-if="activeMenu === 'settings'"/)
  assert.match(viewSource, /<h2>System status<\/h2>/)
  assert.match(viewSource, /<h2>Performance overview<\/h2>/)
  assert.match(viewSource, /<h2>Service catalog<\/h2>/)
  assert.match(viewSource, /<h2>Incident center<\/h2>/)
  assert.match(viewSource, /<h2>Alert rules<\/h2>/)
  assert.match(viewSource, /<h2>Workspace settings<\/h2>/)
})

test('monitoring sidebar includes Voice Chat as an embedded dashboard menu', () => {
  assert.match(viewSource, /VoiceChatView/)
  assert.match(viewSource, /:embedded="true"/)
  assert.match(viewSource, /v-else-if="activeMenu === 'voice-chat'"/)
})

test('monitoring sidebar includes Location with a default map view', () => {
  assert.match(viewSource, /v-else-if="activeMenu === 'location'"/)
  assert.match(viewSource, /OpenStreetMap/)
  assert.match(viewSource, /class="demo-location-map"/)
  assert.match(viewSource, /requestedMenu === 'location'/)
  assert.match(viewSource, /const center = `13\//)
  assert.match(viewSource, /CITY VIEW/)
  assert.match(viewSource, /navigator\.geolocation\.getCurrentPosition/)
  assert.match(viewSource, /watch\(\s*\[\s*activeMenu,\s*isAuthenticated/)
  assert.match(viewSource, /Focus/)
  assert.match(viewSource, /focusMyLocation/)
  assert.match(viewSource, /Open full map/)
  assert.match(viewSource, /class="demo-location-focus-button"/)
  assert.match(viewSource, /@click="focusMyLocation"/)
  assert.doesNotMatch(viewSource, /Map actions/)
  assert.match(viewSource, /clearLocation/)
  assert.match(viewSource, /:src="locationMapUrl"/)
  assert.match(viewSource, /navigator\.geolocation\.watchPosition/)
  assert.match(viewSource, /navigator\.geolocation\.clearWatch/)
  assert.match(viewSource, /if \(journeyState\.value === 'tracking'\) stopJourney\(\)/)
  assert.match(viewSource, /startJourney/)
  assert.match(viewSource, /markJourneyStop/)
  assert.match(viewSource, /stopJourney/)
  assert.match(viewSource, />Start</)
  assert.match(viewSource, />Mark</)
  assert.match(viewSource, />Stop</)
  assert.match(viewSource, /JELAJAH/)
  assert.match(viewSource, /journeyNameInput/)
  assert.match(viewSource, /isJourneyNamePromptOpen/)
  assert.match(viewSource, /openJourneyStart/)
  assert.match(viewSource, /confirmJourneyStart/)
  assert.match(viewSource, /weeklyJourneys/)
  assert.match(viewSource, /journeyHistory/)
  assert.match(viewSource, /Clear location/)
})

test('monitoring dashboard uses the full viewport for the authenticated shell', () => {
  assert.match(viewSource, /\.demo-page:not\(\.is-login-screen\)\s*\{[\s\S]*?padding:\s*0;/)
  assert.match(viewSource, /\.demo-dashboard-shell\s*\{[\s\S]*?width:\s*100%;/)
})

test('monitoring dashboard keeps the header inside the shell and uses compact card corners', () => {
  const dashboardStart = viewSource.indexOf('class="demo-dashboard-shell"')
  const headerStart = viewSource.indexOf('<header v-if="isAuthenticated"')
  const sidebarStart = viewSource.indexOf('<aside class="demo-sidebar"')
  const shellStyles = viewSource.match(/\.demo-dashboard-shell\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const headerStyles = viewSource.match(/\.demo-header\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const sidebarStyles = viewSource.match(/\.demo-sidebar\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const dashboardStyles = viewSource.match(/\.demo-dashboard\s*\{[\s\S]*?\n\}/)?.[0] ?? ''
  const cardStyles = viewSource.match(/\.demo-panel,[\s\S]*?\.demo-metric-card\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

  assert.ok(dashboardStart < headerStart)
  assert.ok(headerStart < sidebarStart)
  assert.match(shellStyles, /grid-template-rows:\s*auto\s+minmax\(0, 1fr\);/)
  assert.match(headerStyles, /grid-column:\s*2;/)
  assert.match(headerStyles, /grid-row:\s*1;/)
  assert.match(sidebarStyles, /grid-row:\s*1\s*\/\s*span\s*2;/)
  assert.match(dashboardStyles, /grid-column:\s*2;/)
  assert.match(dashboardStyles, /grid-row:\s*2;/)
  assert.match(cardStyles, /border-radius:\s*12px;/)
})

test('monitoring sidebar navigation wraps cleanly on mobile screens', () => {
  const mobileStyles = viewSource.match(/@media \(max-width: 820px\)\s*\{[\s\S]*?\n\}/)?.[0] ?? ''

  assert.match(mobileStyles, /\.demo-header\s*\{[^}]*grid-column:\s*1;[^}]*grid-row:\s*1;/s)
  assert.match(mobileStyles, /\.demo-sidebar\s*\{[^}]*grid-column:\s*1;[^}]*grid-row:\s*2;/s)
  assert.match(mobileStyles, /\.demo-dashboard\s*\{[^}]*grid-column:\s*1;[^}]*grid-row:\s*3;/s)
  assert.match(mobileStyles, /\.demo-sidebar-nav\s*\{[^}]*display:\s*grid;/s)
  assert.match(mobileStyles, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/)
})
