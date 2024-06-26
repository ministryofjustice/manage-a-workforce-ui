import Validator, { ErrorMessages, Rules } from 'validatorjs'

const urlCheck = value => {
  // Regex pattern to match URLs
  const urlPattern = /((https?|ftp|smtp):\/\/|www\.)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/g

  // Match the text against the regex pattern
  const matches = value.match(urlPattern)

  // Check if matches exist
  if (matches) {
    return false
  }
  return true
}

Validator.register('nourl', urlCheck)

export default function validate<T>(
  form: T,
  rules: Rules,
  customMessages: ErrorMessages
): Array<{ text: string; href: string }> {
  Validator.register('nourl', urlValidator)

  const validation = new Validator(form, rules, customMessages)

  return checkErrors(validation)
}

const urlValidator = value => {
  // Regex pattern to match URLs
  const urlPattern = /((https?|ftp|smtp):\/\/|www\.)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/g

  // Match the text against the regex pattern
  const matches = value.match(urlPattern)

  // Check if matches exist
  if (matches) {
    return false
  }
  return true
}

// eslint-disable-next-line no-empty-function
// const passes = () => {}
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
