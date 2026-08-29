import { Container } from '@/components/primitives/Container'
import { ButtonLink } from '@/components/primitives/Button'
import { EmptyState } from '@/components/primitives/EmptyState'

export default function NotFound() {
  return (
    <Container width="narrow" className="py-32 text-center">
      <p className="eyebrow numerals">404</p>
      <h1 className="font-display mt-4 text-4xl sm:text-5xl">המוצג לא נמצא</h1>
      <p className="text-ink-soft mt-5">ייתכן שהפריט הועבר, או שהקישור אינו מדויק.</p>

      <EmptyState
        className="mt-12"
        glyph="search"
        size="compact"
        title="מקום שממתין למוצג"
        note="הכתובת הזו אינה מצביעה על פריט בארכיון."
      />

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/" variant="primary" arrow>
          חזרה לעמוד הבית
        </ButtonLink>
        <ButtonLink href="/search">חיפוש בארכיון</ButtonLink>
      </div>
    </Container>
  )
}
