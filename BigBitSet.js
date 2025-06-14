/**
 * BigBitSet
 *
 * A big bitset implementation that can handle large bit lengths
 */
function BigBitSet(length = 0){
    if(!new.target){
        return new BigBitSet(length);
    }

	const bitsets = Uint32Array.from({length: Math.ceil(length / 32)});

    function setBit(bitIndex, bitValue) {
		if(bitIndex < 0 || bitIndex >= length){
			throw new RangeError('Index out of range');
		}
        const i = bitIndex >> 5;
		const mask = 1 << (bitIndex & 31);
		if(bitValue){
			bitsets[i] |= mask;
		}else{
			bitsets[i] &= ~mask;
		}
    }

    function getBit(bitIndex) {
		if(bitIndex < 0 || bitIndex >= length){
			throw new RangeError('Index out of range');
		}

		return (bitsets[bitIndex >>> 5] & (1 << (bitIndex & 31))) !== 0;
    }

    Object.defineProperties(this, {
        set: {
            enumerable: true,
            value: setBit
        },
        get: {
            enumerable: true,
            value: getBit
        },
    });

    Object.defineProperties(this, {
		[Symbol.iterator]: {
			value: function* (){
				for(let i=0; i<length; ++i){
					yield getBit(i);
				}
			}
		},
		length: {
			value: length
		}
    });

	// const proxy = new Proxy(this, {
	// 	get: function(_target, prop){
	// 		if(typeof prop === 'string' && !isNaN(prop)){
	// 			const index = +prop;
	// 			if(Number.isInteger(index)){
	// 				return getBit(index);
	// 			}
	// 		}else{
	// 			return Reflect.get(...arguments);
	// 		}
	// 	},
	// 	set: function(_target, prop, value){
	// 		const index = +prop;
	// 		if(!isNaN(prop) && Number.isInteger(index)){
	// 			return setBit(index, value);
	// 		}else{
	// 			Reflect.set(...arguments);
	// 		}
	// 	}
	// });

	// return proxy;
}

export default BigBitSet;
