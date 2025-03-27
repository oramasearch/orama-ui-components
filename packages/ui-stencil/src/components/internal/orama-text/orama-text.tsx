import { Component, Prop, h, State, Element } from '@stencil/core'
import { getNonExplicitAttributes } from '@/utils/utils'

export interface TextProps {
  /** it defines the HTML tag to be used */
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'small' | 'a'
  /** it defines how it should look like */
  styledAs?: 'p' | 'span' | 'small' | undefined
  /** the optional class name */
  class?: string
  /** optionally change text alignment */
  align?: 'left' | 'center' | 'right'
  /** optionally change variant style - default is primary */
  variant: 'primary' | 'secondary' | 'tertiary'
  /** show as inactive */
  inactive?: boolean
}
@Component({
  tag: 'orama-text',
  styleUrl: 'orama-text.scss',
  scoped: true,
})

/**
 * The OramaText component is used to render a text element with a specific style.
 *
 */
export class OramaText implements TextProps {
  @Element() el: HTMLElement

  @Prop() as?: TextProps['as'] = 'p'
  @Prop() styledAs?: TextProps['styledAs']
  @Prop() bold?: boolean = false
  @Prop() class?: string
  @Prop() align?: TextProps['align']
  @Prop() variant: TextProps['variant'] = 'primary'
  @Prop() inactive?: TextProps['inactive']

  render() {
    const defaultStyle =
      this.styledAs === 'span' || this.styledAs === 'small' || this.styledAs === 'p' ? this.styledAs : this.as

    const Tag = this.as
    const declaredProps = ['as', 'styled-as', 'class']
    const textProps = getNonExplicitAttributes(this.el, declaredProps)

    return (
      <Tag
        class={{
          [defaultStyle]: true,
          [`text-${this.align}`]: !!this.align,
          [`${defaultStyle}-${this.variant}`]: true,
          'text-inactive': !!this.inactive,
          'text-bold': !!this.bold,
          [this.class]: !!this.class,
        }}
        {...textProps}
      >
        <slot />
      </Tag>
    )
  }
}
