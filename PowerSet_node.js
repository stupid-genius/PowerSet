const Logger = require('log-ng');
const path = require('path');
const { BigBitSet } = require('./BigBitSet_node.js');

const logger = new Logger(path.basename(__filename));

/**
 * PowerSet class that generates all subsets of a given set.
 *
 * This implementation uses a bitmask approach to represent subsets,
 * allowing efficient generation and manipulation of subsets.
 * @class PowerSet
 * @param {Array} set - The initial set of elements.
 * @throws {Error} If the input is not an array or if the set exceeds 64 elements.
 */
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
		for(let i = 0; i < elements.length; ++i){
			if(bitSet.get(i)){
				subset.push(elements[i]);
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
					throw new Error('PowerSet supports only sets with up to 64 elements');
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
			value: function(intBitSet){
				const bitSet = new BigBitSet(elements.length);
				for(let bit = 0; bit < elements.length; ++bit){
					bitSet.set(bit, (intBitSet & (1 << bit)) !== 0);
				}
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
			const max = Math.pow(2, elements.length) - 1;
			const bitSet = new BigBitSet(elements.length);
			for(let i = 0; i <= max; ++i){
				for(let bit = 0; bit < elements.length; ++bit){
					bitSet.set(bit, (i & (1 << bit)) !== 0);
				}
				yield maskSubset(bitSet);
			}
			logger.debug(performance.memory);
		}
	});
}

module.exports = PowerSet;
