<script>
  export let time = 0;
  export let label = '';
  export let timeLimit = null;
  export let warningTime = 30;
  export let colorClass = '';
  export let size = 'normal'; // 'normal' or 'large'
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
  function getTimeClass(time) {
    if (!timeLimit) return colorClass || '';
    
    if (time >= timeLimit) {
      return 'text-red-600';
    } else if (time >= timeLimit - warningTime) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  }
</script>

<div class={getTimeClass(time)}>
  {#if label}
    <span class="text-white text-sm">{label}</span>
  {/if}
  <span class={size === 'large' ? 'text-4xl font-bold' : 'text-xl font-bold'}>
    {formatTime(time)}
  </span>
  {#if timeLimit && size === 'large'}
    <span class="text-sm text-gray-500 block text-center">
      {time >= timeLimit ? 'Over time' : 'of ' + formatTime(timeLimit)}
    </span>
  {/if}
</div>
