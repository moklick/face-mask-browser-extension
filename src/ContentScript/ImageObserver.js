export default class ImageObserver {
  constructor(cb) {
    const imageObserver = new IntersectionObserver(this.onObserve(cb), {
      threshold: 0.2
    });

    return imageObserver;
  }

  onObserve(cb) {
    return entries => {
      entries.forEach(entry => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains('has-mask')
        ) {
          cb(entry.target);
        }
      });
    };
  }
}
