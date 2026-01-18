declare module '*.md' {
  const content: React.ComponentType
  export default content
}

declare module '*.mdx' {
  const MDXComponent: React.ComponentType
  export default MDXComponent
}
