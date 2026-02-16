import Validator, { ErrorMessages, Rules } from 'validatorjs'

Validator.register(
  'nourl',
  value =>
    !/((https?|ftp|smtp):\/\/|www\.)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/g.test(value),
)

Validator.register('crn', value => /^([a-z]|[A-Z]){1}[0-9]{6}$/g.test(value))

export default function validate<T>(
  form: T,
  rules: Rules,
  customMessages: ErrorMessages,
): Array<{ text: string; href: string }> {
  const validation = new Validator(form, rules, customMessages)
  const errors = checkErrors(validation)
  return errors
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
