class Bttr {
  constructor(view) {
    this.view = view;
  }

  getBits(offset, bits) {
    return _getBits(this.view, offset, bits);
  }

  setBits(offset, value, bits) {
    return _setBits(this.view, offset, value, bits);
  }

  getFirstUnsetOffset() {
    const uint32Array = new Uint32Array(this.view.buffer, this.view.byteOffset, this.view.length / 4);
    for (let i = 0; i < uint32Array.length; i++) {
      if (uint32Array[i] !== 0) {
        const baseIndex = i * 4;
        const slice = new Uint8Array(this.view.buffer, this.view.byteOffset + baseIndex, 4)

        for (let j = 0; j < 32; j++) {
          const index = baseIndex + j;

          if (_getBits(slice, index, 1) !== 0) {
            return index;
          }
        }
      }
    }
    return -1;
  }
}

const _getBits = (view, offset, bits) => {
  var value = 0;
	for (var i = 0; i < bits;) {
		var remaining = bits - i;
		var bitOffset = offset & 7;
		var currentByte = view[offset >> 3];

		// the max number of bits we can read from the current byte
		var read = Math.min(remaining, 8 - bitOffset);

		// create a mask with the correct bit width
		var mask = (1 << read) - 1;
		// shift the bits we want to the start of the byte and mask of the rest
		var readBits = (currentByte >> bitOffset) & mask;
		value |= readBits << i;

		offset += read;
		i += read;
	}

  return value >>> 0;
};
const _setBit = (view, offset, on) => {
  if (on) {
		view[offset >> 3] |= 1 << (offset & 7);
	} else {
		view[offset >> 3] &= ~(1 << (offset & 7));
	}
};
const _setBits = (view, offset, value, bits) => {
  for (var i = 0; i < bits;) {
		var wrote;

		// Write an entire byte if we can.
		if ((bits - i) >= 8 && ((offset & 7) === 0)) {
			view[offset >> 3] = value & 0xFF;
			wrote = 8;
		} else {
			_setBit(view, offset, value & 0x1);
			wrote = 1;
		}

		value = (value >> wrote);

		offset += wrote;
		i += wrote;
	}
};

const bttr = view => new Bttr(view);
module.exports = bttr;
