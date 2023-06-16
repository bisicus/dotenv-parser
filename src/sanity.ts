/**
 * Check that all the specified variables are in `process.env`
 * @throws {RangeError} on missing variable(s)
 * @since 1.0.0
 */
export function mandatoryVariables(required: string[]): void {
  const missingRequiredEnvVars = required.filter((_envVar) => !(_envVar in process.env));
  if (missingRequiredEnvVars.length !== 0) {
    throw new RangeError(`missing required env variables [${missingRequiredEnvVars.join(', ')}]`);
  }
}
