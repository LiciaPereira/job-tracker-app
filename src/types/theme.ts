//theme type definitions
export interface Theme {
  colors: {
    background: {
      card: string;
      page: string;
      input: string;
    };
    text: {
      body: string;
      heading: string;
      muted: string;
      label: string;
      link: string;
    };
    primary: {
      light: string;
      default: string;
      dark: string;
    };
    border: string;
  };
  elements: {
    card: string;
    input: string;
    section: string;
  };
}
