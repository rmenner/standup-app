<script>
  export let participant;
  export let notes;
</script>

<div class="border border-gray-200 rounded-lg p-4">
  <div class="flex items-center mb-3">
    <img 
      src={participant.avatar_url} 
      alt={participant.login} 
      class="h-10 w-10 rounded-full mr-3"
    />
    <div>
      <h3 class="font-medium">{participant.name || participant.login}</h3>
      {#if participant.name}
        <div class="text-sm text-gray-500">@{participant.login}</div>
      {/if}
    </div>
  </div>
  
  <div class="space-y-3 ml-2">
    <div>
      <h4 class="text-sm font-medium text-gray-500 uppercase">Yesterday</h4>
      <p class="mt-1">{notes.yesterday || 'No update provided'}</p>
    </div>
    
    <div>
      <h4 class="text-sm font-medium text-gray-500 uppercase">Today</h4>
      <p class="mt-1">{notes.today || 'No update provided'}</p>
    </div>
    
    <div>
      <h4 class="text-sm font-medium text-gray-500 uppercase">Blockers</h4>
      <p class="mt-1">{notes.blockers || 'No blockers reported'}</p>
    </div>
  </div>
</div>
