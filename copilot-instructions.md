This project is built with:

- React + TypeScript
- TailwindCSS for styling
- PostCSS + Autoprefixer for vendor prefixing
- ESLint + Prettier for code quality
- Jest + Testing Library for testing

Objectives:

- Write **clean**, **modular**, **DRY**, and **SOLID** React code
- Use **semantic HTML** and **WAI-ARIA** for accessibility
- Make everything **responsive by default** (mobile-first, then `md`, `lg`, `xl`)
- Use **Tailwind** utility classes efficiently, no unnecessary custom CSS
- Ensure **keyboard navigation**, **screen reader** support, and **focus indicators**
- Use proper `role=`, `aria-*`, and heading structure (`h1`–`h6`) for accessibility
- Group media queries at the end of CSS files if used
- Use `useId()` for unique IDs when needed (e.g. labels, aria attributes)

Layout Rules:

- Use `flex`, `grid`, or `container` layout utilities from Tailwind
- Avoid fixed pixel sizes, prefer `rem`, `%`, or `minmax()` where applicable
- Use Tailwind’s responsive modifiers like `md:grid-cols-2`, `lg:px-8`, etc.

Component Best Practices:

- Break UI into reusable, meaningful components
- Use `props` and `children` effectively
- Follow the **Single Responsibility Principle**
- Use `useEffect`, `useState`, `useCallback` wisely and avoid unnecessary re-renders

Testing:

- Every UI component should have a test using Testing Library
- Use `getByRole`, `getByLabelText`, or `getByTestId` for queries
- Simulate user events with `user-event`

Tailwind Suggestions:

- Use `@layer` for custom classes inside `tailwind.css`
- Use `focus-visible` and `sr-only` for accessibility
- Avoid over-using `!important`
- Extend theme only when necessary

Example snippet for a responsive accessible button:

<Button
className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
aria-label="Submit application"
/> Submit </Button>
