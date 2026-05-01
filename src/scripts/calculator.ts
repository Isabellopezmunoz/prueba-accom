import { setupInlineValidation } from "./inline-validation"

const STORAGE_KEY = "calculator-state"

export const setupCalculator = (form: HTMLFormElement) => {
  setupInlineValidation(form)

  const steps = Array.from(
    form.querySelectorAll<HTMLElement>("section[data-step]")
  )
  let currentIndex = 0

  const showStep = (index: number) => {
    steps.forEach((step, stepIndex) => {
      step.hidden = stepIndex !== index
    })
    currentIndex = index
    window.scrollTo({ top: 0, behavior: "smooth" })
    saveState()
  }

  const saveState = () => {
    const data = new FormData(form)
    const state = {
      intent: data.get("intent"),
      appliances: data.getAll("appliances"),
      usageTime: data.get("usage-time"),
      phone: (form.elements.namedItem("calc-phone") as HTMLInputElement | null)
        ?.value,
      postalCode: (form.elements.namedItem("calc-postal-code") as HTMLInputElement | null)
        ?.value,
      privacy: (form.elements.namedItem("calc-privacy") as HTMLInputElement | null)
        ?.checked,
      currentIndex,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  const restoreState = () => {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const state = JSON.parse(raw)
      if (state.intent) {
        const intent = form.querySelector<HTMLInputElement>(
          `input[name='intent'][value='${state.intent}']`
        )
        if (intent) intent.checked = true
      }
      if (Array.isArray(state.appliances)) {
        state.appliances.forEach((value: string) => {
          const checkbox = form.querySelector<HTMLInputElement>(
            `input[name='appliances'][value='${value}']`
          )
          if (checkbox) checkbox.checked = true
        })
      }
      if (state.usageTime) {
        const usage = form.querySelector<HTMLInputElement>(
          `input[name='usage-time'][value='${state.usageTime}']`
        )
        if (usage) usage.checked = true
      }
      const phone = form.elements.namedItem("calc-phone") as HTMLInputElement | null
      if (phone && state.phone) phone.value = state.phone
      const postal = form.elements.namedItem("calc-postal-code") as HTMLInputElement | null
      if (postal && state.postalCode) postal.value = state.postalCode
      const privacy = form.elements.namedItem("calc-privacy") as HTMLInputElement | null
      if (privacy && state.privacy) privacy.checked = true
      if (typeof state.currentIndex === "number") {
        showStep(Math.max(0, Math.min(steps.length - 1, state.currentIndex)))
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  const intentParam = new URLSearchParams(window.location.search).get("intent")
  if (intentParam) {
    sessionStorage.removeItem(STORAGE_KEY)
    const intent = form.querySelector<HTMLInputElement>(
      `input[name='intent'][value='${intentParam}']`
    )
    if (intent) {
      intent.checked = true
      showStep(1)
    }
    window.history.replaceState({}, "", window.location.pathname)
  } else {
    restoreState()
  }
  form.addEventListener("change", saveState)
  form.addEventListener("input", saveState)

  const advanceFromStep1 = () => {
    const intent = form.querySelector<HTMLInputElement>(
      "input[name='intent']:checked"
    )
    if (intent) showStep(1)
  }

  const advanceFromStep3 = () => {
    const usage = form.querySelector<HTMLInputElement>(
      "input[name='usage-time']:checked"
    )
    if (usage) showStep(3)
  }

  form.addEventListener("click", (event) => {
    const target = event.target as HTMLElement
    if (!(target instanceof HTMLInputElement)) return
    if (target.type !== "radio") return
    if (target.name === "intent" && currentIndex === 0) {
      advanceFromStep1()
    }
    if (target.name === "usage-time" && currentIndex === 2) {
      advanceFromStep3()
    }
  })

  form.querySelectorAll<HTMLButtonElement>("[data-action='back']").forEach(
    (button) =>
      button.addEventListener("click", () => {
        if (currentIndex > 0) showStep(currentIndex - 1)
      })
  )

  const appliancesError = document.getElementById("appliances-error")
  const appliancesErrorText = appliancesError?.querySelector<HTMLElement>(
    "[data-field-error-text]"
  )

  const hasAppliancesSelected = () =>
    form.querySelectorAll<HTMLInputElement>(
      "input[name='appliances']:checked"
    ).length > 0

  form.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement
    if (target?.name === "appliances" && hasAppliancesSelected() && appliancesError) {
      appliancesError.dataset.visible = "false"
    }
  })

  form.querySelectorAll<HTMLButtonElement>("[data-action='next']").forEach(
    (button) =>
      button.addEventListener("click", () => {
        if (
          button.dataset.stepTarget === "2" &&
          !hasAppliancesSelected()
        ) {
          if (appliancesError && appliancesErrorText) {
            appliancesErrorText.textContent =
              "Selecciona al menos un electrodoméstico para continuar."
            appliancesError.dataset.visible = "true"
          }
          return
        }
        if (currentIndex < steps.length - 1) showStep(currentIndex + 1)
      })
  )

  let lastResultStatus: "success" | "error" | null = null

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    const modal = document.getElementById("contact-modal")
    if (!modal) return

    const status: "success" | "error" =
      Math.random() < 0.8 ? "success" : "error"
    lastResultStatus = status
    form.dataset.active = "true"
    modal.dispatchEvent(
      new CustomEvent("modal:open-result", {
        detail: { status, source: "calculator" },
      })
    )
    modal.dispatchEvent(new Event("modal:open"))
  })

  const modal = document.getElementById("contact-modal")

  modal?.addEventListener("modal:closed", () => {
    if (form.dataset.active !== "true") return
    if (lastResultStatus === "success") {
      sessionStorage.removeItem(STORAGE_KEY)
      window.location.href = "/"
    }
    lastResultStatus = null
    delete form.dataset.active
  })

  modal?.addEventListener("modal:retry", () => {
    if (form.dataset.active !== "true") return
    modal.dispatchEvent(new Event("modal:close"))
    form.requestSubmit()
  })
}
