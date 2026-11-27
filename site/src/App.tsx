import { useEffect, useRef, useState } from 'react'

const installCommand =
  "npx skills add hemanth090/telangana-open-data-catalog -a '*' -g"

const repoApi =
  'https://api.github.com/repos/hemanth090/telangana-open-data-catalog'

type PanelId = 'what' | 'who' | 'why'

const panels: Record<
  PanelId,
  { label: string; heading: string; body: string[] }
> = {
  what: {
    label: 'What it is',
    heading: 'A map of what exists.',
    body: [
      'A citation-ready index of Telangana open data: 364 datasets and 7,325 distribution entries, each with its source URL, column list, and license.',
      'It is metadata only. No rows, no cell values, and no runtime code, so an agent can check what a file holds before anyone downloads it.',
    ],
  },
  who: {
    label: 'Who it is for',
    heading: 'For anyone starting from zero.',
    body: [
      'AI builders, researchers, founders, prototypers, and analysts all hit the same wall: which dataset actually exists, and what is in it.',
      'The index answers coverage, columns, and licensing before a download, so the first hour goes into the question instead of the portal.',
    ],
  },
  why: {
    label: 'Why it exists',
    heading: 'The portal is the hard part.',
    body: [
      'Telangana publishes hundreds of datasets, but the portal has no full-text search, no datastore, and no published column metadata. Finding the right file means opening dozens of them.',
      'This index removes that step, so researchers and agents start from what exists and cite the source they actually used.',
    ],
  },
}

const navItems: Array<{ id: PanelId; label: string }> = [
  { id: 'what', label: 'What' },
  { id: 'who', label: 'Who' },
  { id: 'why', label: 'Why' },
]

function formatCount(value: number) {
  if (value < 1000) return String(value)
  return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.3l2.05 4.15 4.58.67-3.31 3.23.78 4.56L8 11.76l-4.1 2.15.78-4.56L1.37 6.1l4.58-.66L8 1.3Z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .7A11.3 11.3 0 0 0 8.4 22.8c.6.1.8-.3.8-.6v-2.4c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-6A4.7 4.7 0 0 1 5.8 7c-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.5 1.3a12 12 0 0 1 6.3 0c2.4-1.6 3.5-1.3 3.5-1.3.6 1.7.2 3 .1 3.3a4.7 4.7 0 0 1 1.2 3.3c0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.7c0 .4.2.7.8.6A11.3 11.3 0 0 0 12 .7Z"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h12M11.5 5.5 16 10l-4.5 4.5" />
    </svg>
  )
}

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m4.5 10 3.2 3.2 7.8-7.8" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="7" y="6" width="8" height="9" rx="1.5" />
      <path d="M12 6V5a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 3 5v7A1.5 1.5 0 0 0 4.5 13H7" />
    </svg>
  )
}

const sectors = [
  'Agriculture',
  'Administration',
  'Health',
  'Education',
  'Welfare',
  'Industries',
  'Infrastructure',
  'Transportation',
  'Animal Husbandry & Livestock',
  'Labour & Employment',
  'Irrigation',
  'Tourism & Culture',
  'Energy',
  'Population & Households',
  'Automobile',
  'Banking & Finance',
  'Forest',
  'Pollution',
  'Rural Development',
  'Handlooms',
  'Law & Order',
  'Urban',
  'Unthemed',
]

export default function App() {
  const [copied, setCopied] = useState(false)
  const [stars, setStars] = useState<number | null>(null)
  const [panel, setPanel] = useState<PanelId | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true

    fetch(repoApi)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && typeof data?.stargazers_count === 'number') {
          setStars(data.stargazers_count)
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!panel) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const panelEl = panelRef.current

    const focusable = () =>
      panelEl
        ? Array.from(
            panelEl.querySelectorAll<HTMLElement>(
              'button, a[href], [tabindex]:not([tabindex="-1"])',
            ),
          )
        : []

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPanel(null)
        return
      }

      if (event.key !== 'Tab' || !panelEl) return

      const items = focusable()
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      const inside = panelEl.contains(active)

      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    document.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [panel])

  const copyInstall = async () => {
    let copiedOk = false

    try {
      await navigator.clipboard.writeText(installCommand)
      copiedOk = true
    } catch {
      const area = document.createElement('textarea')
      area.value = installCommand
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.top = '-1000px'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      copiedOk = document.execCommand('copy')
      document.body.removeChild(area)
    }

    if (!copiedOk) return

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="landing">
      <header className="nav-wrap">
        <a className="brand" href="#" aria-label="Telangana Open Data home">
          <span>Telangana Open Data</span>
        </a>

        <nav className="nav-links" aria-label="About this skill">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-haspopup="dialog"
              onClick={() => setPanel(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <a
          className="nav-github"
          href="https://github.com/hemanth090/telangana-open-data-catalog"
          target="_blank"
          rel="noreferrer"
          aria-label="Telangana Open Data on GitHub"
        >
          <GithubIcon />
          <span className="nav-label">GitHub</span>
          {stars !== null && (
            <span className="star-chip" aria-label={`${stars} stars`}>
              <StarIcon />
              {formatCount(stars)}
            </span>
          )}
        </a>
      </header>

      <section className="hero">
        <div className="eyebrow">
          Telangana data · organized for AI agents
        </div>

        <h1>
          Open data that your
          <br />
          agent can actually use.
        </h1>

        <p className="intro">
          Search 364 Telangana datasets, check the columns and licenses they
          publish, and cite the source, without scraping the portal yourself.
        </p>

        <div className="actions">
          <button className="install-button" type="button" onClick={copyInstall}>
            <span className="install-label">
              <span className={copied ? 'label-hidden' : undefined}>
                Install the skill
              </span>
              <span
                className={copied ? undefined : 'label-hidden'}
                aria-hidden={!copied}
              >
                Copied
              </span>
            </span>
            <CopyIcon copied={copied} />
          </button>

          <a
            className="github-button"
            href="https://github.com/hemanth090/telangana-open-data-catalog"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
            <ArrowIcon />
          </a>
        </div>
        <p className="works-with">
          364 datasets · 7,325 resources · 23 themes
        </p>
      </section>

      <div className="sector-strip" aria-hidden="true">
        <div className="sector-track">
          {[0, 1].map((copy) => (
            <div className="sector-group" key={copy}>
              {sectors.map((sector) => (
                <span className="sector" key={`${copy}-${sector}`}>
                  {sector}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {panel && (
        <div
          className="panel-backdrop"
          role="presentation"
          onClick={() => setPanel(null)}
        >
          <div
            className="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-heading"
            ref={panelRef}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="panel-close"
              type="button"
              onClick={() => setPanel(null)}
              aria-label="Close"
              ref={closeRef}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />
              </svg>
            </button>

            <p className="panel-label">{panels[panel].label}</p>
            <h2 className="panel-heading" id="panel-heading">
              {panels[panel].heading}
            </h2>

            {panels[panel].body.map((paragraph) => (
              <p className="panel-copy" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
