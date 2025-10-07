# Sudarshan AI Labs Assistant Workspace

This repository contains the TypeScript sources for **Leeila**, the Sudarshan AI Labs agent that showcases our AI/SaaS services, answers FAQs, and captures new business leads.

The notes below explain how to open the project in Visual Studio Code (VS Code), install dependencies, run the supplied lint/test scripts, and iterate on the agent instructions or tools.

## 1. Open the project in VS Code

1. Install [VS Code](https://code.visualstudio.com/) if you have not already.
2. Clone the GitHub repository and change into the project folder:
   ```bash
   git clone <your-fork-or-repo-url>
   cd .github
   ```
3. Launch VS Code from the folder root so it can detect the TypeScript configuration, ESLint setup, and npm scripts:
   ```bash
   code .
   ```

## 2. Recommended VS Code extensions

Install these extensions for the best editing experience:

- **ESLint** (`dbaeumer.vscode-eslint`) – surfaces lint errors inline when you save.
- **Prettier** (`esbenp.prettier-vscode`) – consistent formatting for Markdown and TypeScript.
- **TypeScript ESLint Language Service** (`ms-vscode.vscode-typescript-next`) – improved IntelliSense for the flat ESLint config.
- **Markdown All in One** (`yzhang.markdown-all-in-one`) – shortcuts for editing the docs and agent prompts.

Once the extensions are installed, reload the VS Code window so they attach to the workspace.

## 3. Install dependencies

From the integrated VS Code terminal (`` Ctrl+` ``) or any shell inside the project folder, run:

```bash
npm install
```

This restores the packages defined in `package.json`, including the custom OpenAI Agents shim and the lint/test tooling.

## 4. Project structure overview

- `agents/leeila.agent.ts` – the main agent definition with Sudarshan-specific voice, tone, and MCP server settings.
- `tools/*.tool.ts` – callable tools (packages list, FAQs, lead capture, etc.).
- `scripts/test-agent.ts` – smoke tests executed by `npm test` to validate the configuration and lead workflow.
- `profile/leeila-mockup.html` – static HTML mock-up of the proposed UI look-and-feel.
- `lib/shims/openai-agents.ts` – helper module so the project can run tests without the CLI `agents` subcommand.

## 5. Run linting and tests inside VS Code

Two npm scripts are available under **Run and Debug → npm scripts** and from the terminal:

- **Lint:**
  ```bash
  npm run lint
  ```
  Runs ESLint against the `agents`, `tools`, and `scripts` folders.

- **Full test suite:**
  ```bash
  npm test
  ```
  Executes linting followed by the TypeScript smoke tests that load the agent and exercise the `save_lead_to_sheet` tool.

You can also create a VS Code Task (Terminal → Configure Default Build Task) that runs `npm test` for quick access.

## 6. Editing tips in VS Code

- The project uses [TypeScript path inference](tsconfig.json), so imports like `../tools/...` resolve automatically.
- Enable “Format on Save” in VS Code settings and set Prettier as the default formatter for `.ts` and `.md` files.
- When editing `agents/leeila.agent.ts`, turn on the Markdown preview (`Ctrl+Shift+V`) to review the instruction block formatting.
- Use the built-in Git panel to stage changes, craft commit messages, and push to GitHub directly from VS Code.

## 7. Environment variables for lead capture

If you want to test webhook forwarding locally, define the following variables in a `.env` file or VS Code’s “Run and Debug” configuration:

- `SUDARSHAN_LEADS_WEBHOOK_URL` (preferred) or `LEADS_WEBHOOK_URL`
- Optional `SUDARSHAN_LEADS_WEBHOOK_TOKEN` or `LEADS_WEBHOOK_TOKEN`

Without these variables, the `save_lead_to_sheet` tool will log leads to the console and report that they were captured locally, which is safe for development.

## 8. Next steps

- Update the agent instructions whenever new offers or CTA rules are introduced.
- Expand `tools/faqResponder.tool.ts` with additional curated answers as the knowledge base grows.
- Pair the repository with a front-end (for example, the mock-up in `profile/leeila-mockup.html`) and hook up your preferred speech-to-text/text-to-speech service if you plan to ship a voice experience.

Need help customizing the workspace further? Reach out to the Sudarshan AI Labs platform team and we can assist you in tailoring VS Code tasks, launch configurations, or CI pipelines for your workflow.
