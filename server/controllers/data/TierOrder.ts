const tierOrder = ['D0', 'D1', 'D2', 'D3', 'C0', 'C1', 'C2', 'C3', 'B0', 'B1', 'B2', 'B3', 'A0', 'A1', 'A2', 'A3']

export default (tier: string) => tierOrder.indexOf(tier) ?? 0
