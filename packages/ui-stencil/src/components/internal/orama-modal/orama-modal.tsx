import { Component, h, Prop, State, Listen, Element, Event, type EventEmitter, Watch } from '@stencil/core'

export type ModalStatus = {
  open: boolean
  id: HTMLElement
}
@Component({
  tag: 'orama-modal',
  styleUrl: 'orama-modal.scss',
  scoped: true,
})
export class OramaModal {
  @Prop() open = false
  @Prop() closeOnEscape = true
  @Prop() closeOnOutsideClick = true
  @Prop() mainTitle = ''

  @State() activeElement: HTMLElement
  @State() modalIsOpen = this.open

  @Event() modalStatusChanged: EventEmitter<ModalStatus>

  @Element() el: HTMLElement

  originalBodyOverflowState = 'scroll'

  private firstFocusableElement: HTMLElement
  private lastFocusableElement: HTMLElement
  private innerModalRef: HTMLElement

  @Listen('keydown', { target: 'document' })
  handleKeyDown(ev: KeyboardEvent) {
    if (this.modalIsOpen) {
      switch (ev.key) {
        case 'Tab':
          this.trapFocus(ev)
          break
        case 'Escape':
          if (this.closeOnEscape) {
            ev.preventDefault()
            ev.stopPropagation()
            this.closeModal()
          }
          break
      }
    }
  }

  @Watch('modalIsOpen')
  handleOpenChange(newValue: boolean) {
    this.modalStatusChanged.emit({
      open: newValue,
      id: this.el,
    })

    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = this.originalBodyOverflowState
    }
  }

  @Watch('open')
  handleOpenPropChange(newValue: boolean) {
    this.modalIsOpen = newValue
  }

  private trapFocus(event: KeyboardEvent) {
    const focusableElements = this.el.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
    )
    const focusableArray = (Array.from(focusableElements) as HTMLElement[]).filter(
      (element) => element.offsetParent !== null,
    )

    if (focusableArray.length > 0) {
      this.firstFocusableElement = focusableArray[0]
      this.lastFocusableElement = focusableArray[focusableArray.length - 1]

      const focusedElement = this.el.querySelector(':focus') as HTMLElement

      if (event.shiftKey && focusedElement === this.firstFocusableElement) {
        event.preventDefault()
        this.lastFocusableElement.focus()
      } else if (!event.shiftKey && focusedElement === this.lastFocusableElement) {
        event.preventDefault()
        this.firstFocusableElement.focus()
      }
    }
  }

  private handleFocus() {
    const focusableElements = this.el.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
    )
    const focusableArray = (Array.from(focusableElements) as HTMLElement[]).filter(
      (element) => element.offsetParent !== null,
    )

    if (focusableArray.length > 0) {
      focusableArray[0].focus()
    }
  }

  disconnectedCallback() {
    this.modalIsOpen = false
  }

  private closeModal() {
    this.modalIsOpen = false
  }

  componentDidLoad() {
    this.originalBodyOverflowState = document.body.style.overflow

    if (this.modalIsOpen) {
      this.activeElement = document.activeElement as HTMLElement
      this.handleFocus()
      document.body.style.overflow = 'hidden'
    }
    this.el.addEventListener('click', (event) => {
      if (this.innerModalRef && !this.innerModalRef.contains(event.target as Node)) {
        event.stopPropagation()
        event.preventDefault()
        this.closeModal()
      }
    })
  }

  componentDidUpdate() {
    if (this.modalIsOpen) {
      this.handleFocus()
    } else if (this.activeElement) {
      this.activeElement.focus()
    }
  }

  render() {
    if (!this.modalIsOpen) {
      return null
    }

    return (
      <dialog
        class={`modal ${this.modalIsOpen ? 'open' : ''}`}
        aria-modal="true"
        aria-labelledby="modalTitle"
        aria-describedby="modalContent"
      >
        <div class="modal-inner" ref={(ref) => (this.innerModalRef = ref)}>
          <h1 id="modalTitle" class="modal-title">
            {this.mainTitle}
          </h1>
          <div id="modalContent" class="modal-content">
            <slot />
          </div>
          <button onClick={() => this.closeModal()} type="button" class="modal-close">
            Close
          </button>
        </div>
      </dialog>
    )
  }
}
