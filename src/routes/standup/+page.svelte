<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  
  // Import components
  import ActiveMeeting from '$lib/components/ActiveMeeting.svelte';
  import MeetingSummary from '$lib/components/MeetingSummary.svelte';
  
  // State management
  let participants = [];
  let currentParticipantIndex = 0;
  let meetingStartTime = null;
  let currentStartTime = null;
  let timerInterval = null;
  let timeElapsed = 0;
  let currentTimeElapsed = 0;
  let meetingCompleted = false;
  
  // Notes for each participant
  let notes = {};
  
  // Default time limits (in seconds)
  const defaultTimeLimit = 120; // 2 minutes per person
  const warningTime = 30; // Warning when 30 seconds remaining
  
  onMount(() => {
    if (browser) {
      try {
        // Get participants from localStorage
        const storedParticipants = localStorage.getItem('standupParticipants');
        if (storedParticipants) {
          participants = JSON.parse(storedParticipants);
          
          // Initialize notes object for all participants
          participants.forEach(participant => {
            notes[participant.id] = {
              yesterday: '',
              today: '',
              blockers: ''
            };
          });
          
          // Start meeting timer
          meetingStartTime = new Date();
          startTimer();
          
          // Start first participant's timer
          startParticipantTimer();
        } else {
          // No participants selected, redirect back to home
          goto('/');
        }
      } catch (e) {
        console.error('Error loading participants:', e);
        goto('/');
      }
    }
  });
  
  onDestroy(() => {
    clearInterval(timerInterval);
  });
  
  function startTimer() {
    timerInterval = setInterval(() => {
      const now = new Date();
      timeElapsed = Math.floor((now - meetingStartTime) / 1000);
      
      if (currentStartTime) {
        currentTimeElapsed = Math.floor((now - currentStartTime) / 1000);
      }
    }, 1000);
  }
  
  function startParticipantTimer() {
    currentStartTime = new Date();
    currentTimeElapsed = 0;
  }
  
  function nextParticipant() {
    // Save current participant's notes
    saveCurrentParticipantNotes();
    
    if (currentParticipantIndex < participants.length - 1) {
      currentParticipantIndex++;
      startParticipantTimer();
    } else {
      // End of meeting
      completeMeeting();
    }
  }
  
  function previousParticipant() {
    if (currentParticipantIndex > 0) {
      // Save current participant's notes
      saveCurrentParticipantNotes();
      
      currentParticipantIndex--;
      startParticipantTimer();
    }
  }
  
  function saveCurrentParticipantNotes() {
    // Notes are automatically bound using bind:value, no need to do anything here
    // This function exists as a placeholder for any additional logic needed when saving notes
  }
  
  function completeMeeting() {
    // Save the last participant's notes
    saveCurrentParticipantNotes();
    
    // Clean up timer
    clearInterval(timerInterval);
    
    // Update state to show summary
    meetingCompleted = true;
    
    // In a real app, we might save this data to a backend
    const standupSummary = {
      date: new Date().toISOString(),
      duration: timeElapsed,
      participants: participants.map(p => ({
        ...p,
        notes: notes[p.id]
      }))
    };
    
    // For demo purposes, store in localStorage
    const previousStandups = JSON.parse(localStorage.getItem('previousStandups') || '[]');
    previousStandups.push(standupSummary);
    localStorage.setItem('previousStandups', JSON.stringify(previousStandups));
  }
  
  function resetStandup() {
    // Clear the stored participants and go back to home
    localStorage.removeItem('standupParticipants');
    goto('/');
  }
</script>

<div class="container mx-auto px-4 py-8">
  {#if meetingCompleted}
    <div class="max-w-4xl mx-auto">
      <MeetingSummary
        {timeElapsed}
        {participants}
        {notes}
        onReset={resetStandup}
      />
    </div>
  {:else}
    <div class="max-w-4xl mx-auto">
      <ActiveMeeting
        {participants}
        {currentParticipantIndex}
        {timeElapsed}
        {currentTimeElapsed}
        {notes}
        {defaultTimeLimit}
        {warningTime}
        onNext={nextParticipant}
        onPrevious={previousParticipant}
      />
    </div>
  {/if}
</div>
