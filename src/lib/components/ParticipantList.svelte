<script>
  export let participants = [];
  export let currentParticipantIndex = 0;

</script>

<div class="mt-4 mb-6">
  <h3 class="text-lg font-semibold mb-3 flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
    Participants
  </h3>
  
  <div class="grid gap-2 max-h-[300px] overflow-y-auto pr-1">
    {#each participants as participant, index}
      <div
        class="flex items-center p-3 rounded-md text-left transition-colors hover:bg-gray-50 border border-gray-200"
        class:bg-blue-50={index === currentParticipantIndex}
        class:border-blue-500={index === currentParticipantIndex}
        class:border-gray-200={index !== currentParticipantIndex}
        aria-pressed={index === currentParticipantIndex}
      >
        <div class="flex items-center w-full">
          <img
            src={participant.avatar_url}
            alt={participant.login}
            class="h-10 w-10 rounded-full mr-3 border border-gray-300"
            loading="lazy"
          />
          <div>
            <div class="font-medium">
              {participant.name || participant.login}
            </div>
            {#if participant.name}
              <div class="text-sm text-gray-500">@{participant.login}</div>
            {/if}
          </div>
          
          {#if index < currentParticipantIndex}
            <span class="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Completed
            </span>
          {:else if index === currentParticipantIndex}
            <span class="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center pulse-animation">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              Currently Speaking
            </span>
          {:else}
            <span class="ml-auto text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              Waiting
            </span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .pulse-animation {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
</style>

