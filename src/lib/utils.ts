export const formatPeso = (amount: number): string => {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export const formatPesoDecimal = (amount: number): string => {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const getPercentage = (part: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

export const getRiskColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-red-500'
  if (percentage >= 75) return 'text-amber-500'
  return 'text-emerald-500'
}

export const getRiskBg = (percentage: number): string => {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 75) return 'bg-amber-500'
  return 'bg-emerald-500'
}

export const cn = (...classes: (string | undefined | false | null)[]): string =>
  classes.filter(Boolean).join(' ')
