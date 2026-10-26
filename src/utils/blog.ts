import posts from '@/config/blog.json'

export type BlogProject = 'framework' | 'workbench'
export const blogPosts = posts
export const blogProjectNames = {
  framework: '框架更新',
  workbench: '工作台文章'
}

export function getBlogProject(pathname: string, search = ''): BlogProject {
  const post = blogPosts.find(post => post.path === pathname)
  if (post) return post.product === 'workbench' ? 'workbench' : 'framework'
  return new URLSearchParams(search).get('project') === 'workbench'
    ? 'workbench'
    : 'framework'
}

export function getProjectPosts(project: BlogProject) {
  return blogPosts.filter(post => post.product === project)
}
