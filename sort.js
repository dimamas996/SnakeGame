let str =
  "lorem ipsum dolor sit amet consectetur adipisicing elit dolorem repellat enim ratione maiores alias voluptate vero odit possimus dignissimos deleniti quas esse dicta reprehenderit animi cumque corporis eum quae nostrum";
let arrString = str.split(" ");

//console.log(arr);

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      // refer to note below
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

function bubbleSortString(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      // refer to note below
      if (stringCompare(arr[j], arr[j + 1]) === -1) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

function quickSortString(A) {
  if (A.length == 0) return [];
  let a = [], b = [], p = A[0];
  for (let i = 1; i < A.length; i++) {
    if (stringCompare(A[i], p)/* A[i] < p */) a[a.length] = A[i];
    else b[b.length] = A[i];
  }
  return quickSortString(a).concat(p, quickSortString(b));
}

function stringCompare(first, second) {
  for (let k = 0; k < Math.min(first.length, second.length); k++) {
    /* console.log(first.charAt(k), second.charAt(k)); */
    if (first.charCodeAt(k) > second.charCodeAt(k)) {
      return false;
    }
    if (first.charCodeAt(k) < second.charCodeAt(k)) {
      return true;
    }
  }
}

let sortArr = [1, 6, 8, 15, 3, 7, 84, 3, 17, 69];

console.log(arrString.sort());
console.log(quickSortString(arrString));
/* console.log(stringCompare('abcc', 'abca')); */
