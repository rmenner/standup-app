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
  let githubWindow = null;
  let currentUsername = '';
  
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
          
          // Open GitHub window with the first participant's username
          if (participants.length > 0) {
            currentUsername = participants[0].login || '';
            openOrUpdateGithubWindow(currentUsername);
          }
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
    // Close GitHub window if it exists
    closeGithubWindow();
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
    
    // Update current username and GitHub window when participant changes
    if (participants[currentParticipantIndex]) {
      currentUsername = participants[currentParticipantIndex].login || '';
      openOrUpdateGithubWindow(currentUsername);
    }
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
  
  function openOrUpdateGithubWindow(username) {
    const url = `https://github.com/orgs/AlaskaAirlines/projects/19/views/99?sliceBy%5Bvalue%5D=${username}`;
    const windowWidth = Math.round(window.screen.width * 0.65);
    const windowHeight = Math.round(window.screen.height * 0.65);
    const left = Math.round((window.screen.width - windowWidth) / 2);
    const top = Math.round((window.screen.height - windowHeight) / 2);
    
    if (!githubWindow || githubWindow.closed) {
      // Open a new window if it doesn't exist or is closed
      githubWindow = window.open(
        url,
        'GitHub Tasks',
        `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
      );
    } else {
      // Update the URL of the existing window
      githubWindow.location.href = url;
    }
  }
  
  function closeGithubWindow() {
    if (githubWindow && !githubWindow.closed) {
      githubWindow.close();
      githubWindow = null;
    }
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
