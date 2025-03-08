<script>
  import { goto } from '$app/navigation';
  
  /** @type {import('./$types').PageData} */
  export let data;
  
  let selectedMembers = [];
  let isLoading = false;
  
  function toggleMemberSelection(memberId) {
    if (selectedMembers.includes(memberId)) {
      selectedMembers = selectedMembers.filter(id => id !== memberId);
    } else {
      selectedMembers = [...selectedMembers, memberId];
    }
  }
  
  function startStandup() {
    if (selectedMembers.length === 0) return;
    
    // In a real implementation, we would store the selected members
    // and redirect to the standup page
    localStorage.setItem('standupParticipants', JSON.stringify(
      data.members.filter(member => selectedMembers.includes(member.id))
    ));
    
    goto('/standup');
  }
  
  function getRandomOrder() {
    selectedMembers = [...selectedMembers].sort(() => Math.random() - 0.5);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold">Auro Team Standup</h1>
    <p class="mt-2 text-gray-600">Select team members for today's standup meeting</p>
  </div>
  
  <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
    <!-- Main content - team member selection -->
    <div class="md:col-span-2">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 class="font-semibold">Team Members</h2>
          
          <div class="flex items-center gap-2">
            {#if selectedMembers.length > 0}
              <button 
                on:click={getRandomOrder}
                class="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-md hover:bg-indigo-200"
              >
                Randomize Order
              </button>
            {/if}
            
            <span class="text-sm text-gray-500">
              {selectedMembers.length} selected
            </span>
          </div>
        </div>
        
        {#if data.error}
          <div class="p-4 bg-red-50 border-l-4 border-red-500">
            <p class="text-red-700">{data.error}</p>
            <p class="mt-2 text-sm text-red-600">Please check your GitHub token in the .env file.</p>
          </div>
        {:else if data.loading || isLoading}
          <div class="p-8 text-center">
            <p>Loading team members...</p>
          </div>
        {:else if data.members.length === 0}
          <div class="p-8 text-center">
            <p>No team members found. Please check your configuration.</p>
          </div>
        {:else}
          <ul class="divide-y divide-gray-200">
            {#each data.members as member (member.id)}
              <li class="p-4 hover:bg-gray-50 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id={`member-${member.id}`}
                  checked={selectedMembers.includes(member.id)}
                  on:change={() => toggleMemberSelection(member.id)}
                  class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                
                <img 
                  src={member.avatar_url} 
                  alt={member.login} 
                  class="h-10 w-10 rounded-full"
                />
                
                <div>
                  <div class="font-medium">{member.name || member.login}</div>
                  {#if member.name}
                    <div class="text-sm text-gray-500">@{member.login}</div>
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        {/if}
        
        <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <button 
            on:click={startStandup}
            disabled={selectedMembers.length === 0}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Standup
          </button>
        </div>
      </div>
    </div>
    
    <!-- Sidebar - quick links and tools -->
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
      
      <!-- Recent standup summary -->
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
    </div>
  </div>
</div>
