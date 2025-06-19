import { Component, Host, Prop, h, Element, State, Event, Watch, type EventEmitter } from '@stencil/core'
import '@phosphor-icons/webcomponents/dist/icons/PhX.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhMagnifyingGlass.mjs'
import { getNonExplicitAttributes } from '@/utils/utils'

type BaseInputProps = {
  name?: string
  size?: 'small' | 'medium' | 'large'
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  defaultValue?: string
}

type ConditionalInputProps =
  | {
      label: string
      labelForScreenReaders?: never
    }
  | {
      label?: never
      labelForScreenReaders?: string
    }

export type InputProps = BaseInputProps & ConditionalInputProps

@Component({
  tag: 'orama-input',
  styleUrl: 'orama-input.scss',
  scoped: true,
})
export class Input {
  @Element() el: HTMLDivElement

  @Prop() name: InputProps['name']
  @Prop() size?: InputProps['size'] = 'medium'
  @Prop() label?: InputProps['label']
  @Prop() type?: InputProps['type'] = 'text'
  @Prop() placeholder?: InputProps['placeholder']
  @Prop() labelForScreenReaders?: InputProps['labelForScreenReaders']
  @Prop() defaultValue: InputProps['defaultValue']
  @Prop() autoFocus?: boolean = false
  @Prop() value?: string

  @Event() inputChanged: EventEmitter<string>

  private inputRef!: HTMLInputElement

  @Event({
    eventName: 'resetValue',
    composed: true,
    cancelable: true,
    bubbles: true,
  })

  @Watch('autoFocus')
  handleAutoFocusChange() {
    if (this.autoFocus) {
      this.inputRef?.focus()
    }
  }

  ensureFocus() {
    const checkRefInterval = setInterval(() => {
      if (this.inputRef) {
        this.inputRef.focus()
        clearInterval(checkRefInterval)
      }
    }, 10)
  }
  componentDidLoad() {
    if (this.autoFocus) {
      this.ensureFocus()
    }
  }

  render() {
    const inputClass = `input input--${this.size}`
    const labelClass = `label ${this.labelForScreenReaders ? 'sr-only' : ''}`

    const declaredProps = [
      'id',
      'name',
      'type',
      'class',
      'onInput',
      'value',
      'label-for-screen-readers',
      'default-value',
      'placeholder',
    ]
    const inputProps = getNonExplicitAttributes(this.el, declaredProps)

    const isSearch = this.type === 'search'

    return (
      <Host>
        <div class="wrapper">
          <label htmlFor={this.name} class={labelClass}>
            {this.label || this.labelForScreenReaders}
          </label>
          <div class="input-wrapper">
            {isSearch && (
              <span class="search-icon">
                <ph-magnifying-glass size={16} />
              </span>
            )}
            <input
              {...inputProps}
              ref={(el) => {
                this.inputRef = el as HTMLInputElement
              }}
              class={inputClass}
              id={this.name}
              type={this.type}
              value={this.value}
              onInput={(event) => {
                const target = event.target as HTMLInputElement
                this.inputChanged.emit(target.value)
              }}
              placeholder={this.placeholder}
            />
            {isSearch && !!this.value && (
              <button
                type="button"
                class="reset-button"
                onClick={() => {
                  if (this.inputRef) {
                    this.inputRef.value = ''
                  }
                  this.inputChanged.emit('')
                  this.inputRef?.focus()
                }}
              >
                <ph-x size={16} />
              </button>
            )}
          </div>
        </div>
      </Host>
    )
  }
}
