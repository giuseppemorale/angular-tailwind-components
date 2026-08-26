/**
 * Default row type. `TailwindTable`'s generic is constrained to `object` rather than to this type,
 * so a plain interface — which has no index signature — can be passed without a cast.
 */
export type TailwindTableRow = Record<string, unknown>;
