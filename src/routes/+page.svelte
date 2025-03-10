<script>
  import { goto } from '$app/navigation';
  import TeamMemberSelector from '$lib/components/TeamMemberSelector.svelte';
  import { onMount } from 'svelte';
  
  /** @type {import('./$types').PageData} */
  export let data;
  
  // Flag to check if we're in a browser environment
  const browser = typeof window !== 'undefined';
  
  /** @type {number[]} */
  let selectedMembers = [];
  let isLoading = false;
  
  // Use onMount to ensure localStorage operations only happen in the browser
  onMount(() => {
    // Save all team members to localStorage when they're loaded
    if (data.members && data.members.length > 0) {
      localStorage.setItem('allTeamMembers', JSON.stringify(data.members));
    }
    
    // Try to load previously selected members from localStorage
    try {
      const savedMembersJson = localStorage.getItem('lastSelectedMembers');
      if (savedMembersJson) {
        const parsedMembers = JSON.parse(savedMembersJson);
        if (Array.isArray(parsedMembers)) {
          selectedMembers = parsedMembers;
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  });
  
  // Safely save data to localStorage with error handling
  function safelyStoreInLocalStorage(key, value) {
    if (!browser) return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }
  
  function handleSelectionChange(event) {
    selectedMembers = event.detail.selectedIds;
    
    // Save selection to localStorage when it changes
    if (browser) {
      safelyStoreInLocalStorage('lastSelectedMembers', selectedMembers);
    }
  }
  
  function handleStartStandup(event) {
    if (selectedMembers.length === 0) return;
    
    // Get the selected members from the event
    let participantsToSave = event.detail.selectedMembers;
    
    // Randomize the order of the selected members
    participantsToSave = [...participantsToSave].sort(() => Math.random() - 0.5);
    
    // Store the randomized members and redirect to the standup page
    if (browser) {
      safelyStoreInLocalStorage('standupParticipants', participantsToSave);
    }
    
    goto('/standup');
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold">Auro Team Standup</h1>
    <p class="mt-2 text-gray-600">Select team members for today's standup meeting</p>
  </div>
  
  <div class="grid grid-cols-1 gap-8">
    <!-- Main content - team member selection -->
    <div class="md:col-span-2">
      <TeamMemberSelector 
        members={data.members}
        initialSelectedIds={selectedMembers}
        loading={data.loading || isLoading}
        error={data.error || ''}
        on:selectionChange={handleSelectionChange}
        on:startStandup={handleStartStandup}
      />
    </div>
    
    <!-- Sidebar - quick links and tools
    <div>
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 class="font-semibold">Team Tools</h2>
        </div>
        
        <div class="p-4 space-y-3">
          <button 
            on:click={() => goto('/triage')}
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-left font-medium hover:bg-gray-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Issue Triage
          </button>
          
          <button 
            on:click={() => goto('/parking-lot')}
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-left font-medium hover:bg-gray-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Parking Lot
          </button>
          
          <a 
            href="https://github.com/AlaskaAirlines/auro"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-left font-medium hover:bg-gray-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub Repository
          </a>
        </div>
      </div>
      
      Recent standup summary
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 class="font-semibold">Recent Activity</h2>
        </div>
        
        <div class="p-4">
          <p class="text-gray-600 text-sm">
            View past standup summaries and team updates. Tracking standup history helps identify recurring blockers and progress over time.
          </p>
          
          <div class="mt-4">
            <h3 class="font-medium text-sm text-gray-700 mb-2">Quick Stats</h3>
            
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 p-3 rounded">
                <div class="text-xl font-bold text-blue-600">14</div>
                <div class="text-xs text-gray-500">Recent Standups</div>
              </div>
              
              <div class="bg-gray-50 p-3 rounded">
                <div class="text-xl font-bold text-green-600">28</div>
                <div class="text-xs text-gray-500">Resolved Items</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</div>
