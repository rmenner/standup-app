<script>
  import Timer from './Timer.svelte';
  import ParticipantList from './ParticipantList.svelte';
  import LateParticipantModal from './LateParticipantModal.svelte';
  import { createEventDispatcher } from 'svelte';
  
  export let participants = [];
  export let currentParticipantIndex = 0;
  export let timeElapsed = 0;
  export let currentTimeElapsed = 0;
  export let defaultTimeLimit = 120;
  export let warningTime = 30;
  export let inTriageStep = false;
  export let inParkingLotStep = false;
  export let onNext;
  export let onPrevious;
  export let availableMembers = []; // All team members that can be added as late participants
  
  const dispatch = createEventDispatcher();
  
  let isLateParticipantModalOpen = false;
  
  // Get all participant IDs that are already in the meeting
  $: alreadySelectedIds = participants.map(participant => participant.id);
  
  function openLateParticipantModal() {
    isLateParticipantModalOpen = true;
  }
  
  function closeLateParticipantModal() {
    isLateParticipantModalOpen = false;
  }
  
  function handleAddParticipants(event) {
    const lateParticipants = event.detail;
    
    if (lateParticipants && lateParticipants.length > 0) {
      // Create a new participants array with the late participants added
      const updatedParticipants = [...participants, ...lateParticipants];
      
      // Dispatch an event to notify parent component of the change
      dispatch('participantsUpdated', {
        participants: updatedParticipants
      });
      
      // Update the local participants array
      participants = updatedParticipants;
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
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
    
    <div class="grid grid-cols-1 gap-2">
     
      {#if !inTriageStep && !inParkingLotStep}
      <div class="grid-cols-1 flex justify-end">
        <button
          on:click={openLateParticipantModal}
          class="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 cursor-pointer"
        >
          Add Participant
        </button>
      </div>
      {/if}
      <div class="grid-cols-1">
        <Timer 
          time={timeElapsed} 
          label="Meeting Duration:" 
          size="normal"
        />
      </div>
      
    </div>
  </div>
  
  {#if inTriageStep}
    <!-- Triage step content -->
    <div class="p-6">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h2 class="text-xl font-bold mb-2">Triage Time</h2>
        <p class="mb-2">Now that everyone has shared their updates, let's review the triage GitHub issues:</p>
        <ul class="list-disc ml-6 mb-4">
          <li>Assign issues to team members</li>
          <li>Discuss priority and severity of issues</li>
          <li>Identify blockers and dependencies</li>
        </ul>
      </div>
      
      <!-- Navigation buttons for triage -->
      <div class="mt-6 flex justify-end">
        <button 
          on:click={onNext}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
        >
          Proceed to Parking Lot
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
          class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
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
      
      <ParticipantList {participants} {currentParticipantIndex} />

      <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
        <div class="flex flex-col sm:flex-row gap-3">

          <button 
            on:click={onPrevious}
            disabled={currentParticipantIndex <= 0}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button 
            on:click={onNext}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
          >
            {currentParticipantIndex < participants.length - 1 ? 'Next' : 'Proceed to Triage'}
          </button>
        </div>
      </div>
    </div>
  {:else}
    <div class="p-6 text-center">
      <p>No participants available. Please return to the home page to select participants.</p>
      <button 
        on:click={() => import('$app/navigation').goto('/')}
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
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

<!-- Late Participant Modal -->
<LateParticipantModal
  isOpen={isLateParticipantModalOpen}
  members={availableMembers}
  alreadySelectedIds={alreadySelectedIds}
  on:close={closeLateParticipantModal}
  on:addParticipants={handleAddParticipants}
/>
