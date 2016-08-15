import {expect} from 'chai';
import lib from './src';

const err = 'No items resolved';

function resolveMe() {
  return Promise.resolve('sup');
}

function rejectMe() {
  return Promise.reject('naw');
}

function throwMe() {
  throw new Error('no thanks');
}

function valueMe() {
  return 'value';
}

describe('chain of promises', function () {
  it('resolves first item (resolved promise)', function () {
    return lib([resolveMe]).then((result) => expect(result).to.equal('sup'));
  });

  it('resolves first item (value)', function () {
    return lib([valueMe]).then((result) => expect(result).to.equal('value'));
  });

  it('resolves subsequent (resolved promise) item if first rejects', function () {
    return lib([rejectMe, resolveMe]).then((result) => expect(result).to.equal('sup'));
  });

  it('resolves subsequent (value) item if first rejects', function () {
    return lib([rejectMe, valueMe]).then((result) => expect(result).to.equal('value'));
  });

  it('resolves subsequent (resolved promise) item if first throws', function () {
    return lib([throwMe, resolveMe]).then((result) => expect(result).to.equal('sup'));
  });

  it('resolves subsequent (value) item if first throws', function () {
    return lib([throwMe, valueMe]).then((result) => expect(result).to.equal('value'));
  });

  it('rejects if all items reject', function () {
    return lib([rejectMe]).catch((e) => expect(e.message).to.equal(err));
  });

  it('rejects if all items throw', function () {
    return lib([throwMe]).catch((e) => expect(e.message).to.equal(err));
  });

  it('rejects it all items reject or throw', function () {
    return lib([throwMe, rejectMe]).catch((e) => expect(e.message).to.equal(err));
  });

  it('rejects if list is empty', function () {
    return lib([]).catch((e) => expect(e.message).to.equal('List must not be empty'));
  });

  it('rejects if list is not an array', function () {
    return lib('lolwhut').catch((e) => expect(e.message).to.equal('List must be an array'));
  });

  it('rejects if items are not functions', function () {
    return lib([1, 2, 3]).catch((e) => expect(e.message).to.equal('List items must be functions'));
  });
});
