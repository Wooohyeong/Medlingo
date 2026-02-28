import type { Settings } from './types.js';

export const defaultSettings = (): Settings => ({
  dailySize: 10,
  wrongFirst: false,
  dueFirst: true,
  selectedSetIds: [],
  includeAllSets: true
});

export const normalizeSettings = (value: unknown): Settings => {
  const defaults = defaultSettings();
  if (!value || typeof value !== 'object') return defaults;

  const candidate = value as Partial<Settings>;
  return {
    dailySize: typeof candidate.dailySize === 'number' ? candidate.dailySize : defaults.dailySize,
    wrongFirst: typeof candidate.wrongFirst === 'boolean' ? candidate.wrongFirst : defaults.wrongFirst,
    dueFirst: typeof candidate.dueFirst === 'boolean' ? candidate.dueFirst : defaults.dueFirst,
    selectedSetIds: Array.isArray(candidate.selectedSetIds)
      ? candidate.selectedSetIds.filter((id): id is string => typeof id === 'string')
      : defaults.selectedSetIds,
    includeAllSets: typeof candidate.includeAllSets === 'boolean' ? candidate.includeAllSets : defaults.includeAllSets
  };
};
