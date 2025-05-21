<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
  dealData: {
    type: Array,
    required: true,
  },
})

// 최근 1년 거래만 추출 + 월별 통계 계산
const now = new Date()
const yearAgo = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1)

const monthlyStats = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(yearAgo.getFullYear(), yearAgo.getMonth() + i, 1)
  const monthStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`

  const monthlyDeals = props.dealData.filter((deal) => {
    const dealDate = new Date(deal.dealYear, deal.dealMonth - 1)
    return dealDate.getFullYear() === date.getFullYear() && dealDate.getMonth() === date.getMonth()
  })

  const amounts = monthlyDeals.map((d) => parseInt(d.dealAmount.replace(',', '')))
  return {
    month: monthStr,
    avg: amounts.length ? Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length) : null,
    max: amounts.length ? Math.max(...amounts) : null,
    min: amounts.length ? Math.min(...amounts) : null,
  }
})

const chartData = {
  labels: monthlyStats.map((m) => m.month),
  datasets: [
    {
      label: '최고가',
      borderColor: '#f87171',
      data: monthlyStats.map((m) => m.max),
      fill: false,
    },
    {
      label: '평균가',
      borderColor: '#60a5fa',
      data: monthlyStats.map((m) => m.avg),
      fill: false,
    },
    {
      label: '최저가',
      borderColor: '#34d399',
      data: monthlyStats.map((m) => m.min),
      fill: false,
    },
  ],
}
</script>

<template>
  <Line
    :data="chartData"
    :options="{
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { display: false }, x: { display: false } },
    }"
  />
</template>

<style scoped>
canvas {
  max-height: 80px;
}
</style>
