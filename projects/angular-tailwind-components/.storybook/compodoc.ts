import { setCompodocJson } from '@storybook/addon-docs/angular';

/** `input(this.defaultSize ?? 'md')` → default mostrato `'md'`: il token DI non è un valore documentabile. */
const DI_FALLBACK = /^this\.\w+\s*\?\?\s*(.+)$/s;

interface CompodocEntity {
  inputsClass?: { defaultValue?: string }[];
  propertiesClass?: unknown[];
  methodsClass?: unknown[];
}

/**
 * Registra il JSON compodoc che alimenta `<ArgTypes>`.
 *
 * Storybook renderebbe anche `propertiesClass` e `methodsClass`: in questa libreria sono interni
 * (`computed()`, `inject()`, handler di tastiera) e finirebbero in tabella con il corpo della funzione
 * come default. Restano solo input e output.
 */
export function registerCompodocJson(docJson: unknown): void {
  const json = docJson as { components?: CompodocEntity[]; directives?: CompodocEntity[] };

  for (const entity of [...(json.components ?? []), ...(json.directives ?? [])]) {
    entity.propertiesClass = [];
    entity.methodsClass = [];

    for (const input of entity.inputsClass ?? []) {
      const fallback = input.defaultValue ? DI_FALLBACK.exec(input.defaultValue) : null;
      if (fallback) {
        input.defaultValue = fallback[1].trim();
      }
    }
  }

  setCompodocJson(json);
}
