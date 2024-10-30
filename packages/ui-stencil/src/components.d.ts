/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ButtonProps } from "./components/internal/orama-button/orama-button";
import { CloudIndexConfig, ColorScheme, ResultMap, SearchResult, SearchResultBySection, SourcesMap } from "./types/index";
import { TChatInteraction } from "./context/chatContext";
import { OramaClient } from "@oramacloud/client";
import { Facet } from "./components/internal/orama-facets/orama-facets";
import { InputProps } from "./components/internal/orama-input/orama-input";
import { ModalStatus } from "./components/internal/orama-modal/orama-modal";
import { HighlightOptions } from "@orama/highlight";
import { TThemeOverrides } from "./config/theme";
import { AnyOrama, Orama, SearchParams } from "@orama/orama";
import { TThemeOverrides as TThemeOverrides1 } from "./components.d";
import { SearchResultsProps } from "./components/internal/orama-search-results/orama-search-results";
import { TextProps } from "./components/internal/orama-text/orama-text";
export { ButtonProps } from "./components/internal/orama-button/orama-button";
export { CloudIndexConfig, ColorScheme, ResultMap, SearchResult, SearchResultBySection, SourcesMap } from "./types/index";
export { TChatInteraction } from "./context/chatContext";
export { OramaClient } from "@oramacloud/client";
export { Facet } from "./components/internal/orama-facets/orama-facets";
export { InputProps } from "./components/internal/orama-input/orama-input";
export { ModalStatus } from "./components/internal/orama-modal/orama-modal";
export { HighlightOptions } from "@orama/highlight";
export { TThemeOverrides } from "./config/theme";
export { AnyOrama, Orama, SearchParams } from "@orama/orama";
export { TThemeOverrides as TThemeOverrides1 } from "./components.d";
export { SearchResultsProps } from "./components/internal/orama-search-results/orama-search-results";
export { TextProps } from "./components/internal/orama-text/orama-text";
export namespace Components {
    interface OramaButton {
        "as"?: ButtonProps['as'];
        "class"?: string;
        "disabled"?: boolean;
        "size": 'small' | 'medium' | 'large';
        "type"?: ButtonProps['type'];
        "variant"?: ButtonProps['variant'];
        "withTooltip"?: string;
    }
    interface OramaChat {
        "defaultTerm"?: string;
        "focusInput"?: boolean;
        "linksRel"?: string;
        "linksTarget"?: string;
        "placeholder"?: string;
        "showClearChat"?: boolean;
        "sourceBaseUrl"?: string;
        "sourcesMap"?: SourcesMap;
        "suggestions"?: string[];
        "systemPrompts"?: string[];
    }
    interface OramaChatAssistentMessage {
        "interaction": TChatInteraction;
    }
    interface OramaChatBox {
        "autoFocus": boolean;
        "clientInstance"?: OramaClient;
        "index"?: CloudIndexConfig;
        "linksRel"?: string;
        "linksTarget"?: string;
        "placeholder"?: string;
        "sourceBaseUrl"?: string;
        "sourcesMap"?: SourcesMap;
        "suggestions"?: string[];
        "systemPrompts"?: string[];
    }
    interface OramaChatButton {
        "active"?: boolean;
        "class"?: string;
        "highlight"?: boolean;
        "label": string;
    }
    interface OramaChatMessagesContainer {
        "interactions": TChatInteraction[];
    }
    interface OramaChatUserMessage {
        "interaction": TChatInteraction;
    }
    interface OramaDotsLoader {
    }
    interface OramaEmbed {
    }
    interface OramaFacets {
        "facetClicked": (facetName: string) => void;
        "facets": Facet[];
        "selectedFacet": string;
    }
    interface OramaFooter {
        "class"?: string;
        "colorScheme"?: Omit<ColorScheme, 'system'>;
    }
    interface OramaInput {
        "autoFocus"?: boolean;
        "defaultValue": InputProps['defaultValue'];
        "label"?: InputProps['label'];
        "labelForScreenReaders"?: InputProps['labelForScreenReaders'];
        "name": InputProps['name'];
        "placeholder"?: InputProps['placeholder'];
        "size"?: InputProps['size'];
        "type"?: InputProps['type'];
    }
    interface OramaLogoIcon {
        "size": number;
    }
    interface OramaMarkdown {
        "content": string;
    }
    interface OramaModal {
        "closeOnEscape": boolean;
        "closeOnOutsideClick": boolean;
        "mainTitle": string;
        "open": boolean;
    }
    interface OramaNavigationBar {
        "handleClose": () => void;
        "showBackButton": boolean;
        "showChatActions": boolean;
    }
    interface OramaSearch {
        "disableChat"?: boolean;
        "focusInput"?: boolean;
        "highlightDescription"?: HighlightOptions | false;
        "highlightTitle"?: HighlightOptions | false;
        "linksRel"?: string;
        "linksTarget"?: string;
        "placeholder"?: string;
        "sourceBaseUrl"?: string;
        "suggestions"?: string[];
    }
    interface OramaSearchBox {
        "chatPlaceholder"?: string;
        "clientInstance"?: OramaClient;
        "colorScheme"?: ColorScheme;
        "disableChat"?: boolean;
        "facetProperty"?: string;
        "highlightDescription"?: HighlightOptions | false;
        "highlightTitle"?: HighlightOptions | false;
        "index"?: CloudIndexConfig;
        "layout"?: 'modal' | 'embed';
        "linksRel"?: string;
        "linksTarget"?: string;
        "open": boolean;
        "placeholder"?: string;
        "resultMap"?: Partial<ResultMap>;
        "searchParams"?: SearchParams<Orama<AnyOrama | OramaClient>>;
        "searchPlaceholder"?: string;
        "sourceBaseUrl"?: string;
        "sourcesMap"?: SourcesMap;
        "suggestions"?: string[];
        "themeConfig"?: Partial<TThemeOverrides>;
    }
    interface OramaSearchButton {
        "colorScheme"?: ColorScheme;
        "size": 'small' | 'medium' | 'large';
        "themeConfig"?: Partial<TThemeOverrides>;
    }
    interface OramaSearchResults {
        "error": boolean;
        "highlightDescription"?: HighlightOptions | false;
        "highlightTitle"?: HighlightOptions | false;
        "linksRel"?: string;
        "linksTarget"?: string;
        "loading": boolean;
        "searchTerm": SearchResultsProps['searchTerm'];
        "sections": SearchResultBySection[];
        "setChatTerm": (term: string) => void;
        "sourceBaseUrl"?: string;
        "suggestions"?: string[];
    }
    interface OramaSlidingPanel {
        "backdrop": boolean;
        "closed": () => void;
        "open": boolean;
    }
    interface OramaSources {
        "linksRel"?: string;
        "linksTarget"?: string;
        "sourceBaseURL"?: string;
        "sources": any;
        "sourcesMap"?: SourcesMap;
    }
    interface OramaText {
        /**
          * optionally change text alignment
         */
        "align"?: TextProps['align'];
        /**
          * it defines the HTML tag to be used
         */
        "as"?: TextProps['as'];
        "bold"?: boolean;
        /**
          * the optional class name
         */
        "class"?: string;
        /**
          * show as inactive
         */
        "inactive"?: TextProps['inactive'];
        /**
          * it defines how it should look like
         */
        "styledAs"?: TextProps['styledAs'];
        /**
          * optionally change variant style - default is primary
         */
        "variant": TextProps['variant'];
    }
    interface OramaTextarea {
        "autoFocus": boolean;
        "maxRows": number | string;
        "minRows": number | string;
        "placeholder": string;
        "value": string | null;
    }
    interface OramaToggler {
        "performInitialAnimation": boolean;
    }
}
export interface OramaInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLOramaInputElement;
}
export interface OramaModalCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLOramaModalElement;
}
export interface OramaSearchBoxCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLOramaSearchBoxElement;
}
export interface OramaSearchResultsCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLOramaSearchResultsElement;
}
export interface OramaSourcesCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLOramaSourcesElement;
}
declare global {
    interface HTMLOramaButtonElement extends Components.OramaButton, HTMLStencilElement {
    }
    var HTMLOramaButtonElement: {
        prototype: HTMLOramaButtonElement;
        new (): HTMLOramaButtonElement;
    };
    interface HTMLOramaChatElement extends Components.OramaChat, HTMLStencilElement {
    }
    var HTMLOramaChatElement: {
        prototype: HTMLOramaChatElement;
        new (): HTMLOramaChatElement;
    };
    interface HTMLOramaChatAssistentMessageElement extends Components.OramaChatAssistentMessage, HTMLStencilElement {
    }
    var HTMLOramaChatAssistentMessageElement: {
        prototype: HTMLOramaChatAssistentMessageElement;
        new (): HTMLOramaChatAssistentMessageElement;
    };
    interface HTMLOramaChatBoxElement extends Components.OramaChatBox, HTMLStencilElement {
    }
    var HTMLOramaChatBoxElement: {
        prototype: HTMLOramaChatBoxElement;
        new (): HTMLOramaChatBoxElement;
    };
    interface HTMLOramaChatButtonElement extends Components.OramaChatButton, HTMLStencilElement {
    }
    var HTMLOramaChatButtonElement: {
        prototype: HTMLOramaChatButtonElement;
        new (): HTMLOramaChatButtonElement;
    };
    interface HTMLOramaChatMessagesContainerElement extends Components.OramaChatMessagesContainer, HTMLStencilElement {
    }
    var HTMLOramaChatMessagesContainerElement: {
        prototype: HTMLOramaChatMessagesContainerElement;
        new (): HTMLOramaChatMessagesContainerElement;
    };
    interface HTMLOramaChatUserMessageElement extends Components.OramaChatUserMessage, HTMLStencilElement {
    }
    var HTMLOramaChatUserMessageElement: {
        prototype: HTMLOramaChatUserMessageElement;
        new (): HTMLOramaChatUserMessageElement;
    };
    interface HTMLOramaDotsLoaderElement extends Components.OramaDotsLoader, HTMLStencilElement {
    }
    var HTMLOramaDotsLoaderElement: {
        prototype: HTMLOramaDotsLoaderElement;
        new (): HTMLOramaDotsLoaderElement;
    };
    interface HTMLOramaEmbedElement extends Components.OramaEmbed, HTMLStencilElement {
    }
    var HTMLOramaEmbedElement: {
        prototype: HTMLOramaEmbedElement;
        new (): HTMLOramaEmbedElement;
    };
    interface HTMLOramaFacetsElement extends Components.OramaFacets, HTMLStencilElement {
    }
    var HTMLOramaFacetsElement: {
        prototype: HTMLOramaFacetsElement;
        new (): HTMLOramaFacetsElement;
    };
    interface HTMLOramaFooterElement extends Components.OramaFooter, HTMLStencilElement {
    }
    var HTMLOramaFooterElement: {
        prototype: HTMLOramaFooterElement;
        new (): HTMLOramaFooterElement;
    };
    interface HTMLOramaInputElementEventMap {
        "resetValue": void;
    }
    interface HTMLOramaInputElement extends Components.OramaInput, HTMLStencilElement {
        addEventListener<K extends keyof HTMLOramaInputElementEventMap>(type: K, listener: (this: HTMLOramaInputElement, ev: OramaInputCustomEvent<HTMLOramaInputElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLOramaInputElementEventMap>(type: K, listener: (this: HTMLOramaInputElement, ev: OramaInputCustomEvent<HTMLOramaInputElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLOramaInputElement: {
        prototype: HTMLOramaInputElement;
        new (): HTMLOramaInputElement;
    };
    interface HTMLOramaLogoIconElement extends Components.OramaLogoIcon, HTMLStencilElement {
    }
    var HTMLOramaLogoIconElement: {
        prototype: HTMLOramaLogoIconElement;
        new (): HTMLOramaLogoIconElement;
    };
    interface HTMLOramaMarkdownElement extends Components.OramaMarkdown, HTMLStencilElement {
    }
    var HTMLOramaMarkdownElement: {
        prototype: HTMLOramaMarkdownElement;
        new (): HTMLOramaMarkdownElement;
    };
    interface HTMLOramaModalElementEventMap {
        "modalStatusChanged": ModalStatus;
    }
    interface HTMLOramaModalElement extends Components.OramaModal, HTMLStencilElement {
        addEventListener<K extends keyof HTMLOramaModalElementEventMap>(type: K, listener: (this: HTMLOramaModalElement, ev: OramaModalCustomEvent<HTMLOramaModalElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLOramaModalElementEventMap>(type: K, listener: (this: HTMLOramaModalElement, ev: OramaModalCustomEvent<HTMLOramaModalElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLOramaModalElement: {
        prototype: HTMLOramaModalElement;
        new (): HTMLOramaModalElement;
    };
    interface HTMLOramaNavigationBarElement extends Components.OramaNavigationBar, HTMLStencilElement {
    }
    var HTMLOramaNavigationBarElement: {
        prototype: HTMLOramaNavigationBarElement;
        new (): HTMLOramaNavigationBarElement;
    };
    interface HTMLOramaSearchElement extends Components.OramaSearch, HTMLStencilElement {
    }
    var HTMLOramaSearchElement: {
        prototype: HTMLOramaSearchElement;
        new (): HTMLOramaSearchElement;
    };
    interface HTMLOramaSearchBoxElementEventMap {
        "searchboxClosed": {
    id: HTMLElement
  };
    }
    interface HTMLOramaSearchBoxElement extends Components.OramaSearchBox, HTMLStencilElement {
        addEventListener<K extends keyof HTMLOramaSearchBoxElementEventMap>(type: K, listener: (this: HTMLOramaSearchBoxElement, ev: OramaSearchBoxCustomEvent<HTMLOramaSearchBoxElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLOramaSearchBoxElementEventMap>(type: K, listener: (this: HTMLOramaSearchBoxElement, ev: OramaSearchBoxCustomEvent<HTMLOramaSearchBoxElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLOramaSearchBoxElement: {
        prototype: HTMLOramaSearchBoxElement;
        new (): HTMLOramaSearchBoxElement;
    };
    interface HTMLOramaSearchButtonElement extends Components.OramaSearchButton, HTMLStencilElement {
    }
    var HTMLOramaSearchButtonElement: {
        prototype: HTMLOramaSearchButtonElement;
        new (): HTMLOramaSearchButtonElement;
    };
    interface HTMLOramaSearchResultsElementEventMap {
        "oramaItemClick": SearchResult;
    }
    interface HTMLOramaSearchResultsElement extends Components.OramaSearchResults, HTMLStencilElement {
        addEventListener<K extends keyof HTMLOramaSearchResultsElementEventMap>(type: K, listener: (this: HTMLOramaSearchResultsElement, ev: OramaSearchResultsCustomEvent<HTMLOramaSearchResultsElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLOramaSearchResultsElementEventMap>(type: K, listener: (this: HTMLOramaSearchResultsElement, ev: OramaSearchResultsCustomEvent<HTMLOramaSearchResultsElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLOramaSearchResultsElement: {
        prototype: HTMLOramaSearchResultsElement;
        new (): HTMLOramaSearchResultsElement;
    };
    interface HTMLOramaSlidingPanelElement extends Components.OramaSlidingPanel, HTMLStencilElement {
    }
    var HTMLOramaSlidingPanelElement: {
        prototype: HTMLOramaSlidingPanelElement;
        new (): HTMLOramaSlidingPanelElement;
    };
    interface HTMLOramaSourcesElementEventMap {
        "sourceItemClick": SearchResult;
    }
    interface HTMLOramaSourcesElement extends Components.OramaSources, HTMLStencilElement {
        addEventListener<K extends keyof HTMLOramaSourcesElementEventMap>(type: K, listener: (this: HTMLOramaSourcesElement, ev: OramaSourcesCustomEvent<HTMLOramaSourcesElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLOramaSourcesElementEventMap>(type: K, listener: (this: HTMLOramaSourcesElement, ev: OramaSourcesCustomEvent<HTMLOramaSourcesElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLOramaSourcesElement: {
        prototype: HTMLOramaSourcesElement;
        new (): HTMLOramaSourcesElement;
    };
    interface HTMLOramaTextElement extends Components.OramaText, HTMLStencilElement {
    }
    var HTMLOramaTextElement: {
        prototype: HTMLOramaTextElement;
        new (): HTMLOramaTextElement;
    };
    interface HTMLOramaTextareaElement extends Components.OramaTextarea, HTMLStencilElement {
    }
    var HTMLOramaTextareaElement: {
        prototype: HTMLOramaTextareaElement;
        new (): HTMLOramaTextareaElement;
    };
    interface HTMLOramaTogglerElement extends Components.OramaToggler, HTMLStencilElement {
    }
    var HTMLOramaTogglerElement: {
        prototype: HTMLOramaTogglerElement;
        new (): HTMLOramaTogglerElement;
    };
    interface HTMLElementTagNameMap {
        "orama-button": HTMLOramaButtonElement;
        "orama-chat": HTMLOramaChatElement;
        "orama-chat-assistent-message": HTMLOramaChatAssistentMessageElement;
        "orama-chat-box": HTMLOramaChatBoxElement;
        "orama-chat-button": HTMLOramaChatButtonElement;
        "orama-chat-messages-container": HTMLOramaChatMessagesContainerElement;
        "orama-chat-user-message": HTMLOramaChatUserMessageElement;
        "orama-dots-loader": HTMLOramaDotsLoaderElement;
        "orama-embed": HTMLOramaEmbedElement;
        "orama-facets": HTMLOramaFacetsElement;
        "orama-footer": HTMLOramaFooterElement;
        "orama-input": HTMLOramaInputElement;
        "orama-logo-icon": HTMLOramaLogoIconElement;
        "orama-markdown": HTMLOramaMarkdownElement;
        "orama-modal": HTMLOramaModalElement;
        "orama-navigation-bar": HTMLOramaNavigationBarElement;
        "orama-search": HTMLOramaSearchElement;
        "orama-search-box": HTMLOramaSearchBoxElement;
        "orama-search-button": HTMLOramaSearchButtonElement;
        "orama-search-results": HTMLOramaSearchResultsElement;
        "orama-sliding-panel": HTMLOramaSlidingPanelElement;
        "orama-sources": HTMLOramaSourcesElement;
        "orama-text": HTMLOramaTextElement;
        "orama-textarea": HTMLOramaTextareaElement;
        "orama-toggler": HTMLOramaTogglerElement;
    }
}
declare namespace LocalJSX {
    interface OramaButton {
        "as"?: ButtonProps['as'];
        "class"?: string;
        "disabled"?: boolean;
        "size"?: 'small' | 'medium' | 'large';
        "type"?: ButtonProps['type'];
        "variant"?: ButtonProps['variant'];
        "withTooltip"?: string;
    }
    interface OramaChat {
        "defaultTerm"?: string;
        "focusInput"?: boolean;
        "linksRel"?: string;
        "linksTarget"?: string;
        "placeholder"?: string;
        "showClearChat"?: boolean;
        "sourceBaseUrl"?: string;
        "sourcesMap"?: SourcesMap;
        "suggestions"?: string[];
        "systemPrompts"?: string[];
    }
    interface OramaChatAssistentMessage {
        "interaction"?: TChatInteraction;
    }
    interface OramaChatBox {
        "autoFocus"?: boolean;
        "clientInstance"?: OramaClient;
        "index"?: CloudIndexConfig;
        "linksRel"?: string;
        "linksTarget"?: string;
        "placeholder"?: string;
        "sourceBaseUrl"?: string;
        "sourcesMap"?: SourcesMap;
        "suggestions"?: string[];
        "systemPrompts"?: string[];
    }
    interface OramaChatButton {
        "active"?: boolean;
        "class"?: string;
        "highlight"?: boolean;
        "label"?: string;
    }
    interface OramaChatMessagesContainer {
        "interactions"?: TChatInteraction[];
    }
    interface OramaChatUserMessage {
        "interaction"?: TChatInteraction;
    }
    interface OramaDotsLoader {
    }
    interface OramaEmbed {
    }
    interface OramaFacets {
        "facetClicked"?: (facetName: string) => void;
        "facets"?: Facet[];
        "selectedFacet"?: string;
    }
    interface OramaFooter {
        "class"?: string;
        "colorScheme"?: Omit<ColorScheme, 'system'>;
    }
    interface OramaInput {
        "autoFocus"?: boolean;
        "defaultValue"?: InputProps['defaultValue'];
        "label"?: InputProps['label'];
        "labelForScreenReaders"?: InputProps['labelForScreenReaders'];
        "name"?: InputProps['name'];
        "onResetValue"?: (event: OramaInputCustomEvent<void>) => void;
        "placeholder"?: InputProps['placeholder'];
        "size"?: InputProps['size'];
        "type"?: InputProps['type'];
    }
    interface OramaLogoIcon {
        "size"?: number;
    }
    interface OramaMarkdown {
        "content"?: string;
    }
    interface OramaModal {
        "closeOnEscape"?: boolean;
        "closeOnOutsideClick"?: boolean;
        "mainTitle"?: string;
        "onModalStatusChanged"?: (event: OramaModalCustomEvent<ModalStatus>) => void;
        "open"?: boolean;
    }
    interface OramaNavigationBar {
        "handleClose"?: () => void;
        "showBackButton"?: boolean;
        "showChatActions"?: boolean;
    }
    interface OramaSearch {
        "disableChat"?: boolean;
        "focusInput"?: boolean;
        "highlightDescription"?: HighlightOptions | false;
        "highlightTitle"?: HighlightOptions | false;
        "linksRel"?: string;
        "linksTarget"?: string;
        "placeholder"?: string;
        "sourceBaseUrl"?: string;
        "suggestions"?: string[];
    }
    interface OramaSearchBox {
        "chatPlaceholder"?: string;
        "clientInstance"?: OramaClient;
        "colorScheme"?: ColorScheme;
        "disableChat"?: boolean;
        "facetProperty"?: string;
        "highlightDescription"?: HighlightOptions | false;
        "highlightTitle"?: HighlightOptions | false;
        "index"?: CloudIndexConfig;
        "layout"?: 'modal' | 'embed';
        "linksRel"?: string;
        "linksTarget"?: string;
        "onSearchboxClosed"?: (event: OramaSearchBoxCustomEvent<{
    id: HTMLElement
  }>) => void;
        "open"?: boolean;
        "placeholder"?: string;
        "resultMap"?: Partial<ResultMap>;
        "searchParams"?: SearchParams<Orama<AnyOrama | OramaClient>>;
        "searchPlaceholder"?: string;
        "sourceBaseUrl"?: string;
        "sourcesMap"?: SourcesMap;
        "suggestions"?: string[];
        "themeConfig"?: Partial<TThemeOverrides>;
    }
    interface OramaSearchButton {
        "colorScheme"?: ColorScheme;
        "size"?: 'small' | 'medium' | 'large';
        "themeConfig"?: Partial<TThemeOverrides>;
    }
    interface OramaSearchResults {
        "error"?: boolean;
        "highlightDescription"?: HighlightOptions | false;
        "highlightTitle"?: HighlightOptions | false;
        "linksRel"?: string;
        "linksTarget"?: string;
        "loading"?: boolean;
        "onOramaItemClick"?: (event: OramaSearchResultsCustomEvent<SearchResult>) => void;
        "searchTerm"?: SearchResultsProps['searchTerm'];
        "sections"?: SearchResultBySection[];
        "setChatTerm"?: (term: string) => void;
        "sourceBaseUrl"?: string;
        "suggestions"?: string[];
    }
    interface OramaSlidingPanel {
        "backdrop"?: boolean;
        "closed"?: () => void;
        "open"?: boolean;
    }
    interface OramaSources {
        "linksRel"?: string;
        "linksTarget"?: string;
        "onSourceItemClick"?: (event: OramaSourcesCustomEvent<SearchResult>) => void;
        "sourceBaseURL"?: string;
        "sources"?: any;
        "sourcesMap"?: SourcesMap;
    }
    interface OramaText {
        /**
          * optionally change text alignment
         */
        "align"?: TextProps['align'];
        /**
          * it defines the HTML tag to be used
         */
        "as"?: TextProps['as'];
        "bold"?: boolean;
        /**
          * the optional class name
         */
        "class"?: string;
        /**
          * show as inactive
         */
        "inactive"?: TextProps['inactive'];
        /**
          * it defines how it should look like
         */
        "styledAs"?: TextProps['styledAs'];
        /**
          * optionally change variant style - default is primary
         */
        "variant"?: TextProps['variant'];
    }
    interface OramaTextarea {
        "autoFocus"?: boolean;
        "maxRows"?: number | string;
        "minRows"?: number | string;
        "placeholder"?: string;
        "value"?: string | null;
    }
    interface OramaToggler {
        "performInitialAnimation"?: boolean;
    }
    interface IntrinsicElements {
        "orama-button": OramaButton;
        "orama-chat": OramaChat;
        "orama-chat-assistent-message": OramaChatAssistentMessage;
        "orama-chat-box": OramaChatBox;
        "orama-chat-button": OramaChatButton;
        "orama-chat-messages-container": OramaChatMessagesContainer;
        "orama-chat-user-message": OramaChatUserMessage;
        "orama-dots-loader": OramaDotsLoader;
        "orama-embed": OramaEmbed;
        "orama-facets": OramaFacets;
        "orama-footer": OramaFooter;
        "orama-input": OramaInput;
        "orama-logo-icon": OramaLogoIcon;
        "orama-markdown": OramaMarkdown;
        "orama-modal": OramaModal;
        "orama-navigation-bar": OramaNavigationBar;
        "orama-search": OramaSearch;
        "orama-search-box": OramaSearchBox;
        "orama-search-button": OramaSearchButton;
        "orama-search-results": OramaSearchResults;
        "orama-sliding-panel": OramaSlidingPanel;
        "orama-sources": OramaSources;
        "orama-text": OramaText;
        "orama-textarea": OramaTextarea;
        "orama-toggler": OramaToggler;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "orama-button": LocalJSX.OramaButton & JSXBase.HTMLAttributes<HTMLOramaButtonElement>;
            "orama-chat": LocalJSX.OramaChat & JSXBase.HTMLAttributes<HTMLOramaChatElement>;
            "orama-chat-assistent-message": LocalJSX.OramaChatAssistentMessage & JSXBase.HTMLAttributes<HTMLOramaChatAssistentMessageElement>;
            "orama-chat-box": LocalJSX.OramaChatBox & JSXBase.HTMLAttributes<HTMLOramaChatBoxElement>;
            "orama-chat-button": LocalJSX.OramaChatButton & JSXBase.HTMLAttributes<HTMLOramaChatButtonElement>;
            "orama-chat-messages-container": LocalJSX.OramaChatMessagesContainer & JSXBase.HTMLAttributes<HTMLOramaChatMessagesContainerElement>;
            "orama-chat-user-message": LocalJSX.OramaChatUserMessage & JSXBase.HTMLAttributes<HTMLOramaChatUserMessageElement>;
            "orama-dots-loader": LocalJSX.OramaDotsLoader & JSXBase.HTMLAttributes<HTMLOramaDotsLoaderElement>;
            "orama-embed": LocalJSX.OramaEmbed & JSXBase.HTMLAttributes<HTMLOramaEmbedElement>;
            "orama-facets": LocalJSX.OramaFacets & JSXBase.HTMLAttributes<HTMLOramaFacetsElement>;
            "orama-footer": LocalJSX.OramaFooter & JSXBase.HTMLAttributes<HTMLOramaFooterElement>;
            "orama-input": LocalJSX.OramaInput & JSXBase.HTMLAttributes<HTMLOramaInputElement>;
            "orama-logo-icon": LocalJSX.OramaLogoIcon & JSXBase.HTMLAttributes<HTMLOramaLogoIconElement>;
            "orama-markdown": LocalJSX.OramaMarkdown & JSXBase.HTMLAttributes<HTMLOramaMarkdownElement>;
            "orama-modal": LocalJSX.OramaModal & JSXBase.HTMLAttributes<HTMLOramaModalElement>;
            "orama-navigation-bar": LocalJSX.OramaNavigationBar & JSXBase.HTMLAttributes<HTMLOramaNavigationBarElement>;
            "orama-search": LocalJSX.OramaSearch & JSXBase.HTMLAttributes<HTMLOramaSearchElement>;
            "orama-search-box": LocalJSX.OramaSearchBox & JSXBase.HTMLAttributes<HTMLOramaSearchBoxElement>;
            "orama-search-button": LocalJSX.OramaSearchButton & JSXBase.HTMLAttributes<HTMLOramaSearchButtonElement>;
            "orama-search-results": LocalJSX.OramaSearchResults & JSXBase.HTMLAttributes<HTMLOramaSearchResultsElement>;
            "orama-sliding-panel": LocalJSX.OramaSlidingPanel & JSXBase.HTMLAttributes<HTMLOramaSlidingPanelElement>;
            "orama-sources": LocalJSX.OramaSources & JSXBase.HTMLAttributes<HTMLOramaSourcesElement>;
            "orama-text": LocalJSX.OramaText & JSXBase.HTMLAttributes<HTMLOramaTextElement>;
            "orama-textarea": LocalJSX.OramaTextarea & JSXBase.HTMLAttributes<HTMLOramaTextareaElement>;
            "orama-toggler": LocalJSX.OramaToggler & JSXBase.HTMLAttributes<HTMLOramaTogglerElement>;
        }
    }
}
