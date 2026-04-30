import type { FormField } from "../types/forms"

const messages = {
  valueMissing: {
    checkbox: "Debes aceptar para continuar.",
    tel: "Introduce un teléfono de contacto.",
    text: "Este campo es obligatorio.",
    default: "Este campo es obligatorio.",
  },
  patternMismatch: {
    "postal-code": "Introduce un código postal de 5 dígitos.",
    tel: "Introduce un teléfono válido.",
    default: "El formato no es válido.",
  },
  typeMismatch: {
    email: "Introduce un email válido.",
    default: "El formato no es válido.",
  },
  tooShort: { default: "Es demasiado corto." },
} as const

const messageFor = (field: FormField) => {
  const validity = field.validity
  if (validity.valueMissing) {
    if (field instanceof HTMLInputElement && field.type === "checkbox") {
      return messages.valueMissing.checkbox
    }
    if (field instanceof HTMLInputElement && field.type === "tel") {
      return messages.valueMissing.tel
    }
    return messages.valueMissing.default
  }
  if (validity.patternMismatch) {
    if (field.getAttribute("autocomplete") === "postal-code") {
      return messages.patternMismatch["postal-code"]
    }
    if (field instanceof HTMLInputElement && field.type === "tel") {
      return messages.patternMismatch.tel
    }
    return messages.patternMismatch.default
  }
  if (validity.typeMismatch) {
    if (field instanceof HTMLInputElement && field.type === "email") {
      return messages.typeMismatch.email
    }
    return messages.typeMismatch.default
  }
  if (validity.tooShort) return messages.tooShort.default
  return ""
}

const errorElementFor = (field: FormField) => {
  const id = field.getAttribute("aria-describedby") ?? `${field.id}-error`
  return document.getElementById(id)
}

const showError = (field: FormField) => {
  const message = messageFor(field)
  const element = errorElementFor(field)
  if (!element) return
  const text = element.querySelector<HTMLElement>("[data-field-error-text]")
  if (text) text.textContent = message
  element.dataset.visible = message ? "true" : "false"
  field.setAttribute("aria-invalid", message ? "true" : "false")
}

const clearError = (field: FormField) => {
  const element = errorElementFor(field)
  if (element) element.dataset.visible = "false"
  field.setAttribute("aria-invalid", "false")
}

export const setupInlineValidation = (form: HTMLFormElement) => {
  form.setAttribute("novalidate", "")
  const fields = Array.from(
    form.querySelectorAll<FormField>("input, select, textarea")
  )

  fields.forEach((field) => {
    field.addEventListener("invalid", (event) => {
      event.preventDefault()
      showError(field)
    })
    const clearOn = field.type === "checkbox" || field.type === "radio" ? "change" : "input"
    field.addEventListener(clearOn, () => {
      if (field.checkValidity()) clearError(field)
      else if (field.getAttribute("aria-invalid") === "true") showError(field)
    })
  })

  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopImmediatePropagation()
      fields.forEach((field) => {
        if (!field.checkValidity()) showError(field)
      })
      const firstInvalid = fields.find((field) => !field.checkValidity())
      firstInvalid?.focus()
    }
  })
}
