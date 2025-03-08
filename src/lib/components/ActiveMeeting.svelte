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
  export let inTriageStep = false;
  export let inParkingLotStep = false;
  export let onNext;
  export let onPrevious;
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <div class="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-bold">Standup Meeting</h1>
      {#if !inTriageStep && !inParkingLotStep}
        <p class="text-blue-100">
          Participant {currentParticipantIndex + 1} of {participants.length}
        </p>
      {:else if inTriageStep}
        <p class="text-blue-100">Triage</p>
      {:else}
        <p class="text-blue-100">Parking Lot</p>
      {/if}
    </div>
    
    <div class="text-right">
      <Timer 
        time={timeElapsed} 
        label="Meeting Duration:" 
        size="normal"
      />
    </div>
  </div>
  
  {#if inTriageStep}
    <!-- Triage step content -->
    <div class="p-6">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h2 class="text-xl font-bold mb-2">Triage Time</h2>
        <p class="mb-2">Now that everyone has shared their updates, let's review and triage any items that need attention:</p>
        <ul class="list-disc ml-6 mb-4">
          <li>Review any blockers that were mentioned</li>
          <li>Discuss any issues that need immediate attention</li>
          <li>Assign action items as needed</li>
          <li>Plan any necessary follow-up discussions</li>
        </ul>
        <p>Use the GitHub project board to track and update items during triage.</p>
      </div>
      
      <!-- Navigation buttons for triage -->
      <div class="mt-6 flex justify-end">
        <button 
          on:click={onNext}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Parking Lot
        </button>
      </div>
    </div>
  {:else if inParkingLotStep}
    <!-- Parking Lot step content -->
    <div class="p-6">
      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <h2 class="text-xl font-bold mb-2">Parking Lot Discussion</h2>
        <p class="mb-2">Before we wrap up, let's address any remaining items that didn't fit into the main discussion:</p>
        <ul class="list-disc ml-6 mb-4">
          <li>Topics that need more time for discussion</li>
          <li>Issues that affect only part of the team</li>
          <li>Items that should be scheduled for a separate meeting</li>
          <li>Any questions or concerns not covered elsewhere</li>
        </ul>
        <p>This is our chance to clear the air on anything that's been left pending.</p>
      </div>
      
      <!-- Navigation buttons for parking lot -->
      <div class="mt-6 flex justify-end">
        <button 
          on:click={onNext}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Complete Meeting
        </button>
      </div>
    </div>
  {:else if participants.length > 0 && currentParticipantIndex < participants.length}
    <!-- Regular participant step content -->
    {@const currentParticipant = participants[currentParticipantIndex]}
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
          {currentParticipantIndex < participants.length - 1 ? 'Next' : 'Proceed to Triage'}
        </button>
      </div>
    </div>
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
      style="width: {inParkingLotStep ? 100 : (inTriageStep ? 100 : (currentParticipantIndex / participants.length) * 100)}%;"
    ></div>
  </div>
</div>
