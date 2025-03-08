  export let warningTime = 30;
  export let inTriageStep = false;
  export let inParkingLotStep = false;
  export let onNext;
      <h1 class="text-2xl font-bold">Standup Meeting</h1>
      {#if !inTriageStep && !inParkingLotStep}
        <p class="text-blue-100">
          Participant {currentParticipantIndex + 1} of {participants.length}
        </p>
      {:else if inTriageStep}
        <p class="text-blue-100">Triage Step</p>
      {:else if inParkingLotStep}
        <p class="text-blue-100">Parking Lot</p>
  {#if inParkingLotStep}
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
  {:else if inTriageStep}
  <!-- Progress bar -->
  <div class="bg-gray-100 h-2">
    <div 
      class="bg-blue-600 h-2" 
      style="width: {inParkingLotStep ? 100 : (inTriageStep ? 100 : (currentParticipantIndex / participants.length) * 100)}%;"
    ></div>
      <!-- Participant list -->
      <ParticipantList 
        {participants} 
        {currentParticipantIndex} 
        {onJumpToParticipant} 
      />
      
      <!-- Navigation buttons -->
