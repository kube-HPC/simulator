export default class TreeNode {
  static iterFunction(fn, depth = 0) {
    return node => fn(node.value, node, depth);
  }

  static searchFunction(search) {
    if (typeof search === 'function') {
      return search;
    }

    return (value, node) =>
      search instanceof TreeNode ? node === search : value === search;
  }

  constructor(value, children = []) {
    this.value = value;
    this.children = children;
  }

  get depth() {
    return this.children.reduce(
      (depth, child) => Math.max(child.depth + 1, depth),
      1
    );
  }

  get size() {
    let i = 0;
    this.walk(() => i++);
    return i;
  }

  addChild(child) {
    this.children.push(child instanceof TreeNode ? child : new TreeNode(child));
    return this;
  }

  find(search) {
    const searchFn = TreeNode.iterFunction(TreeNode.searchFunction(search));
    if (searchFn(this)) {
      return this;
    }
    for (let i = 0; i < this.children.length; i++) {
      const result = this.children[i].find(search);
      if (result) {
        return result;
      }
    }
    return null;
  }

  getPath(search) {
    const searchFn = TreeNode.iterFunction(TreeNode.searchFunction(search));

    const findPath = (currentNode, currentPath) => {
      // skip if we already found the result
      const attempt = currentPath.concat([currentNode]);
      // base case: return the array when there is a match
      if (searchFn(currentNode)) {
        return attempt;
      }
      for (let i = 0; i < currentNode.children.length; i++) {
        const child = currentNode.children[i];
        const match = findPath(child, attempt);
        if (match) {
          return match;
        }
      }
      return null;
    };

    return findPath(this, []);
  }

  walk(fn, depth = 0) {
    TreeNode.iterFunction(fn, depth)(this);
    this.children.forEach(child => child.walk(fn, depth + 1));
  }
}
