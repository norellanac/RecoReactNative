export const DIAL_CODES = [
  { label: '🇬🇹 Guatemala', value: '+502' },
  { label: '🇺🇸 USA / Canada', value: '+1' },
  { label: '🇲🇽 Mexico', value: '+52' },
  { label: '🇸🇻 El Salvador', value: '+503' },
  { label: '🇭🇳 Honduras', value: '+504' },
  { label: '🇳🇮 Nicaragua', value: '+505' },
  { label: '🇨🇷 Costa Rica', value: '+506' },
  { label: '🇵🇦 Panama', value: '+507' },
  { label: '🇨🇴 Colombia', value: '+57' },
  { label: '🇻🇪 Venezuela', value: '+58' },
  { label: '🇦🇷 Argentina', value: '+54' },
  { label: '🇧🇷 Brazil', value: '+55' },
  { label: '🇨🇱 Chile', value: '+56' },
  { label: '🇪🇸 Spain', value: '+34' },
  { label: '🇬🇧 UK', value: '+44' },
];

/** Split an E.164 phone string into { dialCode, localNumber }.
 *  Tries longest codes first to avoid +1 matching +507 etc. */
export const parseE164 = (
  phone: string,
): { dialCode: string; localNumber: string } => {
  const sorted = [...DIAL_CODES].sort(
    (a, b) => b.value.length - a.value.length,
  );
  for (const entry of sorted) {
    if (phone.startsWith(entry.value)) {
      return {
        dialCode: entry.value,
        localNumber: phone.slice(entry.value.length),
      };
    }
  }
  return { dialCode: '+502', localNumber: phone.replace(/^\+\d+/, '') };
};
