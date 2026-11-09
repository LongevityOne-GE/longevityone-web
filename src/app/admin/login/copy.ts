/**
 * Admin login copy, shown in both languages at once.
 *
 * The admin screens are internal and not managed in Sanity, so this is a small
 * local map rather than CMS content. Both languages are rendered together
 * because the login page has no locale of its own and its users read either.
 */
export interface BilingualText {
  ka: string
  en: string
}

export const LOGIN_COPY = {
  linkFailed: {
    ka: 'შესვლა ვერ მოხერხდა. ბმულს შესაძლოა ვადა გაუვიდა, უკვე გამოყენებულია, ან გაიხსნა სხვა ბრაუზერში და არა იმაში, სადაც მოითხოვეთ. მოითხოვეთ ახალი ბმული ქვემოთ. თუ პრობლემა განმეორდა, შესაძლოა ამ მისამართს ჯერ არ აქვს წვდომა.',
    en: "We couldn't sign you in. The link may have expired, already been used, or been opened in a different browser from the one you requested it in. Request a new link below. If this keeps happening, this address may not have access yet.",
  },
  sameBrowser: {
    ka: 'ბმული გახსენით იმავე ბრაუზერში, სადაც მოითხოვეთ. ტელეფონის ელფოსტის აპლიკაციიდან ან სხვა ბრაუზერიდან გახსნისას შესვლა ვერ მოხერხდება.',
    en: 'Open the link in the same browser you requested it from. Opening it from a phone mail app or another browser will not sign you in.',
  },
} satisfies Record<string, BilingualText>
