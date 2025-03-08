<script>
  export let notes = {
    yesterday: '',
    today: '',
    blockers: ''
  };
</script>

<div class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      What did you work on yesterday?
    </label>
    <textarea 
      bind:value={notes.yesterday}
      class="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px]"
      placeholder="Enter yesterday's accomplishments..."
    ></textarea>
  </div>
  
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      What are you working on today?
    </label>
    <textarea 
      bind:value={notes.today}
      class="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px]"
      placeholder="Enter today's plans..."
    ></textarea>
  </div>
  
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Any blockers?
    </label>
    <textarea 
      bind:value={notes.blockers}
      class="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px]"
      placeholder="Enter any blockers..."
    ></textarea>
  </div>
</div>
