<script>
  import { onMount } from 'svelte';
  import Modal from './Modal.svelte';
  
  export let isOpen = false;
  export let timeElapsed = 0;
  export let participants = [];
  
  let copied = false;
  let markdownContent = '';
  
  // Format time in minutes:seconds
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
  // Generate markdown content based on meeting data
  function generateMarkdown() {
    const date = new Date().toLocaleDateString();
    const totalParticipants = participants.length;
    const avgTimePerPerson = Math.floor(timeElapsed / totalParticipants);
    
    let markdown = `# Standup Summary - ${date}\n\n`;
    markdown += `## Meeting Statistics\n`;
    markdown += `- **Total Time:** ${formatTime(timeElapsed)}\n`;
    markdown += `- **Participants:** ${totalParticipants}\n`;
    markdown += `- **Avg. Time Per Person:** ${formatTime(avgTimePerPerson)}\n\n`;
    
    markdown += `## Participants\n\n`;
    
    participants.forEach(participant => {
      const displayName = participant.name || participant.login;
      markdown += `- **${displayName}**`;
      if (participant.name) {
        markdown += ` (@${participant.login})`;
      }
      markdown += '\n';
    });
    
    return markdown;
  }
  
  // Copy markdown to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(markdownContent)
      .then(() => {
        copied = true;
        setTimeout(() => {
          copied = false;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }
  
  // Update markdown content whenever participants or timeElapsed changes
  $: markdownContent = generateMarkdown();
  
  // Close modal handler
  function handleClose() {
    isOpen = false;
  }
</script>

<Modal
  {isOpen}
  title="Export Standup Summary"
  on:close={handleClose}
>
  <div class="markdown-preview">
    
    <div class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-auto mb-4 font-mono text-sm whitespace-pre">
      {markdownContent}
    </div>
  </div>
  
  <svelte:fragment slot="footer">
    <div class="flex justify-end space-x-2">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        on:click={handleClose}
      >
        Close
      </button>
      
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors duration-200"
        class:bg-green-600={copied}
        class:hover:bg-green-700={copied}
        class:bg-blue-600={!copied}
        class:hover:bg-blue-700={!copied}
        on:click={copyToClipboard}
      >
        {#if copied}
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Copied!
          </span>
        {:else}
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
            </svg>
            Copy to Clipboard
          </span>
        {/if}
      </button>
    </div>
  </svelte:fragment>
</Modal>

