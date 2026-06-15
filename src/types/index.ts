export type Profile = {
  id: string
  full_name: string | null
  sector: string | null
  decision: string | null
  blind_spot: string | null
  created_at: string
}

export type Digest = {
  id: string
  edition: number
  title: string
  published_at: string
  cards?: DigestCard[]
}

export type DigestCard = {
  id: string
  digest_id: string
  source: string
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
