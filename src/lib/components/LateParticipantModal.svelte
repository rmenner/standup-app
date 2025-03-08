<script>
  import Modal from './Modal.svelte';
  import TeamMemberSelector from './TeamMemberSelector.svelte';
  import { createEventDispatcher } from 'svelte';

  /**
   * @typedef {Object} Member
   * @property {number} id - Unique identifier for the member
   * @property {string} login - Username of the team member
   * @property {string} avatar_url - URL to the member's avatar image
   * @property {string} [name] - Optional display name of the team member
   */

  /** @type {Member[]} */
  export let members = [];
  
  /** @type {number[]} */
  export let alreadySelectedIds = [];
  
  /** @type {boolean} */
  export let isOpen = false;
  
  /** @type {boolean} */
  export let loading = false;
  
  /** @type {string | null} */
  export let error = null;

  /** @type {number[]} */
  let selectedMemberIds = [];

  const dispatch = createEventDispatcher();

  /**
   * Filter out members that are already in the meeting
   * @type {Member[]}
   */
  $: availableMembers = members.filter(member => !alreadySelectedIds.includes(member.id));

  /**
   * Handle selection change from TeamMemberSelector
   * @param {CustomEvent<{selectedIds: number[], selectedMembers: Member[]}>} event
   */
  function handleSelectionChange(event) {
    selectedMemberIds = event.detail.selectedIds;
  }

  /**
   * Add selected late participants and close the modal
   */
  function addLateParticipants() {
    if (selectedMemberIds.length > 0) {
      const lateParticipants = members.filter(member => selectedMemberIds.includes(member.id));
      dispatch('addParticipants', lateParticipants);
      selectedMemberIds = [];
      dispatch('close');
    }
  }

  /**
   * Close the modal without adding participants
   */
  function closeModal() {
    selectedMemberIds = [];
    dispatch('close');
  }
</script>

<Modal isOpen={isOpen} on:close={closeModal} title="Add Late Participants">
  {#if availableMembers.length === 0}
    <p class="text-gray-500 text-center py-4">
      All team members are already in the meeting.
    </p>
  {:else}
    <p class="mb-4 text-gray-700">
      Select team members who are joining the meeting late:
    </p>
    
    <TeamMemberSelector 
      members={availableMembers}
      initialSelectedIds={selectedMemberIds}
      {loading}
      {error}
      showHeader={false}
      showStartButton={false}
      on:selectionChange={handleSelectionChange}
    />
  {/if}
  <div slot="footer" class="flex justify-end space-x-2">
    <button 
      class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
      on:click={closeModal}
    >
      Cancel
    </button>
    
    <button 
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={selectedMemberIds.length === 0}
      on:click={addLateParticipants}
    >
      Add to Meeting
    </button>
  </div>
</Modal>

