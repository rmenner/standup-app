    }
  }

  function handlePlayPauseClick() {
    dispatch('togglePause');
  }
</script>
      <div class="grid-cols-1 flex justify-end gap-2">
        <button
          on:click={handlePlayPauseClick}
          class="px-3 py-1 {isPaused ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'} text-white rounded-lg text-sm font-medium cursor-pointer flex items-center"
        >
          {#if isPaused}
            <!-- Play icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
            Play
          {:else}
            <!-- Pause icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Pause
          {/if}
        </button>
        <button
          on:click={openLateParticipantModal}
          class="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 cursor-pointer"
        >
          Add Participant
        </button>
      </div>
