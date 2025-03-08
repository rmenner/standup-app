<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  /**
   * @typedef {Object} ModalProps
   * @property {boolean} [isOpen=false] - Whether the modal is visible
   * @property {string} [title=""] - The modal title/header
   * @property {string} [width="max-w-md"] - The modal width (using Tailwind classes)
   * @property {boolean} [closeOnBackdropClick=true] - Whether clicking the backdrop closes the modal
   * @property {boolean} [showCloseButton=true] - Whether to show the close button
   */

  /** @type {boolean} */
  export let isOpen = false;
  
  /** @type {string} */
  export let title = "";
  
  /** @type {string} */
  export let width = "max-w-md";
  
  /** @type {boolean} */
  export let closeOnBackdropClick = true;
  
  /** @type {boolean} */
  export let showCloseButton = true;

  const dispatch = createEventDispatcher();
  
  /**
   * Close the modal
   */
  function closeModal() {
    dispatch('close');
  }
  
  /**
   * Handle backdrop click
   * @param {MouseEvent} event - The click event
   */
  function handleBackdropClick(event) {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      closeModal();
    }
  }
  
  /**
   * Handle escape key to close modal
   * @param {KeyboardEvent} event - The keyboard event
   */
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
  
  // Focus trap for accessibility
  let modalElement;
  
  onMount(() => {
    if (isOpen) {
      // Lock body scroll when modal opens
      document.body.classList.add('overflow-hidden');
    }
    
    return () => {
      // Restore body scroll when component is destroyed
      document.body.classList.remove('overflow-hidden');
    };
  });
  
  $: if (isOpen) {
    document.body.classList.add('overflow-hidden');
    // Focus the modal when it opens for accessibility
    setTimeout(() => {
      if (modalElement) {
        modalElement.focus();
      }
    }, 0);
  } else {
    document.body.classList.remove('overflow-hidden');
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
    on:click={handleBackdropClick}
    transition:fade={{ duration: 150 }}
  >
    <div
      class="relative bg-white rounded-lg shadow-xl {width} max-h-[90vh] overflow-y-auto flex flex-col"
      role="dialog"
      aria-modal="true"
      bind:this={modalElement}
      tabindex="-1"
      transition:scale={{ start: 0.95, duration: 150 }}
    >
      {#if title || showCloseButton}
        <div class="flex items-center justify-between p-4 border-b">
          {#if title}
            <h3 class="text-lg font-semibold text-gray-900">{title}</h3>
          {:else}
            <div></div>
          {/if}
          
          {#if showCloseButton}
            <button
              type="button"
              class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              on:click={closeModal}
              aria-label="Close modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          {/if}
        </div>
      {/if}
      
      <div class="p-4 flex-1 overflow-y-auto">
        <slot />
      </div>
      
      <div class="p-4 border-t">
        <slot name="footer">
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              on:click={closeModal}
            >
              Close
            </button>
            <slot name="primary-action" />
          </div>
        </slot>
      </div>
    </div>
  </div>
{/if}

