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
 * The home page is the entrance to the exhibition.
 *
 * Every section reads from the content collections. Nothing here is written
 * into the page: where content has not been supplied the section says so
 * plainly and collapses to a single line, and it opens on its own the moment
 * real items exist. No invented dates, names, roles or quotations appear
 * anywhere, and no stand-in imagery is generated.
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
