import { Link } from 'react-router-dom'
import config from '@free-wind/config'

export default function Footer() {
  const { footer } = config.themeConfig

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {footer.links.map((section, index) => (
            <div key={index} className="text-center sm:text-left">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    ) : item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {footer.copyright && (
          <div className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-center text-gray-500 dark:text-gray-500">
            <div dangerouslySetInnerHTML={{ __html: footer.copyright }} />
          </div>
        )}
      </div>
    </footer>
  )
}
