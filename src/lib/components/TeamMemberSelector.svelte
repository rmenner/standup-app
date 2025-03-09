<script>
  /**
   * @typedef {Object} Member
   * @property {number} id - The unique ID of the member
   * @property {string} avatar_url - URL to the member's avatar image
   * @property {string} login - The member's username
   * @property {string} [name] - The member's display name (optional)
   */

  /** @type {Member[]} */
  export let members = [];
  
  /** @type {number[]} */
  export let initialSelectedIds = [];

  /** @type {boolean} */
  export let showHeader = true;

  /** @type {boolean} */
  export let showStartButton = true;

  /** @type {number[]} */
  let selectedMembers = [...initialSelectedIds];

  /** @type {boolean} */
  export let loading = false;

  /** @type {string} */
  export let error = '';

  /**
   * Toggle the selection state of a member
   * @param {number} memberId - The ID of the member to toggle
   */
  function toggleMemberSelection(memberId) {
    if (selectedMembers.includes(memberId)) {
      selectedMembers = selectedMembers.filter(id => id !== memberId);
    } else {
      selectedMembers = [...selectedMembers, memberId];
    }
    
    // Dispatch an event with the updated selection
    dispatch('selectionChange', {
      selectedIds: selectedMembers,
      selectedMembers: members.filter(member => selectedMembers.includes(member.id))
    });
  }

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  /**
   * Start the standup process with the selected members
   */
  function startStandup() {
    if (selectedMembers.length === 0) return;
    
    dispatch('startStandup', {
      selectedIds: selectedMembers,
      selectedMembers: members.filter(member => selectedMembers.includes(member.id))
    });
  }
</script>

<div class="overflow-hidden @container min-w-80 border border-gray-200 rounded-lg shadow-md bg-white">
  {#if showHeader}
    <div class="px-4 py-3  border-b border-gray-200 flex justify-between items-center">
      <h2 class="font-semibold">Team Members</h2>
      
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">
          {selectedMembers.length} selected
        </span>
        {#if showStartButton}
          <button 
            on:click={startStandup}
            disabled={selectedMembers.length === 0}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Start Standup
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <div class="p-4 max-h-[600px] overflow-y-auto bg-gray-100">
    {#if error}
      <div class="p-4 bg-red-50 border-l-4 border-red-500">
        <p class="text-red-700">{error}</p>
        <p class="mt-2 text-sm text-red-600">Please check your GitHub token in the .env file.</p>
      </div>
    {:else if loading}
      <div class="p-8 text-center">
        <p>Loading team members...</p>
      </div>
    {:else if members.length === 0}
      <div class="p-8 text-center">
        <p>No team members found. Please check your configuration.</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-2">
        {#each members as member (member.id)}
          <div 
            class="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 flex items-center gap-3 cursor-pointer"
            on:click={() => toggleMemberSelection(member.id)}
            on:keydown={(e) => e.key === 'Enter' && toggleMemberSelection(member.id)}
            role="checkbox"
            aria-checked={selectedMembers.includes(member.id)}
            tabindex="0"
          >
            <input 
              type="checkbox" 
              id={`member-${member.id}`}
              checked={selectedMembers.includes(member.id)}
              class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              on:click|stopPropagation={() => {}} 
            />
            
            <img 
              src={member.avatar_url} 
              alt={member.login} 
              class="h-10 w-10 rounded-full border border-gray-300"
            />
            
            <div class="overflow-hidden">
              <div class="font-medium truncate">{member.name || member.login}</div>
              {#if member.name}
                <div class="text-sm text-gray-500 truncate">@{member.login}</div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
</div>

