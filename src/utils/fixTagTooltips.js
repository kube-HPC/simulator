// fixTagTooltips.js
// Global utility to fix Ant Design tag tooltips

const TOOLTIP_MAPPINGS = {
  qAlgorithmName: 'Algorithm Name',
  qPipelineName: 'Pipeline Name',
  algorithmName: 'Algorithm Name',
  pipelineName: 'Pipeline Name',
  user: 'User',
};

let observer = null;

export const startTooltipFixer = () => {
  // Clean up existing observer
  if (observer) {
    observer.disconnect();
  }

  const fixAllTagTooltips = () => {
    // Find all tags with title attributes
    const tags = document.querySelectorAll('.ant-tag[title]');

    tags.forEach(tag => {
      const currentTitle = tag.getAttribute('title');

      // If the title matches one of our mappings, replace it
      if (TOOLTIP_MAPPINGS[currentTitle]) {
        tag.setAttribute('title', TOOLTIP_MAPPINGS[currentTitle]);
      }
    });
  };

  // Run immediately
  fixAllTagTooltips();

  // Create a MutationObserver to watch for new tags
  observer = new MutationObserver(() => {
    fixAllTagTooltips();
  });

  // Start observing the entire document
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['title'],
  });

  // Also run on interval as a backup
  const interval = setInterval(fixAllTagTooltips, 500);

  // Return cleanup function
  return () => {
    if (observer) observer.disconnect();
    clearInterval(interval);
  };
};

export const stopTooltipFixer = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};
