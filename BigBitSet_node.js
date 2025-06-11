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
		add: {
			enumerable: true,
			// Set bits from a provided int
			// to allow for bitsets larger than 32 bits
			// we need to iterate through the bits modulo the length
			value: function(bitSet){
				if(typeof bitSet !== 'number'){
					throw new TypeError('bitSet must be a number');
				}
				for(let i=0; i<length; ++i){
					const buf = i >>> 5;
					const off = i & 31;
					const word = bitSet >> buf;
					const mask = 1 << off;
					if(word & mask){
						setBit(i, true);
					}
				}
			}
		},
        get: {
            enumerable: true,
            value: getBit
        },
        set: {
            enumerable: true,
            value: setBit
        }
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

/**
 * BigBitBitmap
 *
 * A bitmap implementation based on BigBitSet.
 * Accepts values and maps the sparse ids to dense indexes into the bitset.
 */
function BigBitBitmap(length = 0){
	if(!new.target){
		return new BigBitBitmap(length);
	}

	const bitset = new BigBitSet(length);

	Object.defineProperties(this, {
		set: {
			enumerable: true,
			value: bitset.set
		},
		get: {
			enumerable: true,
			value: bitset.get
		},
		length: {
			value: length
		}
	});

	Object.defineProperties(this, {
		[Symbol.iterator]: {
			value: bitset[Symbol.iterator]
		}
	});

	return bitset;
}

module.exports = {
	BigBitSet,
	BigBitBitmap
};
