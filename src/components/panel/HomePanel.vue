<template>
  <div class="home-panel">
    <div class="user-home-info">
      <div class="home-header">
        <div class="home-image">
          <img src="" alt="내 집 이미지" />
          <div class="image-overlay">
            <button class="add-image-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21 15L16 10L5 21"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              사진 추가
            </button>
          </div>
        </div>
        <h3 class="home-address">서울시 강남구 테헤란로 123</h3>
        <div class="home-type">아파트 | 강남 힐스테이트 101동 1204호</div>
      </div>

      <div class="info-section">
        <h4>내 집 정보</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">입주일</span>
            <span class="info-value">2023년 5월 15일</span>
          </div>
          <div class="info-item">
            <span class="info-label">전용면적</span>
            <span class="info-value">84.12m² (25.4평)</span>
          </div>
          <div class="info-item">
            <span class="info-label">거래유형</span>
            <span class="info-value">매매</span>
          </div>
          <div class="info-item">
            <span class="info-label">매매가</span>
            <span class="info-value">9억 8,000만원</span>
          </div>
        </div>
      </div>

      <div class="price-section">
        <h4>시세 정보</h4>
        <div class="price-trend">
          <div class="price-header">
            <div class="current-price">현재 시세: <strong>10억 2,000만원</strong></div>
            <div class="price-change increase">+4% (3개월)</div>
          </div>
          <div class="price-chart">
            <div class="chart-placeholder">
              <!-- 차트 대신 임시로 직접 그린 그래프 -->
              <svg
                width="100%"
                height="80"
                viewBox="0 0 340 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline
                  points="0,70 50,65 100,68 150,55 200,40 250,35 300,25 350,20"
                  stroke="#4caf50"
                  stroke-width="2"
                  fill="none"
                />
                <path
                  d="M0,70 50,65 100,68 150,55 200,40 250,35 300,25 350,20 350,80 0,80 Z"
                  fill="rgba(76, 175, 80, 0.1)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="neighborhood-section">
        <h4>주변 정보</h4>
        <div class="place-list">
          <div class="place-item">
            <div class="place-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 22L3 10C3 9.46957 3.21071 8.96086 3.58579 8.58579C3.96086 8.21071 4.46957 8 5 8H19C19.5304 8 20.0391 8.21071 20.4142 8.58579C20.7893 8.96086 21 9.46957 21 10V22"
                  stroke="#4CAF50"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 8V6C5 5.46957 5.21071 4.96086 5.58579 4.58579C5.96086 4.21071 6.46957 4 7 4H17C17.5304 4 18.0391 4.21071 18.4142 4.58579C18.7893 4.96086 19 5.46957 19 6V8"
                  stroke="#4CAF50"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 22V8"
                  stroke="#4CAF50"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 12H15"
                  stroke="#4CAF50"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="place-info">
              <div class="place-name">스타벅스 강남점</div>
              <div class="place-distance">200m</div>
            </div>
          </div>
          <div class="place-item">
            <div class="place-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 10C20 14.4183 16.4183 18 12 18C7.58172 18 4 14.4183 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z"
                  stroke="#4CAF50"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17.7274 17.7274L21.9999 21.9999"
                  stroke="#4CAF50"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="place-info">
              <div class="place-name">강남구청역</div>
              <div class="place-distance">300m</div>
            </div>
          </div>
          <div class="place-item">
            <div class="place-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 10H3M21 10C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12V19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V12C1 11.4696 1.21071 10.9609 1.58579 10.5858C1.96086 10.2107 2.46957 10 3 10M21 10V8C21 7.46957 20.7893 6.96086 20.4142 6.58579C20.0391 6.21071 19.5304 6 19 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V10"
                  stroke="#4CAF50"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 14V17"
                  stroke="#4CAF50"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="place-info">
              <div class="place-name">세븐일레븐 강남힐점</div>
              <div class="place-distance">100m</div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-section">
        <button class="action-button primary">주변 시세 더 보기</button>
        <button class="action-button secondary">내 집 정보 수정</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 필요한 경우 여기에 컴포넌트 로직 추가
</script>

<style scoped>
.home-panel {
  height: 100%;
}

.user-home-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home-header {
  margin-bottom: 8px;
}

.home-image {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.home-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 12px;
  right: 12px;
}

.add-image-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.home-address {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.home-type {
  font-size: 14px;
  color: #666;
}

.info-section h4,
.price-section h4,
.neighborhood-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #666;
}

.info-value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.price-trend {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
}

.price-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.current-price {
  font-size: 14px;
  color: #333;
}

.price-change {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 16px;
}

.price-change.increase {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.price-change.decrease {
  color: #f44336;
  background-color: rgba(244, 67, 54, 0.1);
}

.price-chart {
  height: 80px;
}

.place-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.place-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.place-icon {
  width: 36px;
  height: 36px;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4caf50;
}

.place-info {
  flex: 1;
}

.place-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.place-distance {
  font-size: 13px;
  color: #666;
}

.action-section {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.action-button {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.action-button.primary {
  background-color: #4caf50;
  color: white;
  border: none;
}

.action-button.primary:hover {
  background-color: #43a047;
}

.action-button.secondary {
  background-color: white;
  color: #4caf50;
  border: 1px solid #4caf50;
}

.action-button.secondary:hover {
  background-color: rgba(76, 175, 80, 0.05);
}
</style>
