const elements = 20_000;

// mesure time to insert ${elements} strings
const start0 = Date.now();
for (let i = 0; i < elements; i++) {
    await client.set(`key:${i}`, 'Test');
}
const end0 = Date.now();
console.log(`Insert ${elements} strings in ${end0 - start0}ms`);

// mesure time to get ${elements} strings
const start2 = Date.now();
for (let i = 0; i < elements; i++) {
    await client.get(`key:${i}`);
}
const end2 = Date.now();
console.log(`Get ${elements} strings in ${end2 - start2}ms`);


// mesure time to insert ${elements} users
const start = Date.now();
for (let i = 0; i < elements; i++) {
    await client.hSet(`user-session:${i}`, {
        name: 'John',
        surname: 'Smith',
        company: 'Redis',
        age: 29
    })
}
const end = Date.now();
console.log(`Insert ${elements} users in ${end - start}ms`);

// mesure time to get ${elements} users
const start1 = Date.now();
for (let i = 0; i < elements; i++) {
    await client.hGetAll(`user-session:${i}`);
}
const end1 = Date.now();
console.log(`Get ${elements} users in ${end1 - start1}ms`);

const averageElementTime = (end + end1 + end2 + end0 - start - start1 - start2 - start0) / (4 * elements);
console.log(`Average time per element: ${averageElementTime}ms`);
