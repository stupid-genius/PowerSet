const { default: Logger } = require('log-ng');

const logger = new Logger('PowerSet.js');

function PowerSet(set){
	if(!new.target){
		return new PowerSet(...arguments);
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
			logger.debug(performance.memory);
		}
	});
}

export default PowerSet;
