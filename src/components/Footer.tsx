import { phone, phoneHref } from '../data/contacts'
import { maxLink, maxLabel } from '../data/contacts'

const LOGO = 'Steelwood'

export function Footer() {
  return (
    <footer
      className="border-t border-neutral-200 bg-neutral-50 px-4 py-10"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-lg font-medium text-neutral-800">{LOGO}</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-600">
            <a href={phoneHref} className="hover:text-neutral-900">
              {phone}
            </a>
            <a
              href={maxLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900"
            >
              {maxLabel}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
