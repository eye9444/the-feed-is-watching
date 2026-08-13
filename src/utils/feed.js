export const TOPICS = ['music', 'fitness', 'technology', 'news', 'travel', 'gaming']

export function createInitialWeights() {
  return Object.fromEntries(TOPICS.map((topic) => [topic, 1]))
}

export function applySignal(weights, topic, action) {
  const deltas = { like: 2, share: 3, dismiss: -2 }
  if (!(topic in weights) || !(action in deltas)) return weights

  return {
    ...weights,
    [topic]: Math.max(0, weights[topic] + deltas[action]),
  }
}

export function rankPosts(posts, weights, personalizationEnabled = true) {
  if (!personalizationEnabled) return [...posts]

  return posts
    .map((post, originalIndex) => ({ post, originalIndex }))
    .sort((a, b) => {
      const weightDifference = weights[b.post.topic] - weights[a.post.topic]
      return weightDifference || a.originalIndex - b.originalIndex
    })
    .map(({ post }) => post)
}

export function getDiversity(weights, personalizationEnabled = true) {
  if (!personalizationEnabled) {
    return { label: 'Personalization off', ratio: 0, level: 'off' }
  }

  const values = Object.values(weights)
  const total = values.reduce((sum, value) => sum + value, 0)
  const ratio = total === 0 ? 0 : Math.max(...values) / total

  if (ratio > 0.6) return { label: 'Echo risk', ratio, level: 'risk' }
  if (ratio > 0.4) return { label: 'Narrowing', ratio, level: 'warn' }
  return { label: 'Broad mix', ratio, level: 'balanced' }
}

export function resetInference(weights, topic) {
  if (!(topic in weights)) return weights
  return { ...weights, [topic]: 1 }
}
