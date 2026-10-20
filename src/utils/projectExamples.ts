export type ProjectExampleIcon = 'monitoring' | 'swagger'

export type ProjectExample = {
  slug: string
  icon: ProjectExampleIcon
  route: string
  action: string
}

export const demoProjectExamples: ProjectExample[] = [
  {
    slug: 'monitoring',
    icon: 'monitoring',
    route: '/dummy-monitoring',
    action: 'Try it',
  },
  {
    slug: 'swagger',
    icon: 'swagger',
    route: '/dummy-swagger',
    action: 'Try it',
  },
]
