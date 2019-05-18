export default class Promise {
  constructor() {
    this.value = null;
    this.onResolve = [];
    this.onRejection = [];
    this.status = 'pending';
  }
  then(fn) {
    if (this.status === 'resolved') {
      fn(this.value);
    }
    if (typeof fn === 'function') {
      this.onResolve.push(fn);
      return this;
    } else {
      //TODO: Should user be notified this isn't ideal?
      return;
    }
  }
  resolve(value) {
    this.value = value;
    this.status = 'resolved';
    this.onResolve.forEach(function handleResolve(fn) {
      fn(value);
    });
  }
  reject(error) {
    this.value = error;
    this.status = 'rejected';
    this.onRejection.forEach(function handleRejection(fn) {
      fn(error);
    });
  }
  catch(fn) {
    this.onRejection.push(fn);
    return this;
  }
  static all(...args) {
    let resolvedCount = 0;
    const returnVals = [];
    const localPromise = new Promise();
    args.forEach((promise, i) => {
      promise.then(value => {
        returnVals[i] = value;
        resolvedCount += 1;
        if (resolvedCount === args.length) {
          localPromise.resolve(returnVals);
        }
      });
    });
    return localPromise;
  }
}
