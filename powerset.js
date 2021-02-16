function PowerSet(set){
	if(!(this instanceof PowerSet)){
		return new PowerSet();
	}

	const MAX = 18446744073709552000;	// 64-bit
	const elements = set || [];

	Object.defineProperties(this, {
		'add': {
			enumerable: true,
			value: function(e){
				if(elements.length<64){
					elements.push(e);
				}else{
					throw 'PowerSet supports only sets with up to 64 elements';
				}
			}
		},
		'clear': {
			enumerable: true,
			value: function(){
				elements.length = 0;
			}
		},
		'delete': {
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
		'has': {
			enumerable: true,
			value: function(val){
				return elements.indexOf(val) !== -1;
			}
		},
		'keys': {
			enumerable: true,
			value: function(val){
				return elements;
			}
		},
		'values': {
			enumerable: true,
			value: function(val){
				return elements;
			}
		},
		'entries': {
			enumerable: true,
			value: function(val){
				return elements.map((e, i) => {
					return [i, e];
				});
			}
		},
		'forEach': {
			enumerable: true,
			value: function(fn, thisArg){
				return elements.map((e,i) => fn.bind(thisArg)(e, i));
			}
		}
	});
	Object.defineProperty(this, Symbol.iterator, {
		value: function* (){
			const max = Math.pow(2, elements.length);
			for(let i=0; i<=max; ++i){
				const subset = [];
				for(let off=0; off<elements.length; ++off){
					let mask = 0b1 << off;
					if(!!(i & mask)){
						subset.push(elements[off]);
					}
				}
				yield subset;
			}
			console.log(process.memoryUsage());
		}
	});
}

let testCounter = 0;
let test = Array.from(Array(29), i => ++testCounter);
let start, end;

const ps = new PowerSet(test);
start = new Date().getTime();
for(let i of ps){
	i;
}
end = new Date().getTime() - start;
console.log('PowerSet: %d', end);

//console.log(ps.entries());
//ps.forEach((e,i) => console.log(e*2));

// don't run for more than test[25]
/*
start = new Date().getTime();
const sets = [];
for(let i=0; i<test.length; ++i){
	const curLen = sets.length;
	for(let s=0; s<curLen; ++s){
		const n = Array.from(sets[s]);
		n.push(test[i]);
		sets.push(n);
		//console.log(n);
	}
	sets.push([test[i]]);
	//console.log([test[i]]);
}
end = new Date().getTime() - start;
console.log(process.memoryUsage());
console.log('Nested loop: %d', end);
*/

// node --max-old-space-size=16384 powerset.js
