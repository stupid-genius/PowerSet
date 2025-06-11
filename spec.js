const { assert } = require('chai');
const { default: Logger } = require('log-ng');
const { default: BigBitSet } = require('./BigBitSet.js');
const { default: PowerSet } = require('./PowerSet.js');

const logger = new Logger('spec.js');

describe('BigBitSet', function(){
    beforeEach(function(){
        bitset = new BigBitSet(64);
    });

    it('should initialize with the correct length', function(){
        assert.equal(bitset.length, 64);
    });

    it('should correctly set and get a single bit', function(){
        bitset.set(5, true);
        assert.equal(bitset.get(5), 1);

        bitset.set(5, false);
        assert.equal(bitset.get(5), 0);
    });

    it('should correctly handle multiple bits', function(){
        bitset.set(10, true);
        bitset.set(20, true);
        bitset.set(30, true);

        assert.equal(bitset.get(10), 1);
        assert.equal(bitset.get(20), 1);
        assert.equal(bitset.get(30), 1);
        assert.equal(bitset.get(0), 0);
    });

    it('should support proxy-style access', function(){
        bitset[15] = true;
        assert.equal(bitset.get(15), 1);
        assert.equal(bitset[15], 1);

        bitset[15] = false;
        assert.equal(bitset[15], 0);
    });

    it.skip('should correctly handle out-of-range index', function(){
        assert.throws(() => bitset.set(100, true), /Index out of range/);
        assert.equal(bitset.get(100), undefined);
    });

    it('should iterate through the bits correctly', function(){
        bitset.set(0, true);
        bitset.set(1, true);
        bitset.set(63, true);

        const bits = [];
        for(const bit of bitset){
            bits.push(bit);
        }

		const expected = Array(64).fill(0);
		expected[0] = 1;
		expected[1] = 1;
		expected[63] = 1;
		assert.deepEqual(bits, expected);
    });

	it('should correctly set and get bits in a big bitset', function(){
		const bitset = new BigBitSet(256);

		bitset.set(0, true);
		bitset.set(127, true);
		bitset.set(255, true);

		assert.equal(bitset.get(0), 1);
		assert.equal(bitset.get(127), 1);
		assert.equal(bitset.get(255), 1);

		assert.equal(bitset.get(1), 0);
		assert.equal(bitset.get(126), 0);
		assert.equal(bitset.get(254), 0);
	});
});

describe('PowerSet', function(){
	before(function(){
		Logger.setLogLevel('info');
	});
    it('should initialize with an array', function(){
        const ps = new PowerSet([1, 2, 3]);
        assert.deepEqual(ps.keys(), [1, 2, 3]);
    });

    it('should throw an error if initialized with a non-array', function(){
        assert.throws(() => new PowerSet(123), 'set must be an array');
    });

    it('should add elements up to 64', function(){
        const ps = new PowerSet([]);
        for(let i = 0; i < 64; i++){
            ps.add(i);
        }
        assert.equal(ps.size(), 64);
        assert.throws(() => ps.add(65), 'PowerSet supports only sets with up to 64 elements');
    });

    it('should delete elements', function(){
        const ps = new PowerSet([1, 2, 3]);
        assert.isTrue(ps.delete(2));
        assert.deepEqual(ps.keys(), [1, 3]);
        assert.isFalse(ps.delete(4));
    });

    it('should check existence of elements', function(){
        const ps = new PowerSet([1, 2, 3]);
        assert.isTrue(ps.has(2));
        assert.isFalse(ps.has(4));
    });

    it('should clear all elements', function(){
        const ps = new PowerSet([1, 2, 3]);
        ps.clear();
        assert.deepEqual(ps.keys(), []);
        assert.equal(ps.size(), 0);
    });

    it('should return subsets correctly', function(){
        const ps = new PowerSet(['a', 'b', 'c']);
        assert.deepEqual(ps.get(0b101), ['a', 'c']);
    });

    it('should iterate over all subsets', function(){
        const ps = new PowerSet([1, 2]);
        const subsets = [...ps];
        assert.deepEqual(subsets, [[], [1], [2], [1, 2]]);
    });

    it('should execute forEach correctly', function(){
        const ps = new PowerSet(['x', 'y']);
        const results = [];
        ps.forEach(subset => results.push(subset));
        assert.deepEqual(results, [[], ['x'], ['y'], ['x', 'y']]);
    });

	it('should allow query for arbitrary subset', function(){
		const test = Array.from(Array(15).keys()).map(i => i+1);
		const ps = new PowerSet(test);
		logger.info(ps.get(3e4));
	});

	it.only('demo', function(){
		this.timeout(20e3);
		const test = Array.from(Array(26).keys()).map(i => i+1);
		const ps = new PowerSet(test);

		let psCount = 0;
		const start = performance.now();
		ps.forEach((_e, _i) => psCount++);
		const end = performance.now();
		logger.info(`PowerSet: ${end-start} (${psCount} elems)`);
	});
});

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

