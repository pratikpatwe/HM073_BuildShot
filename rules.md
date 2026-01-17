# Project Rules

## 🚀 Development Methodology
- **Agile & Quality-First**: We build fast but we don't ship broken code.

## 📝 Git Commit Rules
We use a strict prefix-based commit system. All messages must be lowercase and descriptive.

**Format**: `prefix: description`

### Available Prefixes:
- `feat:` Use for new features or significant logic updates.
- `fix:` Use for bug fixes or resolving errors.
- `ui:` Use for styling, layout, CSS, and component UI changes.
- `refactor:` Use for code cleanup or restructuring without changing behavior.
- `docs:` Use for updating documentation, README, or `rules.md`.
- `chore:` Use for package installs, configuration, or maintenance.
- `merge:` Use for manual merge resolution or branch syncs.


## 🤝 GitHub Merge & PR Rules
When merging on GitHub (Pull Requests), use the same prefix system for the **PR Title** and **Merge/Squash Commit Message**.

### Rules:
- **PR Titles**: Must start with a prefix (e.g., `feat: add login page`).
- **Squash & Merge**: Always ensure the final commit message follows the `prefix: description` format.
- **Merge Commits**: If not squashing, the merge commit should be `merge: sync [branch-name] to [target-branch]`.

### Branching:
- **Main**: Protected branch. No direct pushes.
- **Feature Branches**: Named after the task or user (e.g., `pratik`, `krishna`, `feat/auth`).
