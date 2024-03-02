export function parseNumber(num: string): bigint | number {
  const sign = num.startsWith("-") ? -1 : 1;
  if (sign === -1) num = num.slice(1);

  // float
  if (num.includes(".") || num.includes("p")) {
    if (!num.startsWith("0x")) return sign * Number(num);
    return sign * parseHexFloat(num);
  }
  if (!num.startsWith("0x") && num.includes("e")) return sign * Number(num);

  // int
  return BigInt(sign) * BigInt(num);
}

function parseHexFloat(num: string): number {
  const [mantissa, exponent = "0"] = num.split("p");
  const [int, fraction = ""] = mantissa.split(".");
  const intPart = BigInt(int);

  let fractionPart = 0;
  for (const hex of Array.from(fraction).reverse()) {
    fractionPart += parseInt(hex, 16);
    fractionPart /= 16;
  }

  return (Number(intPart) + fractionPart) * Math.pow(2, Number(exponent));
}
