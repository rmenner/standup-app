import { Octokit } from 'octokit';
import { GITHUB_TOKEN, GITHUB_ORG, GITHUB_TEAM } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    // Initialize Octokit with the GitHub token
    const octokit = new Octokit({
      auth: GITHUB_TOKEN
    });

    // Configure these variables based on your team
    const org = GITHUB_ORG;
    const team = GITHUB_TEAM;
    
    // First try to get team members if team name is provided
    let members = [];
    if (team) {
      try {
        // Get team ID first
        const teamsResponse = await octokit.request('GET /orgs/{org}/teams', {
          org: org
        });
        
        const targetTeam = teamsResponse.data.find(t => t.slug === team);
        
        if (targetTeam) {
          // Get team members
          const teamMembersResponse = await octokit.request('GET /orgs/{org}/teams/{team_slug}/members', {
            org: org,
            team_slug: targetTeam.slug
          });
          
          members = teamMembersResponse.data;
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        // Fallback to org members if team fetch fails
      }
    }
    
    // Fallback to getting all org members if team members couldn't be fetched
    if (members.length === 0) {
      const response = await octokit.request('GET /orgs/{org}/members', {
        org: org,
        per_page: 100
      });
      
      members = response.data;
    }
    
    // Get detailed user info for each member
    const memberDetails = await Promise.all(
      members.map(async (member) => {
        try {
          const userResponse = await octokit.request('GET /users/{username}', {
            username: member.login
          });
          
          return userResponse.data;
        } catch (error) {
          console.error(`Error fetching details for ${member.login}:`, error);
          return member;
        }
      })
    );
    
    return {
      members: memberDetails,
      loading: false
    };
  } catch (error) {
    console.error('Error in GitHub API request:', error);
    return {
      members: [],
      error: 'Failed to load team members from GitHub. Please check your token and permissions.',
      loading: false
    };
  }
}
