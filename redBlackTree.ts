function deepCompare(data1: any, data2: any): boolean {
    if (typeof data1 !== typeof data2) {
        return false;
    }

    if (typeof data1 !== 'object' || data1 === null || data2 === null) return data1 === data2;

    const keys1 = Object.keys(data1);
    const keys2 = Object.keys(data2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!deepCompare(data1[key], data2[key])) return false;
    }

    return true;
}

function compare (data1: any, data2: any): number {
  if (data1 > data2) return 1;
  if(data1 < data2) return -1;
  return 0;
}

class RBNode<K, V> {
  left: RBNode<K, V> | null;
  right: RBNode<K, V> | null;
  parent: RBNode<K, V> | null;
  isBlack: boolean;
  isLeftChild: boolean;
  key: K;
  value: V;
  

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.left = this.right = this.parent = null;
    this.isBlack = false;
    this.isLeftChild = false;
  }
}

type TNodeWithParent<K, V> = Omit<RBNode<K, V>, 'parent'> & { parent: RBNode<K, V> }
 type TNodeWithGrandparent<K, V> = Omit<RBNode<K, V>, 'parent'> & { parent: TNodeWithParent<K, V> }


class RedBlackTree<K, V> {
  root: RBNode<K, V> | null;
  size: number;

  constructor() {
    this.size = 0;
    this.root = null;
  }

  public add(key: K, value: V): void {
    const newNode = new RBNode(key, value);

    if (this.root === null) {
      this.root = newNode;
      this.root.isBlack = true;
      ++this.size;
      return;
    }

    this.addChild(this.root, newNode);
  }

  private addChild(parent: RBNode<K, V>, newNode: RBNode<K, V>): void {
    if (compare(newNode.key, parent.key) >= 0) {
      if (parent.right === null) {
        parent.right = newNode;
        newNode.parent = parent;
        newNode.isLeftChild = false;
        this.checkColor(newNode);
        return;
      }
      return this.addChild(parent.right, newNode);
    }
    if (parent.left === null) {
      parent.left = newNode;
        newNode.parent = parent;
        newNode.isLeftChild = true;
        this.checkColor(newNode);
        return;
    }
    return this.addChild(parent.left, newNode);
  }

  private checkColor(node: RBNode<K, V>): void {
    if (node.parent === null) return;
    if (!node.isBlack && !node.parent.isBlack) {
      this.correctTree(node)
    }
    this.checkColor(node.parent);
  }

  private correctTree(node: RBNode<K, V>): void {
    if (node.parent === null || node.parent.parent === null) return;
     // the aunt is node.parent.parent.rightChild (grandparent's right child)
    if (node.parent.isLeftChild) {
       if (node.parent.parent.right === null || node.parent.parent.right.isBlack) return this.rotate(node as TNodeWithGrandparent<K, V>);

       if (node.parent.parent.right !== null) node.parent.parent.right.isBlack = true;
       node.parent.parent.isBlack = false;
       node.parent.isBlack = true
    }
    // aunt is grandParent.left
     if (node.parent.parent.left === null || node.parent.parent.left.isBlack) return this.rotate(node as TNodeWithGrandparent<K, V>);

       if (node.parent.parent.right !== null) node.parent.parent.right.isBlack = true;
       node.parent.parent.isBlack = false;
       node.parent.isBlack = true
    
  }

  private rotate(node: TNodeWithGrandparent<K, V>): void { 
    if (!node.isLeftChild) {
      if (!node.parent.isLeftChild) {
        this.leftRotate(node.parent.parent);
        node.isBlack = false;
        node.parent.isBlack = true;
        if (node.parent.right !== null) node.parent.right.isBlack = false;
        return;
      }

      this.rightLeftRotate(node.parent.parent);                                               //           a             b
      node.isBlack = true;                                                                    //          /             / \
      node.right!.isBlack = false;                                                            //        b       ->     c   a
      node.left!.isBlack = false;                                                             //       /  
      return;                                                                                 //      c. <- node
    }
    
    if (node.parent.isLeftChild) {
      this.rightRotate(node.parent.parent);
      node.isBlack = false;
      node.parent.isBlack = true;
      if (node.parent.right !== null) node.parent.right.isBlack = false;
      return;
    }

    this.leftRightRotate(node.parent.parent);
    node.isBlack = true;
    node.right!.isBlack = false;
    node.left!.isBlack = false;
    return;
  }

  private leftRotate(node: RBNode<K, V>): void {
    const tmp = node.right as RBNode<K, V>;
    node.right = tmp.left;

    if (node.right !== null) {
      node.right.parent = node;
      node.right.isLeftChild = false;
    }

    if (node.parent === null) { // we are the root node
      this.root = tmp;
      tmp.parent = null;
    } else {
      tmp.parent = node.parent;
      if (node.isLeftChild) {
        tmp.isLeftChild = true;
        tmp.parent.left = tmp;
      } else {
        tmp.isLeftChild = false;
        tmp.parent.right = tmp;
      }
    }

    tmp.left = node;
    node.isLeftChild = true;
    node.parent = tmp;
  }

  private rightRotate(node: RBNode<K, V>): void {
    const tmp = node.left as RBNode<K, V>;

    node.left = tmp.right;
    if (node.left !== null) {
      node.left.parent = node;
      node.left.isLeftChild = true;
    }

    if (node.parent === null) { // we are the root node
      this.root = tmp;
      tmp.parent = null;
    } else {
      tmp.parent = node.parent;
      if (node.isLeftChild) {
        tmp.isLeftChild = true;
        tmp.parent.left = tmp;
      } else {
        tmp.isLeftChild = false;
        tmp.parent.right = tmp;
      }
    }

    tmp.right = node;
    node.isLeftChild = false;
    node.parent = tmp;
  }

  private leftRightRotate(node: RBNode<K, V>): void {
    this.leftRotate(node.left as RBNode<K, V>);
    this.rightRotate(node);
  }

  private rightLeftRotate(node: RBNode<K, V>): void {
    this.rightRotate(node.right as RBNode<K, V>);
  this.leftRotate(node);
  }
}
