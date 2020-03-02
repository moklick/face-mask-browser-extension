export default class DomMutationObserver {
  constructor(cb) {
    const mutationObserver = new MutationObserver(this.onMutate(cb));

    mutationObserver.observe(document.body, {
      attributes: false,
      childList: true,
      subtree: true
    });

    return mutationObserver;
  }

  onMutate(cb) {
    return mutationsList => {
      for (let mutation of mutationsList) {
        [].forEach.call(mutation.addedNodes, mutation => {
          if (
            (mutation.nodeName === 'IMG' || mutation.nodeName === 'PICTURE') &&
            !mutation.classList.contains('maskedimage')
          ) {
            cb();
          }
        });
      }
    };
  }
}
