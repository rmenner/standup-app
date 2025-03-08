# Auro Team Standup Manager

A SvelteKit application designed to streamline daily standup meetings for the Auro Design System team at Alaska Airlines. This tool allows team members to conduct efficient standups with time tracking and meeting notes.

## Features

- Fetch team members directly from GitHub's API
- Select participants for standup meetings
- Time tracking for individual speakers and overall meeting duration
- Structured standup format (yesterday's work, today's plan, blockers)
- Meeting summary with all participant notes

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- GitHub Personal Access Token with appropriate permissions

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd auro-standup
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your GitHub token:
```
GITHUB_TOKEN=your_github_token_here
```

4. Start the development server
```bash
npm run dev
```

## Usage

1. On the homepage, you'll see team members fetched from GitHub
2. Select the members who will participate in the standup
3. Click "Start Meeting" to begin the standup
4. For each team member, record their updates about:
   - What they worked on yesterday
   - What they plan to work on today
   - Any blockers they're facing
5. After all members have spoken, a summary will be displayed

## Customization

- You can modify the GitHub organization and team name in `src/routes/+page.server.js`
- Default time limits per person can be adjusted
- UI styling is done with TailwindCSS and can be customized in the tailwind.config.js file

## License

[Add license information here]
