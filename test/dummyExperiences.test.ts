import assert from 'node:assert/strict'
import test from 'node:test'

import {
  demoMonitoringMenu,
  demoSwaggerEndpoints,
  getDemoDashboardMetrics,
  loginDemoUser,
  registerDemoUser,
} from '../src/utils/dummyExperiences.ts'

test('demo login accepts non-empty credentials without a backend', () => {
  assert.deepEqual(loginDemoUser('demo@example.com', 'demo123'), {
    ok: true,
    message: 'Login demo berhasil.',
  })
})

test('demo login accepts empty credentials because the page is a no-validation prototype', () => {
  assert.deepEqual(loginDemoUser('', ''), {
    ok: true,
    message: 'Login demo berhasil.',
  })
})

test('demo registration stays local and permissive for the prototype', () => {
  assert.deepEqual(registerDemoUser('', '', ''), {
    ok: true,
    message: 'Registrasi demo berhasil. Silakan login.',
  })
})

test('monitoring dashboard exposes conventional sidebar menu items', () => {
  assert.deepEqual(
    demoMonitoringMenu.map((item) => item.label),
    ['Home', 'Overview', 'Services', 'Incidents', 'Alerts', 'Settings'],
  )
})

test('swagger demo exposes static endpoints and dashboard metrics', () => {
  assert.equal(demoSwaggerEndpoints.length, 3)
  assert.equal(demoSwaggerEndpoints[0].method, 'GET')
  assert.equal(demoSwaggerEndpoints[0].path, '/api/v1/monitoring/summary')
  assert.equal(getDemoDashboardMetrics()[0].label, 'Uptime')
})
