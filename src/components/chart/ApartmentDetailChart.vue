<template>
  <div class="apart-mini-chart">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>거래 데이터 로딩 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchData" class="retry-button">다시 시도</button>
    </div>

    <!-- 차트 및 데이터 표시 -->
    <div v-else-if="dealData.length > 0" class="chart-container">
      <!-- 요약 통계 카드 -->
      <div class="stat-card">
        <div class="stat-icon">📉</div>

        <div class="stat-by-price">
          <span class="stat-label">최저가</span><br />
          <span class="stat-value">{{ formatPrice(statistics.min) }}</span>
        </div>
        <div class="stat-by-price">
          <span class="stat-label">평균가</span><br />
          <span class="stat-value">{{ formatPrice(statistics.avg) }}</span>
        </div>
        <div class="stat-by-price">
          <span class="stat-label">최고가</span><br />
          <span class="stat-value">{{ formatPrice(statistics.max) }}</span>
        </div>
      </div>

      <!-- 시간별 거래 가격 차트 -->
      <div class="chart-section">
        <h3 class="chart-title">거래가격 추이</h3>
        <div class="chart-wrapper">
          <svg :width="chartWidth" :height="chartHeight" class="price-chart">
            <!-- 배경 그리드 -->
            <g class="grid">
              <line
                v-for="i in 5"
                :key="`grid-${i}`"
                :x1="padding"
                :y1="padding + ((chartHeight - 2 * padding) * (i - 1)) / 4"
                :x2="chartWidth - padding"
                :y2="padding + ((chartHeight - 2 * padding) * (i - 1)) / 4"
                stroke="#f0f0f0"
                stroke-width="1"
              />
            </g>

            <!-- 가격 라인 -->
            <polyline
              :points="chartPoints"
              fill="none"
              stroke="#4CAF50"
              stroke-width="2"
              class="price-line"
            />

            <!-- 데이터 포인트 -->
            <circle
              v-for="(point, index) in chartData"
              :key="`point-${index}`"
              :cx="point.x"
              :cy="point.y"
              r="4"
              :fill="getPointColor(point.price)"
              class="data-point"
              @mouseover="showTooltip($event, point)"
              @mouseout="hideTooltip"
            />

            <!-- Y축 라벨 (가격) -->
            <g class="y-axis">
              <text
                v-for="i in 5"
                :key="`y-label-${i}`"
                :x="padding - 10"
                :y="padding + ((chartHeight - 2 * padding) * (i - 1)) / 4 + 5"
                text-anchor="end"
                font-size="12"
                fill="#666"
              >
                {{
                  formatPrice(statistics.max - ((statistics.max - statistics.min) * (i - 1)) / 4)
                }}
              </text>
            </g>
          </svg>

          <!-- 툴팁 -->
          <div
            v-if="tooltip.show"
            class="tooltip"
            :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
          >
            <div class="tooltip-content">
              <div class="tooltip-date">{{ tooltip.date }}</div>
              <div class="tooltip-price">{{ formatPrice(tooltip.price) }}</div>
              <div class="tooltip-floor">{{ tooltip.floor }}층</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 최근 거래 현황 -->
      <div class="recent-deals">
        <h3 class="section-title">최근 거래 현황</h3>
        <div class="deals-grid">
          <div v-for="deal in recentDeals" :key="deal.dealId" class="deal-item">
            <div class="deal-date">{{ formatDate(deal) }}</div>
            <div class="deal-price">{{ formatPrice(deal.dealAmount) }}</div>
            <div class="deal-floor">{{ deal.floor }}층</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 데이터 없음 -->
    <div v-else class="no-data">
      <p>거래 데이터가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import { dealAPI } from '@/api/deal'
import { nextTick } from 'vue'

