const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const unescapeApostrophe = (name?: string): string | null => {
  if (!name) return null

  return name.replace('&#39;', "'")
}

type HasPersonWithEmail = {
  person?: Array<{ email?: string }>
}

export function filterEmptyEmails<T extends HasPersonWithEmail>(form: T): T {
  return {
    ...form,
    person: form.person?.filter(person => person.email),
  }
}

/**
 * Converts a validator-style string like "person.0.email" to "person[0][email]"
 */
export function toArrayNotation(href: string): string {
  return href.split('.').reduce((acc, text) => `${acc}[${text}]`)
}

/**
 * Converts an object { text, href } and fixes the href to array notation
 */
export function fixupArrayNotation({ text, href }: { text: string; href: string }) {
  return { text, href: toArrayNotation(href) }
}
