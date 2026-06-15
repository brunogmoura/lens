import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DigestView from '@/components/digest/DigestView'

export default async function AppPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Busca o digest mais recente com os cards
  const { data: digest } = await supabase
    .from('digests')
    .select('*, digest_cards(*)')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle()

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

  // Enriquece os cards com dados do usuário
  const cards = (digest?.digest_cards ?? [])
    .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
    .map((c: { id: string }) => ({
      ...c,
      user_score: userScores[c.id] ?? null,
      is_saved:   userSaved.has(c.id),
    }))

  return (
    <DigestView
      user={{ id: user.id, name: user.user_metadata?.full_name ?? user.email ?? '' }}
      digest={digest ? { ...digest, cards } : null}
    />
  )
}
