export function parseNumber(num: string): bigint | number {
	const sign = num.startsWith("-") ? -1 : 1;
	const _num = sign === -1 ? num.slice(1) : num;

	// float
	if (_num.includes(".") || _num.includes("p")) {
		if (!_num.startsWith("0x")) return sign * Number(_num);
		return sign * parseHexFloat(_num);
	}
	if (!_num.startsWith("0x") && _num.includes("e")) return sign * Number(_num);

	// int
	return BigInt(sign) * BigInt(_num);
}

function parseHexFloat(num: string): number {
	const [mantissa, exponent = "0"] = num.split("p");
	const [int, fraction = ""] = mantissa.split(".");
	const intPart = BigInt(int);

	let fractionPart = 0;
	for (const hex of Array.from(fraction).reverse()) {
		fractionPart += Number.parseInt(hex, 16);
		fractionPart /= 16;
	}

	return (Number(intPart) + fractionPart) * 2 ** Number(exponent);
}
