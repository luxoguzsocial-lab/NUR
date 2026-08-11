export interface ExemptionPeriod {
  startDate: string;
  /** Bitiş günü hariçtir; null ise dönem hâlâ aktiftir. */
  endDate: string | null;
}

export interface PrivateWorshipSnapshot {
  periods: ExemptionPeriod[];
  mutePrayerNotifications: boolean;
}

export function getActiveExemptionPeriod(
  state: Pick<PrivateWorshipSnapshot, 'periods'>,
): ExemptionPeriod | undefined {
  return [...state.periods].reverse().find((period) => period.endDate === null);
}

export function isPrivateWorshipActive(
  state: Pick<PrivateWorshipSnapshot, 'periods'>,
): boolean {
  return !!getActiveExemptionPeriod(state);
}

export function isPrivateWorshipExemptDate(
  state: Pick<PrivateWorshipSnapshot, 'periods'>,
  dateISO: string,
  latestKnownDateISO = dateISO,
): boolean {
  return state.periods.some(
    (period) =>
      dateISO >= period.startDate &&
      (period.endDate ? dateISO < period.endDate : dateISO <= latestKnownDateISO),
  );
}

export function shouldMutePrayerNotifications(
  state: Pick<PrivateWorshipSnapshot, 'periods' | 'mutePrayerNotifications'>,
): boolean {
  return state.mutePrayerNotifications && isPrivateWorshipActive(state);
}

/** Eski kayıtları temizlerken içinde bulunulan haftanın korumasını kaybetme. */
export function trimClosedExemptionHistory(
  periods: readonly ExemptionPeriod[],
  keepFromDateISO: string,
): ExemptionPeriod[] {
  return periods.flatMap((period) => {
    if (period.endDate === null) return [period];
    if (period.endDate <= keepFromDateISO) return [];
    return [
      {
        ...period,
        startDate: period.startDate < keepFromDateISO ? keepFromDateISO : period.startDate,
      },
    ];
  });
}
