<script>
  import ParticipantCard from './ParticipantCard.svelte';
  import MarkdownExportModal from './MarkdownExportModal.svelte';
  
  export let timeElapsed = 0;
  export let participantsTotalTime = 0; // Total time spent only on participant updates
  export let participants = [];
  export let onReset;
  
  let showExportModal = false;
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
  <div class="px-6 py-4 bg-blue-600 text-white">
    <h1 class="text-2xl font-bold">Standup Summary</h1>
    <p class="text-blue-100">
      Meeting completed in {formatTime(timeElapsed)} with {participants.length} participants
    </p>
  </div>
  
  <div class="p-6">
    <div class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="bg-gray-100 border border-gray-200 p-4 rounded-lg text-center">
        <div class="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
        <div class="text-sm text-gray-500">Total Time</div>
      </div>
      
      <div class="bg-gray-100 border border-gray-200 p-4 rounded-lg text-center">
        <div class="text-2xl font-bold text-green-600">{participants.length}</div>
        <div class="text-sm text-gray-500">Participants</div>
      </div>
      
      <div class="bg-gray-100 border border-gray-200 p-4 rounded-lg text-center">
        <div class="text-2xl font-bold text-purple-600">
          <!-- Using participantsTotalTime for more accurate calculation (excludes triage and parking lot time) -->
          {formatTime(Math.floor(participantsTotalTime / participants.length))}
        </div>
        <div class="text-sm text-gray-500">Avg. Time Per Person</div>
      </div>
      
      <div class="bg-gray-100 border border-gray-200 p-4 rounded-lg text-center">
        <div class="text-2xl font-bold text-indigo-600">
          {new Date().toLocaleDateString()}
        </div>
        <div class="text-sm text-gray-500">Date</div>
      </div>
    </div>
    
    <h2 class="text-xl font-semibold mb-4">Standup Participants</h2>
    
    <div class="space-y-2 grid gap-2 max-h-[300px] grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 overflow-y-auto rounded-lg shadow-md p-5 bg-gray-100 border border-gray-200">
      {#each participants as participant}
        <ParticipantCard 
          participant={participant}
        />
      {/each}
    </div>
    
    <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
      <button 
        on:click={onReset}
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 cursor-pointer"
      >
        Start New Standup
      </button>
      
      <button 
        on:click={() => showExportModal = true}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
      >
        Export Summary
      </button>
    </div>
  </div>
</div>

<MarkdownExportModal
  bind:isOpen={showExportModal}
  {timeElapsed}
  {participantsTotalTime}
  {participants}
/>
