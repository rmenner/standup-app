<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  
  // Import components
  import ActiveMeeting from '$lib/components/ActiveMeeting.svelte';
  import MeetingSummary from '$lib/components/MeetingSummary.svelte';
  
  // State management
  let participants = [];
  let availableMembers = [];
  let currentParticipantIndex = 0;
  let meetingStartTime = null;
  let currentStartTime = null;
  let timerInterval = null;
  let timeElapsed = 0;
  let currentTimeElapsed = 0;
  let meetingCompleted = false;
  let githubWindow = null;
  let currentUsername = '';
  let inTriageStep = false;
  let inParkingLotStep = false;
  
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
          
          // Get all available team members from localStorage
          const storedMembers = localStorage.getItem('allTeamMembers');
          if (storedMembers) {
            availableMembers = JSON.parse(storedMembers);
          }
          
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
    
    if (currentParticipantIndex < participants.length - 1) {
      currentParticipantIndex++;
      startParticipantTimer();
    } else {
      // Start triage step instead of ending meeting
      startTriageStep();
    }
  }
  
  function previousParticipant() {
    if (currentParticipantIndex > 0) {
      
      currentParticipantIndex--;
      startParticipantTimer();
    }
  }
  
  function completeMeeting() {   
    // Clean up timer
    clearInterval(timerInterval);
    
    // Update state to show summary
    meetingCompleted = true;
    
    // In a real app, we might save this data to a backend
    const standupSummary = {
      date: new Date().toISOString(),
      duration: timeElapsed,
      participants: participants.map(p => ({
        ...p
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
    localStorage.removeItem('standupParticipants');
    goto('/');
  }
  
  /**
   * Handle participants being updated (e.g., when late participants are added)
   * @param {CustomEvent<{participants: Array}>} event
   */
  function handleParticipantsUpdated(event) {
    // Update the participants array with the new list
    participants = event.detail.participants;
    
    // Update localStorage with the new participants list
    localStorage.setItem('standupParticipants', JSON.stringify(participants));
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
  
  function startTriageStep() {  
    // Set triage mode
    inTriageStep = true;
    
    // Navigate GitHub window to the triage URL
    const triageUrl = 'https://github.com/orgs/AlaskaAirlines/projects/19/views/11';
    if (!githubWindow || githubWindow.closed) {
      // Open a new window if it doesn't exist or is closed
      const windowWidth = Math.round(window.screen.width * 0.65);
      const windowHeight = Math.round(window.screen.height * 0.65);
      const left = Math.round((window.screen.width - windowWidth) / 2);
      const top = Math.round((window.screen.height - windowHeight) / 2);
      
      githubWindow = window.open(
        triageUrl,
        'GitHub Tasks',
        `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
      );
    } else {
      // Update the URL of the existing window
      githubWindow.location.href = triageUrl;
    }
  }
  
  function completeTriage() {
    // Move to the parking lot step after triage
    startParkingLotStep();
  }
  
  function startParkingLotStep() {
    // End triage step and start parking lot step
    inTriageStep = false;
    inParkingLotStep = true;
    
    // List of predefined Unsplash parking lot image URLs
    const parkingLotImages = [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1612917231506-a0825d1bc76d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1536585422010-b58dd25bb946?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1570636802145-8cda1335fe54?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1611275360549-3d49c6280669?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1621831955776-6ce162d24933?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1603543518055-e039d61997ef?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1622204861143-604843f106f3?q=80&w=1583&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1539039599462-d7791d6393f7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1585118213819-c4586ec20965?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];
    
    // Randomly select one of the parking lot images
    const parkingLotUrl = parkingLotImages[Math.floor(Math.random() * parkingLotImages.length)];
    if (!githubWindow || githubWindow.closed) {
      // Open a new window if it doesn't exist or is closed
      const windowWidth = Math.round(window.screen.width * 0.65);
      const windowHeight = Math.round(window.screen.height * 0.65);
      const left = Math.round((window.screen.width - windowWidth) / 2);
      const top = Math.round((window.screen.height - windowHeight) / 2);
      
      githubWindow = window.open(
        parkingLotUrl,
        'GitHub Tasks',
        `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
      );
    } else {
      // Update the URL of the existing window
      githubWindow.location.href = parkingLotUrl;
    }
  }
  
  function completeParkingLot() {
    // Complete the meeting after parking lot
    completeMeeting();
  }
</script>

<div class="container mx-auto px-4 py-8">
  {#if meetingCompleted}
    <div class="max-w-4xl mx-auto">
      <MeetingSummary
        {timeElapsed}
        {participants}
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
        {defaultTimeLimit}
        {warningTime}
        {inTriageStep}
        {inParkingLotStep}
        {availableMembers}
        onNext={inParkingLotStep ? completeParkingLot : (inTriageStep ? completeTriage : nextParticipant)}
        onPrevious={previousParticipant}
        on:participantsUpdated={handleParticipantsUpdated} />
    </div>
  {/if}
  
</div>
