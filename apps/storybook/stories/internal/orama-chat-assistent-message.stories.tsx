import type { StoryObj, Meta } from '@storybook/web-components'
import { html } from 'lit-html'
import type { Components } from '@orama/wc-components'

const meta: Meta<Components.OramaChatAssistentMessage> = {
  title: 'Components/Internal/Chat',
  component: 'orama-chat-assistent-message',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<Components.OramaChatAssistentMessage>

type StoryWithFakeRendering = StoryObj<Components.OramaChatAssistentMessage & { steps: number; frequency: number }>

const MARKDOWN_MESSAGE = `
Marked - Markdown Parser
========================

[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.

How To Use The Demo
-------------------

1. Type in stuff on the left.
2. See the live updates on the right.

That's it.  Pretty simple.  There's also a drop-down option above to switch between various views:

- **Preview:**  A live display of the generated HTML as it would render in a browser.
- **HTML Source:**  The generated HTML before your browser makes it pretty.
- **Lexer Data:**  What [marked] uses internally, in case you like gory stuff like this.
- **Quick Reference:**  A brief run-down of how to format things using markdown.

Why Markdown?
-------------

It's easy.  It's not overly bloated, unlike HTML.  Also, as the creator of [markdown] says,

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

Something else with a inline code \`\`console.log("blablabla")\`\`

Ready to start writing?  Either start changing stuff on the left or
[clear everything](/demo/?text=) with a simple click.

[Marked]: https://github.com/markedjs/marked/
[Markdown]: http://daringfireball.net/projects/markdown/

\`\`\`html
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
  <script>
    function helloWorld() {
      console.log('Hello World!')
    }
  </script>
    <h1>Hello World</h1>
  </body>
</html>
\`\`\`

\`\`\`javascript
function helloWorld() {
  console.log('Hello World!')
}
\`\`\`

\`\`\`typescript
function helloWorld() : void {
  console.log('Hello World!')
}
\`\`\`

\`\`\`cpp
for(int i = 0; i < 10; i++) {
  cout << "Hello World!" << endl;
}
\`\`\`

\`\`\`c
for(int i = 0; i < 10; i++) {
  cout << "Hello World!" << endl;
}
\`\`\`

\`\`\`java
class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}
\`\`\`

\`\`\`unsuported
<h1>Hello World</h1>
class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}
\`\`\`
`

export const ChatAssistentMessage: Story = {
  args: {
    interaction: {
      query: 'What is the capital of France?',
      response: MARKDOWN_MESSAGE,
      sources: [
        {
          title: 'Paris',
          description: 'The capital of France',
          path: 'https://en.wikipedia.org/wiki/Paris',
        },
        {
          title: 'Buenos Aires',
          description: 'The capital of Argentina',
          path: 'https://en.wikipedia.org/wiki/Buenos_Aires',
        },
        {
          title: 'Brasília',
          description: 'The capital of Brasil',
          path: 'https://en.wikipedia.org/wiki/Brazil',
        },
        {
          title: 'Recife',
          description: 'Alternative capital of Brazil',
          path: 'https://en.wikipedia.org/wiki/Recife',
        },
        {
          title: 'Pernambuco',
          description: 'A country inside Brazil',
          path: 'https://en.wikipedia.org/wiki/Brasil',
        },
        {
          title: 'Imbiribeira',
          description: 'Neughbourhood of Recife',
          path: 'https://en.wikipedia.org/wiki/imbiribeira',
        },
        {
          title: 'Lagoa do Araça',
          description: 'Neughbourhood of Recife',
          path: 'https://en.wikipedia.org/wiki/imbiribeira',
        },
      ],
      // biome-ignore lint/suspicious/noExplicitAny: Enum is rasing error here...
      status: 'done' as any,
      interactionId: '123',
      latest: true,
    },
  },
}

export const ChatAssistentMessageWithFakeRendering: StoryWithFakeRendering = {
  render: ({ interaction, steps, frequency }) => {
    const fakeStreamingMessage = interaction.response
    let count = 0

    const intervalId = setInterval(() => {
      if (count >= MARKDOWN_MESSAGE.length || !fakeStreamingMessage) {
        clearInterval(intervalId)
        // biome-ignore lint/suspicious/noExplicitAny: Enum giving error
        interaction.status = 'done' as any
        return
      }

      interaction.response = fakeStreamingMessage.substring(0, count)

      // biome-ignore lint/suspicious/noExplicitAny: Let me be, Typescript...
      const element = document.getElementById('fake-stream-assistent-message') as any
      element.interaction = {
        ...interaction,
      }

      count = count + steps
    }, frequency)

    return html`<orama-chat-assistent-message id="fake-stream-assistent-message" .interaction=${fakeStreamingMessage}></orama-chat-assistent-message>`
  },
  args: {
    steps: 20,
    frequency: 50,
    interaction: {
      query: 'Example question from the user',
      response: MARKDOWN_MESSAGE,
      sources: [
        {
          title: 'Paris',
          description: 'The capital of France',
          path: 'https://en.wikipedia.org/wiki/Paris',
        },
      ],
      // biome-ignore lint/suspicious/noExplicitAny: Enum giving error
      status: 'streaming' as any,
      interactionId: '123',
      latest: true,
    },
  },
}
