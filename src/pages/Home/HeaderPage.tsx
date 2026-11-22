import { Link } from 'react-router-dom'
import SiteIcon from '@/components/SiteIcon'

export default function HeaderPage() {
  return (
    <header className="home-hero">
      <div className="home-hero-copy">
        <h1>ALemonX 文档</h1>
        <p>
          从创建机器人到运行、扩展和维护，查阅 ALemonX 工作台与 ALemonJS
          框架的使用指南。
        </p>
        <div className="home-hero-actions">
          <Link
            className="site-primary-action"
            to="/docs/alemonx/getting-started/install"
          >
            <SiteIcon name="workbench" />
            工作台快速开始
          </Link>
          <Link
            className="site-secondary-action"
            to="/docs/alemonjsDocs/overview"
          >
            <SiteIcon name="bot" />
            机器人开发
          </Link>
        </div>
      </div>
      <div className="home-workbench-preview">
        <img
          src="/images/alemonx-workbench.png"
          width="2112"
          height="1320"
          alt="ALemonX 工作台的机器人项目列表和 Agent 面板"
          fetchPriority="high"
        />
      </div>
    </header>
  )
}
