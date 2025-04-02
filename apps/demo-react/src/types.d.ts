declare module '@orama/react-components' {
  import { FunctionalComponent } from 'react';

  export interface OramaSearchBoxProps {
    clientInstance: any;
    onModalClosed?: () => void;
    onModalStatusChanged?: (e: CustomEvent) => void;
    colorScheme?: string;
    suggestions?: string[];
    onSearchCompleted?: (e: React.MouseEvent) => void;
    onSearchResultClick?: (e: React.MouseEvent) => void;
    onAnswerGenerated?: (e: React.MouseEvent) => void;
    onAnswerSourceClick?: (e: React.MouseEvent) => void;
    chatMarkdownLinkTitle?: (props: { text: string; href: string }) => string;
    chatMarkdownLinkHref?: (props: { text: string; href: string }) => string;
    onChatMarkdownLinkClicked?: (e: React.MouseEvent) => void;
  }

  export interface OramaChatBoxProps {
    clientInstance: any;
    style?: React.CSSProperties;
    onAnswerSourceClick?: (e: React.MouseEvent) => void;
    onAnswerGenerated?: (e: React.MouseEvent) => void;
    chatMarkdownLinkTitle?: (props: { text: string; href: string }) => string;
    chatMarkdownLinkHref?: (props: { text: string; href: string }) => string;
    onChatMarkdownLinkClicked?: (e: React.MouseEvent) => void;
  }

  export interface OramaSearchButtonProps {
    colorScheme?: string;
    children?: React.ReactNode;
  }

  export const OramaSearchBox: FunctionalComponent<OramaSearchBoxProps>;
  export const OramaChatBox: FunctionalComponent<OramaChatBoxProps>;
  export const OramaSearchButton: FunctionalComponent<OramaSearchButtonProps>;
}
