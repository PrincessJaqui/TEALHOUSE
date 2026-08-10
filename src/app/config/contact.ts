/**
 * Contact details, in one place.
 *
 * Everything here used to be typed directly into fourteen page files, and all
 * of it was fabricated by the original export:
 *
 *   - Fifteen addresses on tealhouse.com, a domain you do not appear to own.
 *     Your domains are tealhouse.us and tealhouseinc.com, so every one of
 *     those addresses would have bounced or, worse, reached whoever does own
 *     tealhouse.com.
 *   - Four phone numbers. Three used the 555 prefix, which is reserved for
 *     fiction, and the fourth was an invented vanity number.
 *   - Four showroom addresses in Milan, New York, Los Angeles and Kansas City.
 *
 * Anything set to null below is simply not rendered. No placeholder text, no
 * invented stand-in. Fill a value in and it appears everywhere it belongs.
 */

/** The one address that reaches you. Split it into departments when ready. */
const PRIMARY_EMAIL = 'hello@TealHouseInc.com';

export const CONTACT = {
  /**
   * Departmental inboxes. They all point at the primary address for now,
   * so nothing on the site sends a customer somewhere that does not exist.
   * Change any single one once the real inbox is live.
   */
  clientServices: PRIMARY_EMAIL,
  press: PRIMARY_EMAIL,
  wholesale: PRIMARY_EMAIL,
  careers: PRIMARY_EMAIL,
  returns: PRIMARY_EMAIL,
  bespoke: PRIMARY_EMAIL,
  shopping: PRIMARY_EMAIL,
  appointments: PRIMARY_EMAIL,
  care: PRIMARY_EMAIL,
  ethics: PRIMARY_EMAIL,
  legal: PRIMARY_EMAIL,
  privacy: PRIMARY_EMAIL,
  dpo: PRIMARY_EMAIL,
  unsubscribe: PRIMARY_EMAIL,

  /**
   * A scheduling page such as Calendly or Cal.com. Set this and the Zoom
   * option on the landing page links straight to it. Left empty, that option
   * goes to the request form, which emails the house.
   */
  appointmentUrl: '' as string,

  /** Set to a real number to make phone lines appear across the site. */
  phone: null as string | null,

  /** Set to a real postal address to make the legal mailing lines appear. */
  mailingAddress: null as string | null,
} as const;

export interface Showroom {
  city: string;
  lines: string[];
  phone?: string;
}

/**
 * Empty on purpose. The Locations section on Contact Us hides itself while
 * this is empty rather than listing showrooms that do not exist. Add real
 * ones here and the section returns.
 */
export const SHOWROOMS: Showroom[] = [];

export const SOCIAL = {
  instagram: 'https://www.instagram.com/tealhouse.us',
  facebook: 'https://www.facebook.com/tealhouse.shoes/',
  linkedin: 'https://www.linkedin.com/company/tealhouse',
  youtube: null as string | null,
} as const;
