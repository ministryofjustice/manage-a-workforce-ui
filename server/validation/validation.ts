import Validator, { ErrorMessages, Rules } from 'validatorjs'

export default function validate<T>(
  form: T,
  rules: Rules,
  customMessages: ErrorMessages
): Array<{ text: string; href: string }> {
  Validator.register('nourl', urlValidator)

  const validation = new Validator(form, rules, customMessages)

  return checkErrors(validation)
}

const urlValidator = (value, attribute, req) => {
  // Regex pattern to match URLs
  // const urlPattern = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g
  const urlPattern = /fred/

  // Match the text against the regex pattern
  const matches = value.match(urlPattern)

  // Check if matches exist
  // Check if matches exist
  console.log('we are here')
  if (matches) {
    console.log('matched so false')
    return false
  }
  console.log('doesn0t match so true')
  return true
}

// eslint-disable-next-line no-empty-function
const passes = () => {}
// Function to check if text contains links using regex

const checkErrors = <T>(validation: Validator.Validator<T>): Array<{ text: string; href: string }> => {
  validation.check()
  return asErrors(validation.errors)
}

const asErrors = (errors: Validator.Errors) =>
  Object.keys(errors.all()).map(key => {
    const message = errors.first(key) as string
    return { text: message, href: `#${key}` }
  })
