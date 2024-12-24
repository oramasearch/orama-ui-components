import type { Facet } from '@/types'
import { Component, h, Listen, Prop, Watch } from '@stencil/core'

@Component({
  tag: 'orama-facets',
  styleUrl: 'orama-facets.scss',
  scoped: true,
})

/**
 * The orama-facets component renders a list of facets
 */
export class OramaFacets {
  @Prop() facets: Facet[]
  @Prop() selectedFacet: string
  @Prop() selecedFacetChanged: (facetName: string) => void

  private facetListRef!: HTMLUListElement

  handleClick(facet: Facet) {
    this.selecedFacetChanged(facet.name)
  }

  getFacetButtonElementId(facetName: string) {
    return `${facetName}-facet-button`
  }

  setFocusToFacetElement(facetName: string) {
    const buttonList = this.facetListRef.getElementsByTagName('button')

    for (let i = 0; i < buttonList.length; i++) {
      if (buttonList.item(i).id === this.getFacetButtonElementId(facetName)) {
        buttonList.item(i).focus()
        return
      }
    }
  }

  @Watch('selectedFacet')
  handleSelectedFacetChange() {
    this.setFocusToFacetElement(this.selectedFacet?.length ? this.selectedFacet : 'All')
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    if (['ArrowLeft', 'ArrowRight'].includes(ev.key)) {
      const index = this.selectedFacet ? this.facets.findIndex((facet) => facet.name === this.selectedFacet) : 0

      if (ev.key === 'ArrowRight') {
        if (index < this.facets.length - 1) {
          this.selecedFacetChanged(this.facets[index + 1].name)
        } else {
          this.selecedFacetChanged('')
        }
      }

      if (ev.key === 'ArrowLeft') {
        if (index > 1) {
          this.selecedFacetChanged(this.facets[index - 1].name)
        } else if (index - 1 === 0) {
          this.selecedFacetChanged('')
        } else {
          this.selecedFacetChanged(this.facets[this.facets.length - 1].name)
        }
      }
    }
  }

  render() {
    if (!this.facets || this.facets.every((facet) => !facet.count)) {
      return null
    }

    return (
      <ul class="facets-list" ref={(el) => (this.facetListRef = el as HTMLUListElement)}>
        {this.facets?.map((facet) => {
          if (facet?.count === 0) {
            return
          }
          const isSelected = this.selectedFacet === facet?.name || (!this.selectedFacet && facet?.name === 'All')
          return (
            <li key={facet.name} class="facet">
              <button
                id={this.getFacetButtonElementId(facet.name)}
                type="button"
                class={{
                  'facet-button': true,
                  'facet-button--selected': isSelected,
                }}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => this.handleClick(facet)}
              >
                {facet?.name}
                <span class="facet-count">{facet?.count}</span>
              </button>
            </li>
          )
        })}
      </ul>
    )
  }
}
