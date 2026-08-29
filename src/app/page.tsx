import { Hero } from '@/components/home/Hero'
import { Introduction } from '@/components/home/Introduction'
import { SelectedStations } from '@/components/home/SelectedStations'
import { FromHisTorah } from '@/components/home/FromHisTorah'
import { FromTheArchive } from '@/components/home/FromTheArchive'
import { PublicActivity } from '@/components/home/PublicActivity'
import { SelectedGallery } from '@/components/home/SelectedGallery'
import { Voices } from '@/components/home/Voices'
import { PeopleAlongTheWay } from '@/components/home/PeopleAlongTheWay'
import { MemorialInvitation } from '@/components/home/MemorialInvitation'

/**
 * The entrance to the exhibition.
 *
 * Every section reads from the content collections; nothing here is written
 * into the page. Grounds alternate between paper and stone so the page has
 * bands rather than one flat sheet, and the archive band sits on the deep
 * ground — the one lit case in a dim room.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <SelectedStations index={1} />
      <FromHisTorah index={2} />
      <FromTheArchive />
      <PublicActivity index={3} />
      <SelectedGallery index={4} />
      <Voices index={5} />
      <PeopleAlongTheWay index={6} />
      <MemorialInvitation />
    </>
  )
}
