import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DigestView from '@/components/digest/DigestView'

export default async function AppPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Lê last_seen_at e grava timestamp da visita atual atomicamente
  const now = new Date().toISOString()
  const { data: profile } = await supabase
    .from('profiles')
    .select('last_seen_at')
    .eq('id', user.id)
    .maybeSingle()

  const lastSeenAt: string | null = profile?.last_seen_at ?? null

  await supabase
    .from('profiles')
    .update({ last_seen_at: now })
    .eq('id', user.id)

  // Busca todos os digests para o histórico (ordenados do mais recente)
  const { data: allDigestsRaw } = await supabase
    .from('digests')
    .select('*, digest_cards(*)')
    .order('published_at', { ascending: false })
    .limit(20)

  const allDigests = allDigestsRaw ?? []

  // Digest mais recente (topo do histórico)
  const digest = allDigests[0] ?? null

  // Busca scores e salvos do usuário para os cards desta edição
  let userScores: Record<string, number> = {}
  let userSaved: Set<string> = new Set()

  if (digest?.digest_cards?.length) {
    const cardIds = digest.digest_cards.map((c: { id: string }) => c.id)

    const [{ data: scores }, { data: saved }] = await Promise.all([
      supabase.from('user_scores').select('card_id, score').eq('user_id', user.id).in('card_id', cardIds),
      supabase.from('user_saved').select('card_id').eq('user_id', user.id).in('card_id', cardIds),
    ])

    userScores = Object.fromEntries((scores ?? []).map((s: { card_id: string; score: number }) => [s.card_id, s.score]))
    userSaved  = new Set((saved ?? []).map((s: { card_id: string }) => s.card_id))
  }

  // Enriquece os cards do digest atual com dados do usuário
  const cards = (digest?.digest_cards ?? [])
    .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
    .map((c: { id: string }) => ({
      ...c,
      user_score: userScores[c.id] ?? null,
      is_saved:   userSaved.has(c.id),
    }))

  // Normaliza todos os digests para o histórico (cards ordenados por posição)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allDigestsNormalized = allDigests.map((d: any) => ({
    ...d,
    cards: (d.digest_cards ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position),
  }))

  // Busca sources e computa frequência (aparições nas últimas 5 edições)
  const { data: sourcesRaw } = await supabase
    .from('sources')
    .select('*')
    .eq('active', true)
    .order('type')
    .order('name')

  const last5Editions = allDigests.slice(0, 5)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sources = (sourcesRaw ?? []).map((s: any) => {
    const frequency = last5Editions.filter((d: any) =>
      (d.digest_cards ?? []).some((c: any) => c.source_id === s.id)
    ).length
    return { ...s, frequency }
  })

  return (
    <DigestView
      user={{ id: user.id, name: user.user_metadata?.full_name ?? user.email ?? '' }}
      digest={digest ? { ...digest, cards } : null}
      allDigests={allDigestsNormalized}
      lastSeenAt={lastSeenAt}
      sources={sources}
    />
  )
}
