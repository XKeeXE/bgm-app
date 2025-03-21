import { track } from "./types";

// MinHeap.js
class MinHeap {
    heap: track[];
    constructor() {
        this.heap = [];
    }


    clear() {
        this.heap = []
    }

    insert(track: track) {
        this.heap.push(track);
        this.bubbleUp();
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0 && end) {
            this.heap[0] = end;
            this.bubbleDown();
        }
        return min;
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].queue.pos >= this.heap[parentIndex].queue.pos) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    bubbleDown() {
        let index = 0;
        const length = this.heap.length;
        const element = this.heap[0];

        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < length) {
                leftChild = this.heap[leftChildIndex];
                if (leftChild && leftChild.queue && leftChild.queue.pos < element.queue.pos) {
                    swap = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                rightChild = this.heap[rightChildIndex];
                if (
                    (swap === null && rightChild.queue && rightChild.queue.pos < element.queue.pos) ||
                    (swap !== null && rightChild.queue && rightChild.queue.pos < (leftChild?.queue?.pos ?? Infinity))
                ) {
                    swap = rightChildIndex;
                }
            }

            if (swap === null) break;
            this.heap[index] = this.heap[swap];
            this.heap[swap] = element;
            index = swap;
        }
    }

    remove(track: track) {
        const index = this.heap.findIndex(tracks => tracks.id === track.id); // Find the index of the track to remove
        if (index === -1) return; // Track not found

        const lastElement = this.heap.pop(); // Remove the last element
        if (lastElement !== undefined) {
            if (index < this.heap.length) { // If the removed element is not the last one
                this.heap[index] = lastElement; // Replace it with the last element
                this.bubbleDownFromIndex(index); // Restore the heap property
            }
        }
    }

    // Bubble down from a specific index
    bubbleDownFromIndex(index: number) {
        const length = this.heap.length;
        const element = this.heap[index];

        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < length) {
                leftChild = this.heap[leftChildIndex];
                if (leftChild && leftChild.queue.pos < element.queue.pos) {
                    swap = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                rightChild = this.heap[rightChildIndex];
                if (
                    (swap === null && rightChild.queue && rightChild.queue.pos < element.queue.pos) ||
                    (swap !== null && rightChild.queue && rightChild.queue.pos < (leftChild?.queue?.pos ?? Infinity))
                ) {
                    swap = rightChildIndex;
                }
            }

            if (swap === null) break;
            this.heap[index] = this.heap[swap];
            this.heap[swap] = element;
            index = swap;
        }
    }

    getNextTenTracks() {
        const result = [];
        const tempHeap = [...this.heap]; // Create a copy of the original heap
    
        // Continue until we have 10 tracks or we run out of tracks
        while (result.length < 10 && tempHeap.length > 0) {
            // Find the index of the track with the smallest queue.pos
            let minIndex = 0;
            for (let j = 1; j < tempHeap.length; j++) {
                if (tempHeap[j].queue.pos < tempHeap[minIndex].queue.pos) {
                    minIndex = j;
                }
            }
    
            // Add the smallest track to the result
            result.push(tempHeap[minIndex]);
    
            // Remove the smallest track from the temporary heap
            tempHeap.splice(minIndex, 1);
        }
    
        return result;
    }

    length() {
        return this.heap.length;
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

export default MinHeap;
