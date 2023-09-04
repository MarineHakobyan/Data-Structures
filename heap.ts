// implement deep copy for storing and comparison if the T is not a simple data type
class MinHeap<T> {
  heap: T[];
  size: number;
  constructor(data: T[]) {
    this.heap = [];
    this.size = 0;

    for (const item of data) {
      this.add(item)
    }
  }

  private getLeftChildIndex(parentIndex: number): number {
    return parentIndex * 2 + 1;
  }
  private getRightChildIndex(parentIndex: number): number {
    return parentIndex * 2 + 2;
  }
  private getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2 );
  }

  private leftChild(index: number): T {
    return this.heap[this.getLeftChildIndex(index)];
  }
  private rightChild(index: number): T {
    return this.heap[this.getRightChildIndex(index)];
  }  
  private parent(index: number): T {
    return this.heap[this.getParentIndex(index)];
  }

  private hasLeftChild(index: number): boolean {
    return this.getLeftChildIndex(index) < this.size;
  }
  private hasRightChild(index: number): boolean {
    return this.getRightChildIndex(index) < this.size;
  }
  private hasParent(index: number): boolean {
    return this.getParentIndex(index) >= 0;
  }

  private swap(indexOne: number, indexTwo: number): void {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  public peek(): T {
    if (this.size === 0) throw new Error("empty heap");
    return this.heap[0];
  }

  public poll(): T {
    const item = this.peek();
    this.heap[0] = this.heap[this.size - 1];
    --this.size;
    this.heapifyDown();
    this.heap.pop();
    return item;
  }

  public add(item: T): void {
    this.heap[this.size] = item;
    ++this.size;
    this.heapifyUp();
  }

  public heapifyUp(): void {
    let index = this.size - 1;

    while (this.hasParent(index) && this.parent(index) > this.heap[index]) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  public heapifyDown(): void {
    let index = 0;

    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);

      if (this.hasRightChild(index) && this.rightChild(index) < this.leftChild(index)) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.heap[index] < this.heap[smallerChildIndex]) break;
      
      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }
}

function testMinHeap() {
    const testData = [-9,0,3, 1, 4, 1, 5, 9, 2, -8, 0, 6, 5];
    const minHeap = new MinHeap<number>(testData);

console.log('unsorted heap: ',minHeap.heap)

    const sortedArray: number[] = [];
    while (minHeap.size > 0) {
        sortedArray.push(minHeap.poll());
    }
    console.log("Sorted Array:", sortedArray); 
}

testMinHeap();
