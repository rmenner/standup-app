<script>
  import { page } from '$app/stores';
  
  // Prop to allow customizing the current section/page for breadcrumbs
  export let currentSection = null;
  
  // Generate breadcrumbs based on the current URL path
  $: path = $page.url.pathname;
  $: pathSegments = path.split('/').filter(segment => segment);
  
  // Map route segments to human-readable names
  const routeNames = {
    '': 'Home',
    'standup': 'Standup',
    'triage': 'Triage',
    'parking-lot': 'Parking Lot'
  };
  
  // Get the display name for a route segment
  function getRouteName(segment) {
    return routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  }
  
  // Generate breadcrumb items
  $: breadcrumbs = [
    { name: 'Home', path: '/' },
    ...pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      return { 
        name: getRouteName(segment), 
        path 
      };
    })
  ];
  
  // Use custom section name if provided
  $: if (currentSection) {
    const lastIndex = breadcrumbs.length - 1;
    if (lastIndex >= 0) {
      breadcrumbs[lastIndex].name = currentSection;
    }
  }
</script>

<header class="bg-white border-b border-gray-200 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo section -->
      <div class="flex items-center">
        <a href="/" class="flex-shrink-0">
          <!-- Alaska Airlines Logo (simplified SVG version) -->
          <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Alaska Airlines">
            <path d="M114.121 8.901L111.047 17.296L107.972 8.901H104.414L109.732 21.612H112.361L117.679 8.901H114.121Z" fill="#0074CB"/>
            <path d="M96.4728 8.901L90.3188 21.612H93.722L95.0099 18.829H101.634L102.922 21.612H106.48L100.326 8.901H96.4728ZM96.1633 16.046L98.3218 11.376L100.48 16.046H96.1633Z" fill="#0074CB"/>
            <path d="M71.7108 8.901V21.612H82.5029V18.829H75.2688V16.354H81.9869V13.571H75.2688V11.684H82.5029V8.901H71.7108Z" fill="#0074CB"/>
            <path d="M62.4807 8.901V21.612H65.8838V8.901H62.4807Z" fill="#0074CB"/>
            <path d="M16.2945 14.2148C17.3187 10.6888 16.3153 8.20952 13.8356 7.10663C11.2399 5.95345 8.20558 6.53268 6.2373 8.3823L0 14.2148H16.2945Z" fill="#0074CB"/>
            <path d="M9.31157 25.3044C12.6684 28.4636 16.6658 28.2693 18.2401 24.7839C19.9227 21.0678 18.2401 17.351 16.2945 14.2148H0L9.31157 25.3044Z" fill="#0F4273"/>
            <path d="M53.9392 17.4973V21.6121H50.5362V17.3799L45.8232 8.9013H49.5327L52.1999 14.0288L54.9025 8.9013H58.652L53.9392 17.4973Z" fill="#0074CB"/>
            <path d="M37.3232 8.901V21.612H40.7262V17.118H46.7232V21.612H50.1262V8.901H46.7232V14.335H40.7262V8.901H37.3232Z" fill="#0074CB"/>
            <path d="M26.4452 8.901V16.897C26.4452 17.646 26.8912 18.237 27.5812 18.556L32.2582 20.974V21.612H35.6612V8.901H32.2582V17.059L29.8482 16.044V8.901H26.4452Z" fill="#0074CB"/>
          </svg>
        </a>
        
        <!-- App name -->
        <div class="ml-4 text-auro-dark-blue font-semibold text-lg">
          Standup Manager
        </div>
      </div>
      
      <!-- Right side actions (optional) -->
      <div class="flex items-center space-x-4">
        <!-- This could include user profile, settings, etc. -->
      </div>
    </div>
    
    <!-- Breadcrumb navigation -->
    <div class="flex items-center py-2 overflow-x-auto scrollbar-hide">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-1 text-sm">
          {#each breadcrumbs as crumb, i}
            <li class="flex items-center">
              {#if i > 0}
                <svg class="h-4 w-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
              {/if}
              
              {#if i === breadcrumbs.length - 1}
                <span class="text-auro-blue font-medium" aria-current="page">{crumb.name}</span>
              {:else}
                <a href={crumb.path} class="text-gray-500 hover:text-auro-blue transition-colors duration-150">
                  {crumb.name}
                </a>
              {/if}
            </li>
          {/each}
        </ol>
      </nav>
    </div>
  </div>
</header>

