# Standup Manager

A SvelteKit application designed to streamline daily standup meetings for the Auro Design System team at Alaska Airlines. This tool allows team members to conduct efficient standups with time tracking and export a summary for easy note takeing.

## Features

- Fetch team members directly from GitHub's API
- Select participants for standup meetings
- Time tracking for individual speakers and overall meeting duration
- Structured standup format (updates, triage, parking lot)
- Meeting summary with markdown export

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- GitHub Personal Access Token with appropriate permissions

### Installation

1. Clone the repository
```bash
git clone https://github.com/rmenner/standup-app
cd standup-app
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your GitHub configuration:
```
GITHUB_TOKEN=github_token
GITHUB_ORG=github_organization
GITHUB_TEAM=github_team_slug
```

4. Start the development server
```bash
npm run dev
```

## Usage

1. On the homepage, browse team members automatically fetched from GitHub
2. Select participants for the current standup meeting
3. Click "Start Meeting" to begin the session
4. Each team member gets a 2-minute timer for updates
5. After all individual updates, triage issues and parking lot items can be addressed
6. When complete, review and export a comprehensive meeting summary
