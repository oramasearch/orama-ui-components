import { Component, h, Prop, State, Element, Event, type EventEmitter, Watch } from '@stencil/core'

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
  @Prop() closeOnEscape = true
  @Prop() closeOnOutsideClick = true
  @Prop() mainTitle = ''

  @State() activeElement: HTMLElement

  @Event() modalClosed: EventEmitter

  @Element() el: HTMLElement

  originalBodyOverflowState = 'scroll'

  private firstFocusableElement: HTMLElement
  private lastFocusableElement: HTMLElement
  private innerModalRef: HTMLElement

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

  connectedCallback() {
    this.originalBodyOverflowState = document.body.style.overflow

    this.activeElement = document.activeElement as HTMLElement
    this.handleFocus()
    document.body.style.overflow = 'hidden'
  }

  disconnectedCallback() {
    document.body.style.overflow = this.originalBodyOverflowState
  }

  componentDidUpdate() {
    this.handleFocus()
    if (this.activeElement) {
      this.activeElement.focus()
    }
  }

  render() {
    return (
      <dialog
        class={'modal open'}
        aria-modal="true"
        aria-labelledby="modalTitle"
        aria-describedby="modalContent"
        onKeyDown={(event) => {
          switch (event.key) {
            case 'Tab':
              this.trapFocus(event)
              break
            case 'Escape':
              if (this.closeOnEscape) {
                event.preventDefault()
                event.stopPropagation()
                this.modalClosed.emit()
              }
              break
          }
        }}
        onClick={(event) => {
          if (this.innerModalRef && !this.innerModalRef.contains(event.target as Node)) {
            event.stopPropagation()
            event.preventDefault()
            this.modalClosed.emit()
          }
        }}
      >
        <div class="modal-inner" ref={(ref) => (this.innerModalRef = ref)}>
          <h1 id="modalTitle" class="modal-title">
            {this.mainTitle}
          </h1>
          <div id="modalContent" class="modal-content">
            <slot />
          </div>
          <button onClick={() => this.modalClosed.emit()} type="button" class="modal-close">
            Close
          </button>
        </div>
      </dialog>
    )
  }
}
