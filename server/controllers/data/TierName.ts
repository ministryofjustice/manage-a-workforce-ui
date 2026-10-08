const tierName = (tier: string): string => {
  if (!tier || tier === 'MISSING') {
    return '-'
  }
  return tier
}

export default tierName
