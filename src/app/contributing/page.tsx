export const dynamic = "force-static";

export default function ContributingPage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 md:px-8">
      <div className="mx-auto max-w-3xl prose prose-zinc dark:prose-invert">
        <h1>Contributing</h1>
        <p className="lead">
          Thanks for your interest in improving this menu viewer! The app now reads from a static JSON file, so the main way to contribute is through code improvements, UI enhancements, or updating the JSON.
        </p>

        <nav>
          <ul>

            <li><a href="#code-contributions">Code Contributions</a></li>
            <li><a href="#guidelines">Guidelines</a></li>
            <li><a href="#submitting-changes">Submitting changes</a></li>
          </ul>
        </nav>

        <h2>Data</h2>
        <p>
          This app reads a fixed weekly menu from <code>public/sindhi-menu.json</code>.
        </p>
        <h2 id="code-contributions">Code Contributions</h2>
        <p>
          Since the app now uses an external API for data, code contributions focus on improving the user experience, adding features, and enhancing the UI.
        </p>
        <p>
          Areas where you can contribute:
        </p>
        <ul>
          <li><strong>UI/UX Improvements</strong>: Enhance the user interface, add new features, improve responsiveness</li>
          <li><strong>Performance Optimization</strong>: Optimize loading times, improve caching strategies</li>
          <li><strong>Accessibility</strong>: Improve accessibility features and screen reader support</li>
          <li><strong>Testing</strong>: Add unit tests and integration tests</li>
          <li><strong>Documentation</strong>: Improve documentation and help text</li>
        </ul>

        <h2 id="guidelines">Guidelines</h2>
        <ul>
          <li>Follow TypeScript best practices and maintain type safety</li>
          <li>Ensure responsive design works across all device sizes</li>
          <li>Maintain consistent code style and formatting</li>
          <li>Test your changes across different browsers and devices</li>
          <li>Consider performance implications of your changes</li>
        </ul>

        <h2 id="submitting-changes">Submitting changes</h2>
        <p>
          Open a pull request with your code improvements or UI enhancements. See the repository README for local setup and contribution etiquette.
        </p>
        <p>
          Before submitting:
        </p>
        <ul>
          <li>Run <code>bun run lint</code> to ensure code quality</li>
          <li>Test your changes in development mode</li>
          <li>Ensure the build passes with <code>bun run build</code></li>
          <li>Include screenshots for UI changes</li>
        </ul>
      </div>
    </div>
  );
}


