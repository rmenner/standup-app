<script>
  export let participant;
</script>

<div class="border border-gray-200 rounded-lg p-4">
  <div class="flex items-center">
    <img 
      src={participant.avatar_url} 
      alt={participant.login} 
      class="h-10 w-10 rounded-full mr-3 border border-gray-300"
    />
    <div>
      <h3 class="font-medium">{participant.name || participant.login}</h3>
      {#if participant.name}
        <div class="text-sm text-gray-500">@{participant.login}</div>
      {/if}
    </div>
  </div>
</div>
