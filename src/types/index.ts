export type Source = {
  id: string
  name: string
  type: 'newsletter' | 'linkedin' | 'web'
  category: string | null
  url: string | null
  active: boolean
  last_featured_edition: number | null
  frequency: number
}

export type Profile = {
  id: string
  full_name: string | null
  sector: string | null
  decision: string | null
  blind_spot: string | null
  topic: string | null
  created_at: string
}

export type Digest = {
  id: string
  edition: number
  title: string
  published_at: string
  cards?: DigestCard[]
}

export type CardSource = { name: string; url: string }

export type DigestCard = {
  id: string
  digest_id: string
  source: string
  sources: CardSource[]
  title: string
  summary: string
  latent: string | null
  tags: string[]
  claude_score: number | null
  signal: boolean
  horizon: string | null
  position: number
  user_score?: number | null
  is_saved?: boolean
}
