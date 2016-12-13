class YAML {
  constructor(option) {
    this.$option = option || {};
  }

  convert(obj) {
    if (obj instanceof YAML) {
      if (obj.$null) {
        return null;
      }
      return obj;
    } else if (Array.isArray(obj)) {
      return new List(obj, this.$option);
    } else if (obj === null) {
      return new Scalar('null', this.$option);
    } else if (typeof obj === 'object') {
      return new Hash(obj, this.$option);
    } else if (obj == null) {
      return null;
    }
    return new Scalar(obj, this.$option);
  }

  indent() {
    return this.toString().replace(/^|\n/g, `\n${this.tab}`);
  }

  toString() {
    return this.range.map(([key, value]) => {
      return this.format(key, value);
    }).join('\n');
  }

  get tab() {
    return Array((this.$option.tabstops || 2) + 1).join(' ');
  }

  get range() {
    let list = [];
    for (let key in this) {
      if (key.charAt(0) === '$') {
        continue;
      }
      list.push([key, this[key]]);
    }
    return list;
  }
}

class Hash extends YAML {
  constructor(obj, option) {
    super(option);
    let count = 0;
    for (let key in obj) {
      let value = this.convert(obj[key]);
      if (value == null) {
        continue;
      }
      this[key] = value;
      count++;
    }
    if (!count) {
      this.$null = true;
    }
  }

  format(key, value) {
    return `${key}:${value.indent()}`;
  }
}

class List extends YAML {
  constructor(list, option) {
    super(option);
    list = list || [];
    if (!list.length) {
      this.$null = true;
      return;
    }
    for (let i = 0; i < list.length; i++) {
      this[i] = this.convert(list[i]);
    }
    this.$length = list.length;
  }

  format(key, value) {
    let text = value.indent();
    if (value instanceof Hash) {
      text = text.replace(/^\s*/, ' ');
    }
    return `-${text}`;
  }
}

class Scalar extends YAML {
  constructor(value, option) {
    super(option);
    this.value = value;
  }

  indent() {
    return ` ${this.toString()}`;
  }

  toString() {
    return this.value.toString();
  }
}

module.exports = { Hash, List, Scalar };
