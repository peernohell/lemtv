import { writable } from 'svelte/store';

const count = writable(0);

export default count;

count.set(1); // logs '1'

count.update(n => n + 1); // logs '2'