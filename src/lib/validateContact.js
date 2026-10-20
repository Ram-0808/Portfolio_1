// Pure contact-form validation — no DOM. Returns { valid, errors }.
//
// Rules (§2.8):
//   name:    required; trim; length 1..80
//   email:   required; matches EMAIL_RE
//   message: required; trim; length 10..1000
//   valid = no error keys

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * @param {{name?:string,email?:string,message?:string}} values
 * @returns {{valid:boolean,errors:{name?:string,email?:string,message?:string}}}
 */
export function validateContact({ name, email, message } = {}) {
  const errors = {}

  const trimmedName = (name || '').trim()
  if (trimmedName.length < 1 || trimmedName.length > 80) {
    errors.name = 'Callsign required (1–80 chars).'
  }

  const trimmedEmail = (email || '').trim()
  if (!EMAIL_RE.test(trimmedEmail)) {
    errors.email = 'Valid frequency (email) required.'
  }

  const trimmedMessage = (message || '').trim()
  if (trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
    errors.message = 'Transmission must be 10–1000 chars.'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

export default validateContact
