// Validate for redux-form
// https://redux-form.com/7.4.2/docs/api/field.md/#-code-validate-value-allvalues-props-name-gt-error-code-optional-

export const isEmail = (message: string) => (value: any) => {
  // eslint-disable-next-line
  const regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return !regexEmail.test(value) ? message : undefined;
}

export const required = (message: string) => (value: any) => !value ? message : undefined;

export const min = (size: number, message: string) => (value: any) => value && value.length < size ? message : undefined;

export const max = (size: number, message: string) => (value: any) => value && value.length > size ? message : undefined;

export const composeValidators = (...validators: any) => (value: any) =>
  validators.reduce((error: any, validator: any) => error || validator(value), undefined)