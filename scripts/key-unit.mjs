import assert from 'node:assert/strict';
import {extractKeys,matchKeys} from '../src/answerKey.ts';
const p=text=>({text,regions:[]});
const keys=extractKeys([p('Test 1\n1. Soru metni A) B) C)'),p('CEVAP ANAHTARI\nTEST 1\n1-C 2-D 3-D 4-B\nTEST 2\nSoru No 1 2 3 4\nCevap C B E B')]);
assert.equal(keys.length,8);
const qs=[{id:'a',number:2,test:'test-1'},{id:'b',number:2,test:'test-2'}];
assert.equal(matchKeys(qs,keys).a.letter,'D');assert.equal(matchKeys(qs,keys).b.letter,'B');
assert.equal(matchKeys([{id:'a',number:2},{id:'b',number:2}],keys).a.status,'ambiguous');
const conflict=extractKeys([p('Cevap anahtarı\n1-A\n1-B\n2. C\n3 | D\n4) E\n5. Bu bir çözüm.')]);
assert.equal(matchKeys([{id:'x',number:1}],conflict).x.status,'ambiguous');
assert.equal(matchKeys([{id:'x',number:3}],conflict).x.letter,'D');
assert.equal(matchKeys([{id:'x',number:5}],conflict).x.status,'missing');
assert.equal(extractKeys([p('1-A 2-B 3-C')]).length,0);
console.log('PASS numbered pairs, tables, scoped keys, conflicts and non-key text');

assert.deepEqual(extractKeys([p('Cevap anahtarı\n1-4: A B C D')]).map(x=>x.letter),['A','B','C','D']);

const named=extractKeys([p('Cevap anahtarı\nMatematik Testi\n1-A\nTürkçe\n1-D')]);assert.equal(matchKeys([{id:'m',number:1,test:'subject-matematik'},{id:'t',number:1,test:'subject-turkce'}],named).t.letter,'D');
