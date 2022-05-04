import Validator, { ErrorMessages, Rules } from 'validatorjs'

export default function validate<T>(
  form: T,
  rules: Rules,
  customMessages: ErrorMessages
): Array<{ text: string; href: string }> {
  const validation = new Validator(form, rules, customMessages)

  return checkErrors(validation)
}

const checkErrors = <T>(validation: Validator.Validator<T>): Array<{ text: string; href: string }> => {
  validation.check()
  return asErrors(validation.errors)
}

const asErrors = (errors: Validator.Errors) =>
  Object.keys(errors.all()).map(key => {
    const message = errors.first(key) as string
    return { text: message, href: `#${key}` }
  })
