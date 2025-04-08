import { Component, Prop, h, Element, Host } from '@stencil/core'
import type { ColorScheme } from '@/types'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowBendDownLeft.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowUp.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowDown.mjs'

@Component({
  tag: 'orama-footer',
  styleUrl: 'orama-footer.scss',
  scoped: true,
})

/**
 * The orama-footer component is used to render a footer element with logo and keyboard shortcuts.
 */
export class OramaFooter {
  @Element() el: HTMLElement

  @Prop() class?: string
  @Prop() colorScheme?: Omit<ColorScheme, 'system'> = 'light'
  /** Whether to show keyboard shortcuts in the footer */
  @Prop() showKeyboardShortcuts?: boolean = false

  private poweredByDestinationUrl: string
  private linkTarget = '_blank'

  /** Keyboard shortcuts to display */
  private keyboardShortcuts = [
    { name: 'select', key: 'Enter', icon: 'arrow-bend-down-left', description: 'to select' },
    { name: 'navigate', key: '↑ ↓', icon: 'arrows-vertical', description: 'to navigate' },
    { name: 'close', key: 'Esc', icon: 'esc', description: 'to close' },
  ]

  componentWillLoad() {
    const utmSource = encodeURIComponent(window.location.hostname)
    this.poweredByDestinationUrl = `https://www.orama.com/?utm_source=${utmSource}&utm_medium=powered-by`
    if (['localhost', 'orama.com'].includes(utmSource)) {
      this.linkTarget = '_parent'
    }
  }

  private renderIcon(shortcut: { name: string; icon: string }) {
    // Special case for ESC key
    if (shortcut.icon === 'esc') {
      return (
        <div>
          <span class="shortcut-icon">
          <span class="esc-text">esc</span>
          </span>
        </div>
      )
    }
    
    // For Phosphor icons
    switch (shortcut.icon) {
      case 'arrow-bend-down-left':
        return (
          <span class="shortcut-icon">
            <ph-arrow-bend-down-left size={16} />
          </span>
        );
      case 'arrows-vertical':
        return (
          <div class="arrows-container">
            <span class="shortcut-icon">
              <ph-arrow-up size={16} />
            </span>
            <span class="shortcut-icon">
              <ph-arrow-down size={16} />
            </span>
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    const imgName = this.colorScheme === 'dark' ? 'orama-when-dark.svg' : 'orama-when-light.svg'
    return (
      <Host>
        {this.showKeyboardShortcuts && (
          <div class="keyboard-shortcuts" aria-label="Keyboard shortcuts">
            {this.keyboardShortcuts.map((shortcut) => (
              <orama-text as="small" variant="tertiary">
                {this.renderIcon(shortcut)}
                <span class="shortcut-description">{shortcut.description}</span>
              </orama-text>
            ))}
          </div>
        )}
        <div class="powered-by">
          <a href={this.poweredByDestinationUrl} target={this.linkTarget} rel="noopener noreferrer" class="logo-link">
            <orama-text as="small">Powered by</orama-text>
            <img
              src={`https://website-assets.oramasearch.com/${imgName}`}
              alt="Powered by Orama"
              class="logo"
              width={62}
            />
          </a>
        </div>
      </Host>
    )
  }
}
