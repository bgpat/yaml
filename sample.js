const yaml = require('./');
console.log(new yaml.Hash({
  list: ['abc', 123, true, null, { name: 'hoge', value: 100 }, { name: false }, [1, 2]],
  hash: {
    number: 1,
    string: 'abc',
    boolean: false,
    null: null,
  },
}).toString());
