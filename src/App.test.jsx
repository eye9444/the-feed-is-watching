import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

describe('The Feed Is Watching campaign', () => {
  it('asks for granular consent with every optional choice off', () => {
    render(<App />)

    expect(screen.getByRole('dialog', { name: /your choices should come first/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /use reactions to personalize/i })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: /use approximate location/i })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: /create inferred interest labels/i })).not.toBeChecked()
    expect(screen.getByRole('button', { name: /continue without optional data/i })).toBeVisible()
  })

  it('allows full campaign access when optional data is refused', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /continue without optional data/i }))

    expect(screen.queryByRole('dialog', { name: /your choices should come first/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /train a tiny feed/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /how a feed learns/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /engineers make ethical choices/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /trust must be earned in public/i })).toBeInTheDocument()
  })

  it('uses an authorized like to update ranking signals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('checkbox', { name: /use reactions to personalize/i }))
    await user.click(screen.getByRole('checkbox', { name: /create inferred interest labels/i }))
    await user.click(screen.getByRole('button', { name: /save my choices/i }))

    const musicPost = screen.getByTestId('post-music-rain')
    await user.click(within(musicPost).getByRole('button', { name: /like/i }))

    expect(screen.getByTestId('weight-music')).toHaveTextContent('3')
    expect(within(musicPost).queryByText(/score 3/i)).not.toBeInTheDocument()
    expect(screen.getByText(/likely interested in music/i)).toBeInTheDocument()
  })

  it('explains a recommendation without changing its score', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /continue without optional data/i }))
    const musicPost = screen.getByTestId('post-music-rain')
    const reasonButton = within(musicPost).getByRole('button', { name: /why this/i })

    await user.click(reasonButton)
    expect(reasonButton).toHaveAttribute('aria-expanded', 'true')
    expect(within(musicPost).getByText(/reaction tracking is off/i)).toBeInTheDocument()
    expect(screen.getByTestId('weight-music')).toHaveTextContent('1')
  })

  it('deletes the simulation and reopens consent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /continue without optional data/i }))
    await user.click(screen.getByRole('button', { name: /delete my simulation data/i }))

    expect(screen.getByRole('dialog', { name: /your choices should come first/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /use reactions to personalize/i })).not.toBeChecked()
  })

  it('automatically dismisses status notifications', () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /continue without optional data/i }))

    act(() => vi.advanceTimersByTime(20))
    expect(screen.getByRole('status')).toHaveTextContent(/continuing without optional data use/i)

    act(() => vi.advanceTimersByTime(3200))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    vi.useRealTimers()
  })
})
