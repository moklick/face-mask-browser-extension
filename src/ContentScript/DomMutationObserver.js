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
        if (typeof mutation !== 'undefined') {
          [].forEach.call(mutation.addedNodes, mut => {
            if (
              (mut.nodeName === 'IMG' || mut.nodeName === 'PICTURE') &&
              !mut.classList.contains('maskedimage')
            ) {
              cb();
            }
          });
        }
      }
    };
  }
}
