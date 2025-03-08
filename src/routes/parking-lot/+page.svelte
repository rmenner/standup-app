<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  
  // Parking lot state
  let parkingLotItems = [];
  let newItemTitle = '';
  let newItemDescription = '';
  let newItemAssignee = '';
  let editingItem = null;
  
  onMount(() => {
    if (browser) {
      // Load items from local storage
      const storedItems = localStorage.getItem('parkingLotItems');
      if (storedItems) {
        try {
          parkingLotItems = JSON.parse(storedItems);
        } catch (e) {
          console.error('Error parsing stored parking lot items:', e);
          parkingLotItems = [];
        }
      }
    }
  });
  
  // Watch for changes to save to local storage
  $: if (browser && parkingLotItems) {
    localStorage.setItem('parkingLotItems', JSON.stringify(parkingLotItems));
  }
  
  function addItem() {
    if (!newItemTitle.trim()) return;
    
    const newItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      description: newItemDescription.trim(),
      assignee: newItemAssignee.trim(),
      dateAdded: new Date().toISOString(),
      status: 'pending' // pending, in-progress, completed
    };
    
    parkingLotItems = [...parkingLotItems, newItem];
    
    // Reset form
    newItemTitle = '';
    newItemDescription = '';
    newItemAssignee = '';
  }
  
  function deleteItem(id) {
    parkingLotItems = parkingLotItems.filter(item => item.id !== id);
  }
  
  function startEditingItem(item) {
    editingItem = { ...item };
  }
  
  function saveEditedItem() {
    if (!editingItem) return;
    
    parkingLotItems = parkingLotItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    
    editingItem = null;
  }
  
  function updateItemStatus(id, newStatus) {
    parkingLotItems = parkingLotItems.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Meeting Parking Lot</h1>
    <button 
      on:click={() => goto('/')}
      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
    >
      Back to Home
    </button>
  </div>
  
  <!-- Add new item form -->
  <div class="bg-white shadow-md rounded-lg p-6 mb-6">
    <h2 class="text-xl font-semibold mb-4">Add Discussion Item</h2>
    
    <div class="grid grid-cols-1 gap-4">
      <div>
        <label for="itemTitle" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input 
          type="text" 
          id="itemTitle"
          placeholder="Enter item title" 
          bind:value={newItemTitle}
          class="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      <div>
        <label for="itemDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
          id="itemDescription"
          placeholder="Enter item description" 
          bind:value={newItemDescription}
          class="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]"
        ></textarea>
      </div>
      
      <div>
        <label for="itemAssignee" class="block text-sm font-medium text-gray-700 mb-1">Assignee (optional)</label>
        <input 
          type="text" 
          id="itemAssignee"
          placeholder="Who should follow up on this?" 
          bind:value={newItemAssignee}
          class="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      <div class="mt-2">
        <button 
          on:click={addItem}
          disabled={!newItemTitle.trim()}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Parking Lot
        </button>
      </div>
    </div>
  </div>
  
  <!-- Items list -->
  {#if parkingLotItems.length === 0}
    <div class="bg-white shadow-md rounded-lg p-6 text-center">
      <p class="text-gray-500">No items in the parking lot. Add something above to get started.</p>
    </div>
  {:else}
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 class="text-lg font-semibold">Parking Lot Items ({parkingLotItems.length})</h2>
      </div>
      
      <ul class="divide-y divide-gray-200">
        {#each parkingLotItems as item (item.id)}
          <li class="p-4 hover:bg-gray-50">
            {#if editingItem && editingItem.id === item.id}
              <!-- Edit mode -->
              <div class="space-y-3">
                <input 
                  type="text" 
                  bind:value={editingItem.title}
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                
                <textarea 
                  bind:value={editingItem.description}
                  class="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px]"
                ></textarea>
                
                <input 
                  type="text" 
                  bind:value={editingItem.assignee}
                  placeholder="Assignee (optional)"
                  class="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                
                <div class="flex gap-2">
                  <button 
                    on:click={saveEditedItem}
                    class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  
                  <button 
                    on:click={() => editingItem = null}
                    class="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            {:else}
              <!-- View mode -->
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span 
                      class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${item.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        ${item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                        ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}`}
                    >
                      {item.status === 'completed' ? 'Completed' : ''}
                      {item.status === 'in-progress' ? 'In Progress' : ''}
                      {item.status === 'pending' ? 'Pending' : ''}
                    </span>
                    <h3 class="text-lg font-medium">{item.title}</h3>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <button 
                      on:click={() => startEditingItem(item)}
                      class="text-gray-500 hover:text-gray-700"
                      aria-label="Edit item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    
                    <button 
                      on:click={() => deleteItem(item.id)}
                      class="text-red-500 hover:text-red-700"
                      aria-label="Delete item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {#if item.description}
                  <p class="mt-2 text-gray-600">{item.description}</p>
                {/if}
                
                <div class="mt-3 flex flex-wrap justify-between items-center text-sm text-gray-500">
                  <div>
                    {#if item.assignee}
                      <span>Assignee: <span class="font-medium">{item.assignee}</span></span>
                    {:else}
                      <span>No assignee</span>
                    {/if}
                  </div>
                  
                  <div>Added: {formatDate(item.dateAdded)}</div>
                </div>
                
                <div class="mt-3 flex gap-2">
                  <select 
                    value={item.status}
                    on:change={(e) => updateItemStatus(item.id, e.target.value)}
                    class="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
