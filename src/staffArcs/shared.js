/** Shared scene builder for staff arc modules. */
export function scene(opening, choices, epilogue = null) {
  const raw = { opening, choices };
  if (epilogue) raw.epilogue = epilogue;
  return raw;
}
