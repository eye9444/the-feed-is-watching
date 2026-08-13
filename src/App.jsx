import { useEffect, useMemo, useRef, useState } from 'react'
import PostArtwork from './components/PostArtwork.jsx'
import { chapters, posts, sources } from './data/content.js'
import {
  TOPICS,
  applySignal,
  createInitialWeights,
  getDiversity,
  rankPosts,
  resetInference,
} from './utils/feed.js'

const EMPTY_CONSENT = {
  activity: false,
  location: false,
  inference: false,
}

const ACTION_LABELS = {
  like: 'Liked',
  share: 'Shared',
  dismiss: 'Marked not interested',
}

function ConsentDialog({ open, current, onSave, onContinue }) {
  const [draft, setDraft] = useState(current)

  useEffect(() => {
    if (open) setDraft(current)
  }, [open, current])

  if (!open) return null

  const toggles = [
    {
      key: 'activity',
      title: 'Use reactions to personalize',
      text: 'Allow this fictional feed to turn likes and shares into ranking signals during this visit.',
    },
    {
      key: 'location',
      title: 'Use approximate location',
      text: 'Permit a made-up “near you” signal. This demo never requests your real location.',
    },
    {
      key: 'inference',
      title: 'Create inferred interest labels',
      text: 'Translate topic scores into labels such as “likely interested in music.”',
    },
  ]

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="consent-paper"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
        aria-describedby="consent-description"
      >
        <div className="tape tape-top" aria-hidden="true" />
        <p className="pencil-label">Before you enter the simulation</p>
        <h2 id="consent-title">Your choices should come first.</h2>
        <p id="consent-description" className="consent-intro">
          Everything below is optional and off by default. These settings affect only the fictional
          demonstration; no real personal information is collected or saved.
        </p>

        <div className="consent-list">
          {toggles.map((toggle) => (
            <label className="consent-toggle" key={toggle.key}>
              <span>
                <strong>{toggle.title}</strong>
                <small>{toggle.text}</small>
              </span>
              <input
                type="checkbox"
                checked={draft[toggle.key]}
                onChange={(event) =>
                  setDraft((previous) => ({ ...previous, [toggle.key]: event.target.checked }))
                }
              />
              <span className="switch" aria-hidden="true" />
            </label>
          ))}
        </div>

        <div className="consent-note">
          <span aria-hidden="true">✦</span>
          <p>
            <strong>No dark patterns here.</strong> Refusing optional data will not block the campaign.
          </p>
        </div>

        <div className="consent-actions">
          <button className="button button-ink" type="button" onClick={() => onSave(draft)}>
            Save my choices
          </button>
          <button className="button button-paper" type="button" onClick={onContinue}>
            Continue without optional data
          </button>
        </div>
      </section>
    </div>
  )
}

function FeedPost({ post, reasonOpen, onAction, onReason }) {
  return (
    <article className={`feed-post topic-${post.topic}`} data-testid={`post-${post.id}`}>
      <header className="post-author">
        <span className="avatar" aria-hidden="true">{post.topic.slice(0, 1).toUpperCase()}</span>
        <span>
          <strong>@paper.{post.topic}</strong>
          <small>{post.kicker}</small>
        </span>
        <span className="post-menu" aria-hidden="true">•••</span>
      </header>
      <div className="post-sketch">
        <PostArtwork type={post.sketch} topic={post.topic} />
      </div>
      <div className="post-copy">
        <p className="topic-stamp">#{post.topic}</p>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
      <div className="post-actions" aria-label={`Actions for ${post.title}`}>
        <button type="button" onClick={() => onAction(post, 'like')}>
          <span aria-hidden="true">♡</span> Like
        </button>
        <button type="button" onClick={() => onAction(post, 'share')}>
          <span aria-hidden="true">↗</span> Share
        </button>
        <button type="button" onClick={() => onAction(post, 'dismiss')}>
          <span aria-hidden="true">⊘</span> Not interested
        </button>
        <button
          className="why-button"
          type="button"
          aria-expanded={reasonOpen}
          aria-controls={`reason-${post.id}`}
          onClick={() => onReason(post.id)}
        >
          Why this?
        </button>
      </div>
      {reasonOpen && (
        <div className="reason-note" id={`reason-${post.id}`}>
          <span className="reason-arrow" aria-hidden="true">↳</span>
          <div>
            <strong>The system’s explanation</strong>
            <p>{post.reason}</p>
          </div>
        </div>
      )}
    </article>
  )
}

