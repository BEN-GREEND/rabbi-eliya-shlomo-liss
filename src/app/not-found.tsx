import Link from 'next/link'
import { Container } from '@/components/primitives/Container'

export default function NotFound() {
  return (
    <Container width="narrow" className="py-32 text-center">
      <p className="label-caps text-brass">404</p>
      <h1 className="font-display mt-4 text-4xl">המוצג לא נמצא</h1>
      <p className="text-ink-soft mt-5">ייתכן שהפריט הועבר, או שהקישור אינו מדויק.</p>
      <Link
        href="/"
        className="label-caps border-brass mt-10 inline-block border-b pb-1 no-underline"
      >
        חזרה לעמוד הבית
      </Link>
    </Container>
  )
}
