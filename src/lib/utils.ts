export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number)
}

export const generateOrderCode = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `ORD-${year}${month}${day}-${random}`
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '#F59E0B' // Warning
    case 'CONFIRMED':
      return '#3B82F6' // Blue
    case 'PROCESSING':
      return '#FF6B35' // Primary
    case 'READY':
      return '#22C55E' // Success
    case 'COMPLETED':
      return '#10B981' // Green
    case 'CANCELLED':
      return '#EF4444' // Danger
    default:
      return '#A0A0A0'
  }
}

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Menunggu Pembayaran'
    case 'CONFIRMED':
      return 'Dikonfirmasi'
    case 'PROCESSING':
      return 'Sedang Diproses'
    case 'READY':
      return 'Siap Disajikan'
    case 'COMPLETED':
      return 'Selesai'
    case 'CANCELLED':
      return 'Dibatalkan'
    default:
      return status
  }
}
