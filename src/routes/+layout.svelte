<script>
  import '../app.css';
  let { children } = $props();
  
  // State for the attribution dialog
  let showDialog = $state(false);
	
	// Toggle dialog visibility
	function toggleDialog(event) {
		if (event) {
			event.stopPropagation();
			event.preventDefault();
		}
		showDialog = !showDialog;
		console.log("Dialog visibility toggled:", showDialog);
	}
	
	// Close dialog when clicking outside
	function handleOutsideEvent(event) {
		const dialog = document.getElementById('attribution-dialog');
		if (dialog && !dialog.contains(event.target) && showDialog) {
			showDialog = false;
		}
	}
</script>

<svelte:window onclick={handleOutsideEvent} />

<div class="layout">
  <main class="content">
    {@render children()}
  </main>
  
  <footer class="footer">
    <div class="footer-content">
      <!-- Rocket icon that triggers the dialog -->
      <div class="rocket-container group" onclick={toggleDialog} onkeydown={(e) => e.key === 'Enter' && toggleDialog(e)} tabindex="0" role="button" aria-label="About the creator">
        <svg class="rocket-icon text-gray-300 -rotate-5 animate-rocket hover:animate-rocket-wiggle transition-colors group-hover:text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 101.41">
          <path d="M61.77,50.75A18.77,18.77,0,0,1,76.61,68.92a43.35,43.35,0,0,1-2.35,14.59c-1.42,4.6-2.88,9.19-5.55,13.26a14.24,14.24,0,0,1-2.21,2.45,2.23,2.23,0,0,1-2.77.49,3,3,0,0,1-1.49-2.89c.09-1.72.29-3.46.23-5.18-.12-4.08-1.26-7.77-4.37-10.65A13.15,13.15,0,0,0,52.33,78c-1.14,2-2.31,4.07-3.4,6.14a1.29,1.29,0,0,1-1.39.78c-1.86-.06-3.73-.07-5.63-.1-.41,4.21-.23,8.32-1.42,12.23l-.46,0a12.69,12.69,0,0,1-.59-2.06c-.33-3-.59-5.92-.87-8.89,0-.37,0-.75-.08-1.19-2,0-4,0-6,0a1.25,1.25,0,0,1-1.3-.76c-1.12-2.06-2.31-4.09-3.52-6.22-4,1.2-7.12,3.52-8.77,7.53-1.42,3.48-1.42,7.09-1,10.75a4.85,4.85,0,0,1-.09,1.94c-.58,1.87-2.32,2.53-3.82,1.3a14.45,14.45,0,0,1-3-3.48c-2.47-4-3.87-8.41-5.26-12.83A44.3,44.3,0,0,1,3.37,71.16c-.12-5.06,1-9.77,4.24-13.79A19.2,19.2,0,0,1,17.86,51c-.21-3.55-.6-7.11-.6-10.66A45.37,45.37,0,0,1,38.64,1.58a1.76,1.76,0,0,1,2.15,0C51.68,8.46,58.67,18.13,61.47,30.74a52.32,52.32,0,0,1,.44,18.92C61.87,50,61.82,50.34,61.77,50.75Z" fill="currentColor"></path>
        </svg>

        {#if showDialog}
          <div id="attribution-dialog" class="attribution-dialog px-4 py-2 bg-white shadow-md border border-gray-200">
              Created by
              <a href="https://ryanmenner.com" target="_blank" rel="noopener noreferrer">Ryan Menner</a>
              <a href="https://github.com/rmenner" target="_blank" rel="noopener noreferrer" aria-label="@rmenner">
                <svg class="inline-block w-4 h-4 align-text-bottom mx-1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
          </div>
        {/if}
      </div>
      
      <!-- Attribution dialog -->
      
    </div>
  </footer>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .content {
    flex: 1;
  }
  
  .footer {
    text-align: right;
    font-size: 0.9rem;
    margin-top: auto;
  }
  
  .footer-content {
    margin: 0 auto;
    position: relative;
    display: flex;
    justify-content: right;
  }
  
  .footer a {
    color: #3b82f6;
    text-decoration: none;
  }
  
  .footer a:hover {
    text-decoration: underline;
  }
  
  /* Rocket icon styles */
  .rocket-container {
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }
  
  .rocket-icon {
    width: 30px;
    height: 30px;
    transition: transform 0.3s ease, color 0.3s ease;
  }
  
  .rocket-container:hover .rocket-icon {
    animation: float 2s ease-in-out infinite;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  
  /* Dialog styles */
  
  .attribution-dialog {
    border-radius: 8px;
    text-align: right;
    animation: pop-in 0.3s ease-out forwards;
    position: absolute;
    z-index: 100;
    bottom: 10px;
    right: 40px;
  }
  
  @keyframes pop-in {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
</style>
