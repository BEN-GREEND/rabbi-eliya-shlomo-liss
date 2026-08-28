/** Navigation, derived from the collections plus the standalone pages. */
export interface NavLink {
  href: string
  label: string
}

export const PRIMARY_NAV: NavLink[] = [
  { href: '/timeline', label: 'תולדות חייו' },
  { href: '/torah', label: 'מתורתו' },
  { href: '/activities', label: 'פעילותו' },
  { href: '/gallery', label: 'גלריה' },
  { href: '/archive', label: 'ארכיון' },
  { href: '/people', label: 'אישים' },
  { href: '/testimonies', label: 'עדויות' },
  { href: '/family', label: 'משפחה' },
]

export const MEMORIAL_LINK: NavLink = { href: '/memorial', label: 'נר הזכרון' }
