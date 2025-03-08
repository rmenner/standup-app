<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  
  // Triage data
  let issues = [];
  let selectedIssues = [];
  let isLoading = true;
  let error = null;
  
  // Filters
  let showAssigned = true;
  let showUnassigned = true;
  let searchQuery = '';
  
  onMount(async () => {
    if (browser) {
      try {
        // In a real implementation, this would be a fetch from a server endpoint
        // that gets data from GitHub. For now, we'll use mock data.
        await loadMockIssues();
        isLoading = false;
      } catch (err) {
        error = 'Failed to load issues. Please try again later.';
        isLoading = false;
      }
    }
  });
  
  async function loadMockIssues() {
    // This simulates loading issues from GitHub
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    issues = [
      {
        id: 1,
        number: 101,
        title: 'Button component needs accessibility improvements',
        body: 'Current implementation does not meet WCAG 2.1 standards.',
        state: 'open',
        labels: [
          { name: 'bug', color: 'ff0000' },
          { name: 'accessibility', color: '0075ca' }
        ],
        assignee: {
          login: 'dev1',
          avatar_url: 'https://avatars.githubusercontent.com/u/12345678'
        },
        created_at: '2023-10-15T10:30:00Z',
        updated_at: '2023-10-16T14:20:00Z',
        html_url: 'https://github.com/AlaskaAirlines/auro/issues/101'
      },
      {
        id: 2,
        number: 102,
        title: 'Update documentation for color tokens',
        body: 'The documentation is outdated after the recent color system update.',
        state: 'open',
        labels: [
          { name: 'documentation', color: '0075ca' },
          { name: 'good first issue', color: '7057ff' }
        ],
        assignee: null,
        created_at: '2023-10-14T09:15:00Z',
        updated_at: '2023-10-14T09:15:00Z',
        html_url: 'https://github.com/AlaskaAirlines/auro/issues/102'
      },
      {
        id: 3,
        number: 103,
        title: 'Add responsive variants to grid system',
        body: 'We need to improve responsive behavior for complex layouts.',
        state: 'open',
        labels: [
          { name: 'enhancement', color: 'a2eeef' },
          { name: 'priority: high', color: 'd93f0b' }
        ],
        assignee: {
          login: 'dev2',
          avatar_url: 'https://avatars.githubusercontent.com/u/23456789'
        },
        created_at: '2023-10-12T11:45:00Z',
        updated_at: '2023-10-15T08:30:00Z',
        html_url: 'https://github.com/AlaskaAirlines/auro/issues/103'
      }
    ];
  }
  
  function toggleIssueSelection(issueId) {
    if (selectedIssues.includes(issueId)) {
      selectedIssues = selectedIssues.filter(id => id !== issueId);
    } else {
      selectedIssues = [...selectedIssues, issueId];
    }
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Filter issues based on current filter settings
  $: filteredIssues = issues.filter(issue => {
    // Filter by assignment status
    if (!showAssigned && issue.assignee) return false;
    if (!showUnassigned && !issue.assignee) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(query) ||
        issue.body.toLowerCase().includes(query) ||
        issue.labels.some(label => label.name.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Issue Triage</h1>
    <button 
      on:click={() => goto('/')}
      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
    >
      Back to Home
    </button>
  </div>
  
  <!-- Filters -->
  <div class="bg-white shadow-md rounded-lg p-4 mb-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div class="w-full sm:w-64">
        <input 
          type="text" 
          placeholder="Search issues..." 
          bind:value={searchQuery}
          class="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      <div class="flex gap-4">
        <label class="flex items-center">
          <input type="checkbox" bind:checked={showAssigned} class="mr-2">
          Assigned
        </label>
        
        <label class="flex items-center">
          <input type="checkbox" bind:checked={showUnassigned} class="mr-2">
          Unassigned
        </label>
      </div>
      
      <div class="ml-auto">
        <span class="text-gray-600">{filteredIssues.length} issues</span>
      </div>
    </div>
  </div>
  
  <!-- Loading and error states -->
  {#if isLoading}
    <div class="text-center py-8">
      <p class="text-gray-600">Loading issues...</p>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>{error}</p>
    </div>
  {:else if filteredIssues.length === 0}
    <div class="text-center py-8">
      <p class="text-gray-600">No issues match your current filters.</p>
    </div>
  {:else}
    <!-- Issues list -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input 
                type="checkbox"
                checked={selectedIssues.length === filteredIssues.length && filteredIssues.length > 0}
                on:change={() => {
                  if (selectedIssues.length === filteredIssues.length) {
                    selectedIssues = [];
                  } else {
                    selectedIssues = filteredIssues.map(issue => issue.id);
                  }
                }}
              >
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Issue
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Assignee
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Updated
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each filteredIssues as issue (issue.id)}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-4 whitespace-nowrap">
                <input 
                  type="checkbox"
                  checked={selectedIssues.includes(issue.id)}
                  on:change={() => toggleIssueSelection(issue.id)}
                >
              </td>
              <td class="px-4 py-4">
                <div>
                  <div class="flex items-center">
                    <a 
                      href={issue.html_url} 
                      target="_blank"
                      class="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      #{issue.number}
                    </a>
                    <span class="ml-2">{issue.title}</span>
                  </div>
                  <div class="mt-1 flex flex-wrap gap-1">
                    {#each issue.labels as label}
                      <span 
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style="background-color: #{label.color}25; color: #{label.color};"
                      >
                        {label.name}
                      </span>
                    {/each}
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                {#if issue.assignee}
                  <div class="flex items-center">
                    <img src={issue.assignee.avatar_url} alt="" class="h-8 w-8 rounded-full">
                    <div class="ml-2">
                      <div class="text-sm font-medium text-gray-900">
                        {issue.assignee.login}
                      </div>
                    </div>
                  </div>
                {:else}
                  <span class="text-gray-500">Unassigned</span>
                {/if}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                {formatDate(issue.updated_at)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    
    <!-- Bulk actions -->
    {#if selectedIssues.length > 0}
      <div class="mt-4 p-4 bg-gray-100 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">{selectedIssues.length} issues selected</span>
          <div class="flex gap-2">
            <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Assign</button>
            <button class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Add Label</button>
            <button class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">Add to Milestone</button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>
