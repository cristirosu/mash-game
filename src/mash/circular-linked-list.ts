export class ListNode<T> {
    public value: T;
    public next: ListNode<T> | null;

    constructor(value: T) {
        this.value = value;
        this.next = null;
    }
}

export class CircularLinkedList<T> {
    head: ListNode<T> | null;
    private tail: ListNode<T> | null;
    private size: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    public getSize(): number {
        return this.size;
    }

    public isEmpty(): boolean {
        return this.size === 0;
    }

    public append(value: T): void {
        const newNode = new ListNode(value);

        if (this.isEmpty()) {
            this.head = newNode;
            this.tail = newNode;
            newNode.next = this.head;
        } else {
            newNode.next = this.head;
            this.tail!.next = newNode;
            this.tail = newNode;
        }

        this.size++;
    }

    public prepend(value: T): void {
        const newNode = new ListNode(value);

        if (this.isEmpty()) {
            this.head = newNode;
            this.tail = newNode;
            newNode.next = this.head;
        } else {
            newNode.next = this.head;
            this.head = newNode;
            this.tail!.next = newNode;
        }

        this.size++;
    }

    public remove(value: T): void {
        if (this.isEmpty()) {
            return;
        }

        let currentNode = this.head;
        let prevNode: ListNode<T> | null = null;

        while (currentNode !== null) {
            if (currentNode.value === value) {
                if (currentNode === this.head) {
                    this.head = this.head.next;

                    if (this.head === this.tail) {
                        this.tail = null;
                    } else {
                        this.tail!.next = this.head;
                    }
                } else if (currentNode === this.tail) {
                    prevNode!.next = this.head;
                    this.tail = prevNode;
                } else {
                    prevNode!.next = currentNode.next;
                }

                this.size--;
                break;
            }

            prevNode = currentNode;
            currentNode = currentNode.next;
        }
    }

    public indexOf(value: T): number {
        let node = this.head;
        if (node == value) {
            return 0;
        }
        if (this.tail!!.value == value) {
            return this.getSize() - 1;
        }

        let counter = 0;
        while (node?.next != this.head) {
            if (node?.value == value) {
                return counter;
            }
            node = node!!.next;
            counter++;
        }

        return -1;
    }

    nodeAt(offset: number): ListNode<T> | null {
        let node = this.head;
        let counter = 0;

        if (node != null) {
            while (counter < offset) {
                node = node!!.next;
                counter++;
            }
        }

        return node
    }
}