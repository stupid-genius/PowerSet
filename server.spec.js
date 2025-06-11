const { assert } = require('chai');
const Logger = require('log-ng');
const path = require('path');
const { BigBitSet } = require('./BigBitSet_node.js');
const PowerSet = require('./PowerSet_node.js');

const logger = new Logger(path.basename(__filename));

const bitLength = 64;

describe('BigBitSet', function(){
    beforeEach(function(){
        bitset = new BigBitSet(bitLength);
    });

    it('should initialize with the correct length', function(){
        assert.equal(bitset.length, bitLength);
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

    it.skip('should support proxy-style access', function(){
        bitset[15] = true;
        assert.equal(bitset.get(15), 1);
        assert.equal(bitset[15], 1);

        bitset[15] = false;
        assert.equal(bitset[15], 0);
    });

    it('should correctly handle out-of-range index', function(){
        assert.throws(() => bitset.set(bitLength+1, true), /Index out of range/);
        assert.throws(() => bitset.get(bitLength+1), /Index out of range/);
    });

    it('should iterate through the bits correctly', function(){
        bitset.set(0, true);
        bitset.set(1, true);
        bitset.set(63, true);

        const bits = [];
        for(const bit of bitset){
            bits.push(bit);
        }

		const expected = Array(bitLength).fill(false);
		expected[0] = true;
		expected[1] = true;
		expected[63] = true;
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
		assert.equal(bitset.get(128), 0);
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

    it(`should add elements up to 64`, function(){
        const ps = new PowerSet([]);
        for(let i = 0; i < bitLength; i++){
            ps.add(i);
        }
        assert.equal(ps.size(), bitLength);
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
		assert.deepEqual(ps.get(3e4), [5, 6, 9, 11, 13, 14, 15]);
	});

	it.skip('demo', function(){
		this.timeout(1e7);
		const test = Array.from(Array(32).keys()).map(i => i+1);
		const ps = new PowerSet(test);

		let psCount = 0;
		const start = performance.now();
		ps.forEach((_e, _i) => psCount++);
		const end = performance.now();
		logger.info(`PowerSet: ${psCount} elems generated in ${end-start} ms`);
	});

	it.skip('high-index demo', function(){
		this.timeout(10e3);

		const test = Array.from(Array(128).keys()).map(i => i+1);
		const ps = new PowerSet(test);

		let count = 0;
		let startIndex = 2 ** 33;
		let endIndex = startIndex + (2**20);
		logger.info(`PowerSet for indexes [${startIndex}, ${endIndex}):`);
		let start = performance.now();
		for(let i = startIndex; i < endIndex; ++i){
			const subset = ps.get(i);
			logger.silly(`Subset ${i}: ${subset}`);
			count++;
		}
		let end = performance.now();
		logger.info(`${count} subsets generated in: ${end-start} ms`);

		count = 0;
		startIndex = 2 ** 50;
		endIndex = startIndex + (2**20);
		logger.info(`PowerSet for indexes [${startIndex}, ${endIndex}):`);
		start = performance.now();
		for(let i = startIndex; i < endIndex; ++i){
			const subset = ps.get(i);
			logger.silly(`Subset ${i}: ${subset}`);
			count++;
		}
		end = performance.now();
		logger.info(`${count} subsets generated in: ${end-start} ms`);
	});
});
