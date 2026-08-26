import { TailwindColor } from 'angular-tailwind-components';

/** Ciclo di vita di un componente della libreria, usato per colore del tag e filtro. */
export type TableRowStatus = 'stable' | 'beta' | 'deprecated';

export interface TableRow {
  /** Chiave i18n del nome del componente. */
  nameKey: string;
  status: TableRowStatus;
  version: string;
  /** Data di fine supporto, `-` quando il componente è ancora supportato. */
  eos: string;
}

/** Colore ed etichetta i18n associati a ogni stato. */
export const TABLE_STATUS_META: Record<TableRowStatus, { color: TailwindColor; labelKey: string }> = {
  stable: { color: 'success', labelKey: 'HOME.TABLE_STATUS_STABLE' },
  beta: { color: 'warning', labelKey: 'HOME.TABLE_STATUS_BETA' },
  deprecated: { color: 'danger', labelKey: 'HOME.TABLE_STATUS_DEPRECATED' }
};
