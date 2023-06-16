// ================ //
// ===   BOOL   === //
// ================ //

/**
 * Parse an environment variable to a boolean value. Accepts both stringified boolean or integer
 * @example
 * parseBoolean(undefined) // false
 * parseBoolean('true') // true
 * parseBoolean('False') // false
 * parseBoolean('1') // true
 * parseBoolean('0') // false
 * @since 1.0.0
 */
export function parseBoolean(value2Parse: string | undefined): boolean {
  let parsed = false; // default value
  if (typeof value2Parse === 'string') {
    value2Parse = value2Parse.toLowerCase().trim();
    parsed = ['true', '1'].includes(value2Parse);
  }
  return parsed;
}

// ================== //
// ===   STRING   === //
// ================== //

// overload for types
export function parseString<Value extends string | undefined, Fallback extends string | null | undefined = undefined>(
  value2Parse: Value,
  fallbackValue?: Fallback
): Value extends undefined ? (Fallback extends undefined ? never : Fallback) : string;

// actual implementation
/**
 * Parse an environment variable to a string. Requires a fallback value for `undefined` inputs.
 * @throws {RangeError} on parsing issue
 * @example
 * parseString('myvalue') // 'myvalue'
 * parseString(undefined) // Exception
 * parseString(undefined, 'fallback') // 'fallback'
 * @since 1.0.0
 */
export function parseString(value2Parse: string | undefined, fallbackValue?: string | null): string | null {
  let parsed: string | null;

  if (typeof value2Parse === 'string') {
    parsed = value2Parse.trim();
  } else {
    if (fallbackValue === undefined) {
      throw new RangeError('undefined input without a fallback');
    }
    parsed = fallbackValue;
  }
  return parsed;
}

// ================== //
// ===   NUMBER   === //
// ================== //

// overload for types
export function parseNumber<Value extends string | undefined, Fallback extends number | null | undefined = undefined>(
  value2Parse: Value,
  fallbackValue?: Fallback
): Value extends undefined ? (Fallback extends undefined ? never : Fallback) : number;

// actual implementation
/**
 * Parse an environment variable to a number. Requires a fallback value for `undefined` inputs.
 * @throws {RangeError} on parsing issue
 * @example
 * parseNumber('69') // 69
 * parseNumber(undefined) // Exception
 * parseNumber(undefined, 420) // 420
 * @since 1.0.0
 */
export function parseNumber(value2Parse: string | undefined, fallbackValue?: number | null): number | null {
  let parsed: number | null = Number(value2Parse);

  if (Number.isNaN(parsed)) {
    if (fallbackValue === undefined) {
      throw new RangeError('undefined input without a fallback');
    }
    parsed = fallbackValue;
  }

  return parsed;
}

// ================= //
// ===   ARRAY   === //
// ================= //

// overload for types
export function parseArray<_ParseOption extends Options_ParseArray = Options_ParseArray>(
  value2Parse: string | undefined,
  options?: _ParseOption
): _ParseOption extends { parseNumber: true } ? number[] : string[];

// actual implementation
/**
 * Parse an environment variable to an array. By default returns array of string. Default separator is _comma_ (`','`).
 * Optionally, the array can be casted to number
 * @throws {RangeError} on parsing issue
 * @example
 * parseArray('a,b,c'); // ['a','b','c']
 * parseArray('a;b;c', {delimiter: ';'}); // ['a','b','c']
 * parseArray('1,2,3'); // ['1','2','3']
 * parseArray('1,2,3', {parseNumber: true}); // [1,2,3]
 * parseArray(undefined); // []
 * @since 1.0.0
 */
export function parseArray(value2Parse: string | undefined, options?: Options_ParseArray): number[] | string[] {
  // override default options
  const overriddenOptions = { ..._defaultOptionsParseArray, ...options };

  // default value
  let parsed: number[] | string[] = [];

  if (value2Parse !== undefined) {
    parsed = value2Parse.split(overriddenOptions.delimiter);
    if (overriddenOptions.parseNumber) {
      parsed = parsed.map((arrayElem) => parseNumber(arrayElem));
    } else {
      parsed = parsed.map((arrayElem) => parseString(arrayElem));
    }
  }

  return parsed;
}

/**
 * Options for `parseArray` method
 * @since 1.0.0
 */
export interface Options_ParseArray {
  /** default: `','` */
  delimiter?: string;
  /** default: `false` */
  parseNumber?: boolean;
}

const _defaultOptionsParseArray: Required<Options_ParseArray> = {
  delimiter: ',',
  parseNumber: false,
};

// ================ //
// ===   NULL   === //
// ================ //

// overload for types
export function parseNull<Value extends string | undefined, _ParseOption extends Options_ParseNull = Options_ParseNull>(
  value2Parse: Value,
  options?: _ParseOption
): Value extends undefined ? (_ParseOption extends { allowUndefined: true } ? null : never) : null;

// actual implementation
/**
 * Parse an environment variable containing null. `undefined` is rejected unless specific option is set
 * @throws {RangeError} on parsing issue
 * @example
 * parseNull('null'); // null
 * parseNull('NULL'); // null
 * parseNull('I will survive (...?)'); // RangeError
 * parseNull(undefined); // RangeError
 * parseNull(undefined, {allowUndefined: true}); // null
 * @since 1.0.0
 */
export function parseNull(value2Parse: string | undefined, options?: Options_ParseNull): null {
  // override default options
  const overriddenOptions = { ..._defaultOptionsParseNull, ...options };

  if (typeof value2Parse === 'string') {
    value2Parse = value2Parse.toLowerCase().trim();
    if (value2Parse !== 'null') {
      throw new RangeError('value cannot be parsed into null');
    }
  } else {
    if (!overriddenOptions.allowUndefined) {
      throw new RangeError('undefined value is not allowed to be parsed into null');
    }
  }

  return null;
}

/**
 * Options for `parseNull` method
 * @since 1.0.0
 */
export interface Options_ParseNull {
  /** default: `false` */
  allowUndefined?: boolean;
}

const _defaultOptionsParseNull: Required<Options_ParseNull> = {
  allowUndefined: false,
};
