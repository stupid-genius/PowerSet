function BigBitSet(length = 0){
    if(!new.target){
        return new BigBitSet(length);
    }

    const bitsets = Array(Math.ceil(length / 32)).fill(0);

    function setBit(bitIndex, bitValue) {
        const i = Math.floor(bitIndex / 32);
        const pos = bitIndex % 32;
        if (bitValue) {
            bitsets[i] |= 1 << pos;
        } else {
            bitsets[i] &= ~(1 << pos);
        }
    }

    function getBit(bitIndex) {
        return (bitsets[Math.floor(bitIndex / 32)] >> (bitIndex % 32)) & 1;
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

	const proxy = new Proxy(this, {
		get: function(_target, prop){
			if(typeof prop === 'string' && !isNaN(prop)){
				const index = +prop;
				if(Number.isInteger(index) && index >= 0){
					return getBit(index);
				}
			}else{
				return Reflect.get(...arguments);
			}
		},
		set: function(_target, prop, value){
			const index = +prop;
			if(!isNaN(prop) && Number.isInteger(index) && index >= 0){
				return setBit(index, value);
			}else{
				Reflect.set(...arguments);
			}
		}
	});

	return proxy;
}

export default BigBitSet;
