import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { demoProjectExamples } from '../src/utils/projectExamples.ts'

test('project examples expose only monitoring and Swagger cards with local routes', () => {
  assert.deepEqual(
    demoProjectExamples.map((project) => ({ slug: project.slug, icon: project.icon, route: project.route })),
    [
      { slug: 'monitoring', icon: 'monitoring', route: '/dummy-monitoring' },
      { slug: 'swagger', icon: 'swagger', route: '/dummy-swagger' },
    ],
  )
})

test('project example cards use a concise Try it call to action', () => {
  for (const project of demoProjectExamples) {
    assert.equal(project.action, 'Try it')
  }
})

test('project example cards are stacked vertically in the default layout', () => {
  const stylesheet = readFileSync(new URL('../src/assets/portfolio.css', import.meta.url), 'utf8')
  const projectFlowBlock = stylesheet.match(/\.project-example-flow\s*\{[^}]*\}/)?.[0]

  assert.ok(projectFlowBlock)
  assert.match(projectFlowBlock, /grid-template-columns:\s*1fr;/)
})
