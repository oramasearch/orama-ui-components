<p align="center">
  <img src="https://github.com/askorama/orama-ui-components/raw/main/misc/readme/orama-ui-components-readme-cover.png" />
</p>

![NPM Downloads](https://img.shields.io/npm/dm/%40orama%2Fwc-components)
![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/%40orama%2Fwc-components)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40orama%2Fwc-components?label=Bundle%20Size&link=https%3A%2F%2Fbundlephobia.com%2Fpackage%2F%40orama%2Fwc-components%40latest)

# Orama UI Web Components

This library provides a set of ready to use Web Components for easily implementing **Search** and **AI Chat** functionalities in your web applications through Orama.

## Installation

You can install Orama Web Components using npm, yarn, pnpm, bun:

```
npm i @orama/wc-components
```

Or import it directly in a browser module:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@orama/wc-components@latest/dist/orama-ui/orama-ui.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@orama/wc-components@latest/dist/orama-ui/orama-ui.esm.js"></script>
<script nomodule src="https://cdn.jsdelivr.net/npm/@orama/wc-components@latest/dist/cjs/orama-ui.cjs.js"></script>
<div>
  <div id="orama-ui">
    <orama-search-button onClick="open = !open">Search...</orama-search-button>
    <orama-search-box></orama-search-box>
  </div>
</div>
<script>
  let open = false;
  Object.assign(document.querySelector('orama-search-box'), {
    open: open,
    index: {
      endpoint: 'https://cloud.orama.run/v1/indexes/orama-docs-bzo330',
      api_key: 'NKiqTJnwnKsQCdxN7RyOBJgeoW5hJ594',
    },
    facetProperty: 'category',
    sourceBaseUrl: 'https://docs.orama.com',
    sourcesMap: {
      title: 'title',
      description: 'content',
    },
    resultMap: {
      title: 'title',
      description: 'content',
      section: 'category',
    },
    searchPlaceholder: 'Search something...',
    chatPlaceholder: 'What do you want to learn about Orama?',
    suggestions: ['What is Orama?', 'Does Orama integrate with Shopify?', 'How do I create an answer session?'],
  });
</script>
```

## Components API Documentation

- [Orama Search Box](src/components/orama-search-box/readme.md)
- [Orama Chat Box](src/components/orama-chat-box/readme.md)
- [Orama Search Button](src/components/orama-search-button/readme.md)
