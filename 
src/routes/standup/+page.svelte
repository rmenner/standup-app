  function completeTriage() {
    // Move to the parking lot step after triage
    startParkingLotStep();
  }
  
  function startParkingLotStep() {
    // End triage step and start parking lot step
    inTriageStep = false;
    inParkingLotStep = true;
    
    // Navigate GitHub window to a random parking lot image from Unsplash
    const parkingLotUrl = "https://source.unsplash.com/random/?parking,lot";
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
        {warningTime}
        {inTriageStep}
        {inParkingLotStep}
        onNext={inParkingLotStep ? completeParkingLot : (inTriageStep ? completeTriage : nextParticipant)}
        onPrevious={previousParticipant} />