export default {
  name: 'ApartMiniChart',
  props: {
    aptSeq: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      dealData: [],
      loading: false,
      error: null,
      chartWidth: 550,
      chartHeight: 300,
      padding: 80,
      tooltip: {
        show: false,
        x: 0,
        y: 0,
        date: '',
        price: 0,
        floor: '',
      },
    }
  },
  computed: {
    statistics() {
      if (this.dealData.length === 0) return { min: 0, max: 0, avg: 0 }

      const prices = this.dealData.map((deal) => parseFloat(deal.dealAmount.replace(/,/g, '')))
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length

      return { min, max, avg }
    },
    sortedDeals() {
      return [...this.dealData].sort((a, b) => {
        const dateA = new Date(a.dealYear, a.dealMonth - 1, a.dealDay)
        const dateB = new Date(b.dealYear, b.dealMonth - 1, b.dealDay)
        return dateA - dateB
      })
    },
    chartData() {
      if (this.sortedDeals.length === 0) return []

      const { min, max } = this.statistics
      const priceRange = max - min || 1

      return this.sortedDeals.map((deal, index) => {
        const price = parseFloat(deal.dealAmount.replace(/,/g, ''))
        const x =
          this.padding +
          ((this.chartWidth - 2 * this.padding) * index) / (this.sortedDeals.length - 1 || 1)
        const y =
          this.chartHeight -
          this.padding -
          ((this.chartHeight - 2 * this.padding) * (price - min)) / priceRange

        return {
          x,
          y,
          price,
          date: `${deal.dealYear}.${deal.dealMonth}.${deal.dealDay}`,
          floor: deal.floor,
          deal,
        }
      })
    },
    chartPoints() {
      return this.chartData.map((point) => `${point.x},${point.y}`).join(' ')
    },
    recentDeals() {
      return [...this.dealData]
        .sort((a, b) => {
          const dateA = new Date(a.dealYear, a.dealMonth - 1, a.dealDay)
          const dateB = new Date(b.dealYear, b.dealMonth - 1, b.dealDay)
          return dateB - dateA
        })
        .slice(0, 5)
    },
  },
  mounted() {
    this.fetchData()
    nextTick(() => {
      this.handleResize()
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    async fetchData() {
      if (!this.aptSeq) return

      this.loading = true
      this.error = null

      try {
        const response = await dealAPI.getDealHistory(this.aptSeq)
        this.dealData = response.data || []
      } catch (error) {
        this.error = error.message || '데이터를 불러오는데 실패했습니다.'
        console.error('거래 데이터 조회 실패:', error)
      } finally {
        this.loading = false
        await nextTick() // 데이터 렌더링 이후에도 한 번 더 보정
        this.handleResize()
      }
    },
    formatPrice(price) {
      if (price >= 10000) {
        const oku = Math.floor(price / 10000)
        const man = price % 10000
        return man === 0 ? `${oku}억` : `${oku}억 ${man.toLocaleString()}`
      }
      return `${price.toLocaleString()}만원`
    },
    formatDate(deal) {
      return `${deal.dealYear}.${String(deal.dealMonth).padStart(2, '0')}.${String(
        deal.dealDay,
      ).padStart(2, '0')}`
    },
    getPointColor(price) {
      const { min, max } = this.statistics
      const ratio = (price - min) / (max - min || 1)
      if (ratio > 0.7) return '#f44336'
      if (ratio > 0.3) return '#ff9800'
      return '#4caf50'
    },
    showTooltip(event, point) {
      this.tooltip = {
        show: true,
        x: event.offsetX + 10,
        y: event.offsetY - 10,
        date: point.date,
        price: point.price,
        floor: point.floor,
      }
    },
    hideTooltip() {
      this.tooltip.show = false
    },
    handleResize() {
      const container = this.$el?.querySelector('.chart-wrapper')
      if (container) {
        this.chartWidth = Math.min(container.offsetWidth, 600)
      }
    },
  },
  watch: {
    aptSeq() {
      this.fetchData()
    },
  },
}
</script>

<style scoped>
.apart-mini-chart {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container {
  text-align: center;
  padding: 40px;
}

.error-message {
  color: #f44336;
  margin-bottom: 16px;
}

.retry-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover {
  background: #45a049;
}
.stat-card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
}
.stat-info {
  margin-left: 5px;
}
.stat-card.min {
  border-left: 4px solid #4caf50;
}
.stat-card.avg {
  border-left: 4px solid #ff9800;
}
.stat-card.max {
  border-left: 4px solid #f44336;
}

.stat-icon {
  font-size: 24px;
  margin-right: 12px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.chart-section {
  margin-bottom: 24px;
}

.chart-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.chart-wrapper {
  position: relative;
  background: #fafafa;
  border-radius: 8px;
  padding: 0px;
}

.price-chart {
  width: 100%;
  height: auto;
}

.price-line {
  filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
}

.data-point {
  cursor: pointer;
  transition: r 0.2s ease;
}

.data-point:hover {
  r: 6;
}

.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 10;
}

.tooltip-content {
  text-align: center;
}

.tooltip-date {
  font-weight: bold;
  margin-bottom: 4px;
}

.tooltip-price {
  color: #4caf50;
  font-weight: bold;
}

.tooltip-floor {
  font-size: 11px;
  opacity: 0.8;
}

.recent-deals {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.deals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.deal-item {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.deal-date {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.deal-price {
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.deal-floor {
  font-size: 11px;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .apart-mini-chart {
    padding: 16px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .deals-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .chart-wrapper {
    padding: 12px;
  }
}
</style>