function DataShadow({
  weights,
  history,
  consent,
  personalizationEnabled,
  onCorrect,
  onTogglePersonalization,
  onEditConsent,
  onDelete,
}) {
  const diversity = getDiversity(weights, personalizationEnabled)
  const maxWeight = Math.max(...Object.values(weights), 1)
  const inferred = TOPICS.filter((topic) => weights[topic] > 1)

  return (
    <aside className="data-shadow" aria-labelledby="shadow-title">
      <div className="shadow-heading">
        <div className="mini-eye" aria-hidden="true"><span /></div>
        <div>
          <p className="pencil-label">Updates as you tap</p>
          <h2 id="shadow-title">Your data shadow</h2>
        </div>
      </div>

      <section className="shadow-block" aria-labelledby="signals-title">
        <h3 id="signals-title">Topic scores</h3>
        <div className="weight-list">
          {TOPICS.map((topic) => (
            <div className="weight-row" key={topic}>
              <span>{topic}</span>
              <span className="weight-track" aria-hidden="true">
                <span style={{ width: `${(weights[topic] / maxWeight) * 100}%` }} />
              </span>
              <strong data-testid={`weight-${topic}`}>{weights[topic]}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="shadow-block diversity-block" aria-labelledby="diversity-title">
        <div>
          <h3 id="diversity-title">Feed diversity</h3>
          <strong className={`diversity-label level-${diversity.level}`}>{diversity.label}</strong>
        </div>
        <div className={`diversity-dial level-${diversity.level}`} aria-hidden="true">
          <span style={{ transform: `rotate(${Math.min(diversity.ratio * 180, 180) - 90}deg)` }} />
        </div>
        <small>Educational metaphor—not a scientific or psychological diagnosis.</small>
      </section>

      <section className="shadow-block" aria-labelledby="inferences-title">
        <h3 id="inferences-title">Inferred interests</h3>
        {!consent.inference ? (
          <p className="empty-note">Interest labels are not permitted.</p>
        ) : inferred.length === 0 ? (
          <p className="empty-note">No strong labels yet.</p>
        ) : (
          <ul className="inference-list">
            {inferred.map((topic) => (
              <li key={topic}>
                <span>Likely interested in {topic}</span>
                <button type="button" onClick={() => onCorrect(topic)} aria-label={`Correct ${topic} inference`}>
                  Correct
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="shadow-block" aria-labelledby="permissions-title">
        <h3 id="permissions-title">Permissions</h3>
        <ul className="permission-list">
          <li><span>Reaction tracking</span><strong>{consent.activity ? 'On' : 'Off'}</strong></li>
          <li><span>Approximate location</span><strong>{consent.location ? 'On' : 'Off'}</strong></li>
          <li><span>Interest labels</span><strong>{consent.inference ? 'On' : 'Off'}</strong></li>
        </ul>
        <button className="text-button" type="button" onClick={onEditConsent}>Review consent choices</button>
      </section>

      <section className="shadow-block" aria-labelledby="history-title">
        <h3 id="history-title">Recent signal history</h3>
        {history.length === 0 ? (
          <p className="empty-note">Nothing recorded in this session.</p>
        ) : (
          <ol className="history-list">
            {history.slice(0, 4).map((item) => (
              <li key={item.id}><strong>{item.action}</strong> {item.topic}</li>
            ))}
          </ol>
        )}
      </section>

      <div className="shadow-controls">
        <button className="button button-paper" type="button" onClick={onTogglePersonalization}>
          {personalizationEnabled ? 'Turn personalization off' : 'Turn personalization on'}
        </button>
        <button className="delete-button" type="button" onClick={onDelete}>Delete my simulation data</button>
      </div>
    </aside>
  )
}

function ChapterContent({ chapter }) {
  if (chapter.columns) {
    return (
      <div className="chapter-columns">
        {chapter.columns.map((column) => (
          <section key={column.title}>
            <h3>{column.title}</h3>
            <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ))}
      </div>
    )
  }

  if (chapter.badges) {
    return (
      <div className="principle-grid">
        {chapter.badges.map(([title, text], index) => (
          <section key={title} style={{ '--tilt': `${index % 2 ? 1 : -1}deg` }}>
            <span aria-hidden="true">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </section>
        ))}
      </div>
    )
  }

  if (chapter.rights) {
    return (
      <>
        <ul className="rights-list">
          {chapter.rights.map((right) => <li key={right}><span aria-hidden="true">✓</span>{right}</li>)}
        </ul>
        <p className="extra-protection"><strong>Extra care:</strong> {chapter.extra}</p>
      </>
    )
  }

  if (chapter.timeline) {
    return (
      <ol className="engineer-timeline">
        {chapter.timeline.map(([title, text], index) => (
          <li key={title}>
            <span className="timeline-number" aria-hidden="true">{index + 1}</span>
            <div><h3>{title}</h3><p>{text}</p></div>
          </li>
        ))}
      </ol>
    )
  }

  if (chapter.outcomes) {
    return (
      <ol className="outcome-list">
        {chapter.outcomes.map((outcome, index) => (
          <li key={outcome}><span aria-hidden="true">{index + 1}</span>{outcome}</li>
        ))}
      </ol>
    )
  }

  return (
    <div className="point-grid">
      {chapter.points.map(([title, text]) => (
        <section key={title}><h3>{title}</h3><p>{text}</p></section>
      ))}
    </div>
  )
}

function Chapter({ chapter }) {
  return (
    <article className={`chapter chapter-${chapter.tone}`} id={chapter.id}>
      <div className="chapter-number" aria-hidden="true">{chapter.number}</div>
      <header className="chapter-header">
        <p className="pencil-label">{chapter.eyebrow}</p>
        <h2>{chapter.title}</h2>
        <p>{chapter.lead}</p>
      </header>
      <ChapterContent chapter={chapter} />
      <blockquote>{chapter.takeaway}</blockquote>
    </article>
  )
}

function SourcesDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="sources-drawer" role="dialog" aria-modal="true" aria-labelledby="sources-title">
        <button className="drawer-close" type="button" onClick={onClose} aria-label="Close sources">×</button>
        <p className="pencil-label">Read the margins</p>
        <h2 id="sources-title">Source notes</h2>
        <p>These primary sources shaped the campaign. Links open in a new tab.</p>
        <ol>
          {sources.map((source, index) => (
            <li key={source.href}>
              <span aria-hidden="true">0{index + 1}</span>
              <div>
                <a href={source.href} target="_blank" rel="noreferrer">{source.name}</a>
                <p>{source.note}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="legal-note">Legal protections differ by jurisdiction. This campaign offers ethics education, not legal advice.</p>
      </aside>
    </div>
  )
}

function App() {
  const [consent, setConsent] = useState(EMPTY_CONSENT)
  const [consentOpen, setConsentOpen] = useState(true)
  const [weights, setWeights] = useState(createInitialWeights)
  const [history, setHistory] = useState([])
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true)
  const [openReason, setOpenReason] = useState(null)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const announcementTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(announcementTimer.current), [])

  const rankedPosts = useMemo(
    () => rankPosts(posts, weights, personalizationEnabled),
    [weights, personalizationEnabled],
  )

  const explainedPosts = rankedPosts.map((post) => {
    let reason
    if (!personalizationEnabled) {
      reason = 'Personalization is off, so this post remains in the original, unranked order.'
    } else if (!consent.activity) {
      reason = 'Reaction tracking is off. This post is not being moved because of your likes or shares.'
    } else {
      const locationReason = consent.location && post.topic === 'travel'
        ? ' A fictional approximate-location signal also contributed; your real location was never requested.'
        : ''
      const strength = weights[post.topic] > 3 ? ' This topic has become a strong ranking signal.' : ''
      reason = `${post.signal}.${strength}${locationReason}`
    }
    return { ...post, reason }
  })

  function announce(message) {
    window.clearTimeout(announcementTimer.current)
    setAnnouncement('')
    announcementTimer.current = window.setTimeout(() => {
      setAnnouncement(message)
      announcementTimer.current = window.setTimeout(() => setAnnouncement(''), 3200)
    }, 20)
  }

  function saveConsent(nextConsent) {
    setConsent(nextConsent)
    setConsentOpen(false)
    announce('Consent choices saved for this visit only.')
  }

  function continuePrivately() {
    setConsent(EMPTY_CONSENT)
    setConsentOpen(false)
    announce('Continuing without optional data use.')
  }

  function handleAction(post, action) {
    if (!personalizationEnabled) {
      announce('Personalization is off. Your action was not added to the profile.')
      return
    }

    if (action !== 'dismiss' && !consent.activity) {
      announce('Reaction tracking is off. This action was not used to rank your feed.')
      return
    }

    setWeights((current) => applySignal(current, post.topic, action))
    setHistory((current) => [
      { id: `${post.id}-${action}-${Date.now()}`, action: ACTION_LABELS[action], topic: post.topic },
      ...current,
    ])
    announce(`${ACTION_LABELS[action]} ${post.topic}. The feed ranking has changed.`)
  }

  function correctInference(topic) {
    setWeights((current) => resetInference(current, topic))
    announce(`${topic} inference corrected and returned to its starting score.`)
  }

  function deleteSimulationData() {
    setWeights(createInitialWeights())
    setHistory([])
    setConsent(EMPTY_CONSENT)
    setPersonalizationEnabled(true)
    setOpenReason(null)
    setConsentOpen(true)
    announce('All simulation data deleted.')
  }

  function jumpTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="announcement" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      <ConsentDialog
        open={consentOpen}
        current={consent}
        onSave={saveConsent}
        onContinue={continuePrivately}
      />
      <SourcesDrawer open={sourcesOpen} onClose={() => setSourcesOpen(false)} />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="The Feed Is Watching home">
          <span className="brand-eye" aria-hidden="true"><i /></span>
          <span>THE FEED<br /><strong>IS WATCHING</strong></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#feed-lab">Feed lab</a>
          <a href="#chapters">Ethics notebook</a>
          <button type="button" onClick={() => setSourcesOpen(true)}>Sources</button>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="issue-label">A public awareness campaign · Issue No. 01</p>
            <h1>The feed<br /><em>is watching.</em></h1>
            <p className="hero-tagline">Every tap teaches it.<br />Every recommendation shapes you.</p>
            <div className="hero-actions">
              <button className="button button-ink" type="button" onClick={() => jumpTo('feed-lab')}>
                Enter the feed lab <span aria-hidden="true">↓</span>
              </button>
              <button className="scribble-link" type="button" onClick={() => jumpTo('how-it-works')}>
                Start with how it works
              </button>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="scribble scribble-a" />
            <span className="scribble scribble-b" />
            <div className="hero-phone">
              <div className="phone-camera" />
              <div className="phone-post phone-post-one"><i /><b /></div>
              <div className="phone-post phone-post-two"><i /><b /></div>
              <div className="phone-post phone-post-three"><i /><b /></div>
              <span className="tap-heart">♡</span>
            </div>
            <div className="watching-eye"><span /></div>
            <p className="art-note note-one">one harmless tap?</p>
            <p className="art-note note-two">or one more signal?</p>
          </div>
          <div className="hero-disclaimer">
            <span aria-hidden="true">ⓘ</span>
            <p><strong>Fictional educational prototype.</strong> Not affiliated with any social platform. No personal data, cookies, accounts, analytics, or real location are used.</p>
          </div>
        </section>

        <section className="chapter-index" aria-labelledby="index-title">
          <div>
            <p className="pencil-label">Open the notebook anywhere</p>
            <h2 id="index-title">Choose what to investigate</h2>
          </div>
          <div className="index-links">
            {chapters.map((chapter) => (
              <button type="button" key={chapter.id} onClick={() => jumpTo(chapter.id)}>
                <span>{chapter.number}</span>{chapter.title}
              </button>
            ))}
          </div>
        </section>

        <section className="lab-section" id="feed-lab" aria-labelledby="lab-title">
          <header className="section-title lab-title">
            <div>
              <p className="pencil-label">Hands-on experiment</p>
              <h2 id="lab-title">Train a tiny feed.</h2>
            </div>
            <p>Try reactions, watch the ranking change, and inspect the profile growing beside it. Nothing leaves this page.</p>
          </header>

          <div className="lab-layout">
            <div className="feed-shell">
              <div className="feed-toolbar">
                <div className="feed-logo">the <strong>FEED</strong></div>
                <span>For you</span>
                <button type="button" onClick={() => setConsentOpen(true)} aria-label="Open privacy settings">Privacy</button>
              </div>
              <p className="feed-instruction">
                <span aria-hidden="true">↘</span> Your explicit reactions become data only when the relevant permission is on.
              </p>
              <div className="feed-list">
                {explainedPosts.map((post) => (
                  <FeedPost
                    key={post.id}
                    post={post}
                    reasonOpen={openReason === post.id}
                    onAction={handleAction}
                    onReason={(id) => setOpenReason((current) => current === id ? null : id)}
                  />
                ))}
              </div>
            </div>

            <DataShadow
              weights={weights}
              history={history}
              consent={consent}
              personalizationEnabled={personalizationEnabled}
              onCorrect={correctInference}
              onTogglePersonalization={() => {
                setPersonalizationEnabled((current) => !current)
                announce(personalizationEnabled ? 'Personalization turned off.' : 'Personalization turned on.')
              }}
              onEditConsent={() => setConsentOpen(true)}
              onDelete={deleteSimulationData}
            />
          </div>
        </section>

        <section className="chapters" id="chapters" aria-label="Ethics notebook chapters">
          <header className="section-title notebook-title">
            <div>
              <p className="pencil-label">The ethics notebook</p>
              <h2>Look behind the scroll.</h2>
            </div>
            <p>No single panel tells the whole story. Explore the technology, its trade-offs, your rights, and the people responsible for building it.</p>
          </header>
          {chapters.map((chapter) => <Chapter chapter={chapter} key={chapter.id} />)}
        </section>

        <section className="closing-panel" aria-labelledby="closing-title">
          <p className="pencil-label">A promise worth demanding</p>
          <h2 id="closing-title">Explain it. Test it.<br />Protect people.</h2>
          <div className="closing-rule" aria-hidden="true"><span>✦</span></div>
          <p>Give users control. Tell the truth about limits. Stay accountable when the system changes the world outside the screen.</p>
          <button className="button button-paper" type="button" onClick={() => setSourcesOpen(true)}>Read the source notes</button>
        </section>
      </main>

      <footer>
        <div>
          <span className="footer-eye" aria-hidden="true"><i /></span>
          <p><strong>The Feed Is Watching</strong><br />A Professional Ethics awareness campaign.</p>
        </div>
        <p>Designed for public learning · No data collected · <button type="button" onClick={() => setSourcesOpen(true)}>Sources &amp; legal note</button></p>
      </footer>
    </>
  )
}

export default App
