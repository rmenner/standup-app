<script>
  import Timer from './Timer.svelte';
  import ParticipantNotes from './ParticipantNotes.svelte';
  
  export let participants = [];
  export let currentParticipantIndex = 0;
  export let timeElapsed = 0;
  export let currentTimeElapsed = 0;
  export let notes = {};
  export let defaultTimeLimit = 120;
  export let warningTime = 30;
  export let onNext;
  export let onPrevious;
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <div class="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-bold">Standup Meeting</h1>
      <p class="text-blue-100">
        Participant {currentParticipantIndex + 1} of {participants.length}
      </p>
    </div>
    
    <div class="text-right">
      <Timer 
        time={timeElapsed} 
        label="Meeting Duration:" 
        size="normal"
      />
    </div>
  </div>
  
  {#if participants.length > 0 && currentParticipantIndex < participants.length}
    {#const currentParticipant = participants[currentParticipantIndex]}
      <div class="p-6">
        <!-- Current speaker info -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <img 
              src={currentParticipant.avatar_url} 
              alt={currentParticipant.login} 
              class="h-16 w-16 rounded-full mr-4"
            />
            <div>
              <h2 class="text-xl font-bold">
                {currentParticipant.name || currentParticipant.login}
              </h2>
              {#if currentParticipant.name}
                <div class="text-gray-500">@{currentParticipant.login}</div>
              {/if}
            </div>
          </div>
          
          <Timer
            time={currentTimeElapsed}
            timeLimit={defaultTimeLimit}
            warningTime={warningTime}
            size="large"
          />
        </div>
        
        <!-- Note taking form -->
        <ParticipantNotes notes={notes[currentParticipant.id]} />
        
        <!-- Navigation buttons -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          {#if currentParticipantIndex > 0}
            <button 
              on:click={onPrevious}
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
            >
              Previous
            </button>
          {/if}
          
          <button 
            on:click={onNext}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            {currentParticipantIndex < participants.length - 1 ? 'Next' : 'Complete Standup'}
          </button>
        </div>
      </div>
    {/const}
  {:else}
    <div class="p-6 text-center">
      <p>No participants available. Please return to the home page to select participants.</p>
      <button 
        on:click={() => import('$app/navigation').goto('/')}
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
      >
        Return to Home
      </button>
    </div>
  {/if}
  
  <!-- Progress bar -->
  <div class="bg-gray-100 h-2">
    <div 
      class="bg-blue-600 h-2" 
      style="width: {(currentParticipantIndex / participants.length) * 100}%;"
    ></div>
  </div>
</div>
