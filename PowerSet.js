function PowerSet(set){
	if(!new.target){
		return new PowerSet(set);
	}

	if(!(set instanceof Array)){
		throw new Error('set must be an array');
	}
	const elements = set || [];

	function maskSubset(bitSet){
		const subset = [];
		for(let off=0; off<elements.length; ++off){
			const mask = 0b1 << off;
			if(bitSet & mask){
				subset.push(elements[off]);
			}
		}
		return subset;
	}

	Object.defineProperties(this, {
		add: {
			enumerable: true,
			value: function(e){
				if(elements.length<64){
					elements.push(e);
				}else{
					throw 'PowerSet supports only sets with up to 64 elements';
				}
			}
		},
		clear: {
			enumerable: true,
			value: function(){
				elements.length = 0;
			}
		},
		delete: {
			enumerable: true,
			value: function(val){
				const i = elements.indexOf(val);
				if(i > -1){
					elements.splice(i, 1);
					return true;
				}else{
					return false;
				}
			}
		},
		has: {
			enumerable: true,
			value: function(val){
				return elements.indexOf(val) !== -1;
			}
		},
		get: {
			enumerable: true,
			value: function(bitSet){
				return maskSubset(bitSet);
			}
		},
		keys: {
			enumerable: true,
			value: function(){
				return elements;
			}
		},
		values: {
			enumerable: true,
			value: function(){
				return elements;
			}
		},
		entries: {
			enumerable: true,
			value: function(){
				return elements.map((e, i) => [i, e]);
			}
		},
		size: {
			enumerable: true,
			value: function(){
				return elements.length;
			}
		},
		forEach: {
			enumerable: true,
			value: function(fn){
				let i = 0;
				for(const s of this){
					fn(s, i++, elements);
				}
			}
		}
	});
	Object.defineProperty(this, Symbol.iterator, {
		value: function* (){
			const max = Math.pow(2, elements.length)-1;
			for(let i=0; i<=max; ++i){
				yield maskSubset(i);
			}
			console.log(process.memoryUsage());
		}
	});
}

const test = Array.from(Array(15).keys()).map(i => i+1);
let start, end;

const ps = new PowerSet(test);

// console.log(ps.entries());

const iter = ps[Symbol.iterator]();
let next = iter.next();
while(!next.done){
	console.log(next.value);
	next = iter.next();
}

// let bitset = 1;
// for(let i=1; i<=test.length/2; ++i){
// 	console.log(bitset.toString(2));
// 	console.log(ps.get(bitset));
// 	bitset += 2**(i*2);
// }

// let psCount;
// start = Date.now();
// ps.forEach((_e, i) => psCount=i);
// console.log(psCount+1);
// end = Date.now() - start;
// console.log(`PowerSet: ${end}`);

// ps.forEach((e) => console.log(e.reduce((a, c) => a+c, 0)));

// start = Date.now();
// for(const i of ps){
// 	i;
// }
// end = Date.now() - start;
// console.log(`PowerSet: ${end}`);

/*
 * won't work for more than test[25]
 * and you'll need to increase heap space
 * node --max-old-space-size=16384 powerset.js
*/
/*
start = Date.now();
const sets = [];
for(let i=0; i<test.length; ++i){
	const curLen = sets.length;
	for(let s=0; s<curLen; ++s){
		const n = Array.from(sets[s]);
		n.push(test[i]);
		sets.push(n);
		// console.log(n);
	}
	sets.push([test[i]]);
	//console.log([test[i]]);
}
end = Date.now() - start;
console.log(process.memoryUsage());
console.log(`Nested loop: ${end}`);
*/
