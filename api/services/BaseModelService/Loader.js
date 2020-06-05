import DataLoader from 'dataloader';

class BaseLoader {
  constructor(keys) {
    this.keys = keys;
  }
}

BaseLoader.loader = function () {
  return () => {
    const Loader = this;

    return new DataLoader(async (keys) => new Loader(keys).load());
  };
};

export default BaseLoader;
