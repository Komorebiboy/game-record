<template>
  <view class="lazy-image-container" :style="{ width: width, height: height }">
    <image
      v-if="loaded"
      :src="src"
      :mode="mode"
      :style="{ width: width, height: height }"
      class="lazy-image"
      @load="onImageLoad"
      @error="onImageError"
    />
    <view v-else class="image-placeholder" :style="{ width: width, height: height }">
      <view class="skeleton-loader"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LazyImage',
  props: {
    src: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: 'aspectFill'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    threshold: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      loaded: false,
      observer: null
    };
  },
  mounted() {
    this.initIntersectionObserver();
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    initIntersectionObserver() {
      // 创建交叉观察器
      this.observer = uni.createIntersectionObserver(this);
      this.observer
        .relativeToViewport({ bottom: this.threshold })
        .observe('.lazy-image-container', (res) => {
          if (res.intersectionRatio > 0) {
            this.loadImage();
          }
        });
    },
    loadImage() {
      if (!this.loaded) {
        this.loaded = true;
        // 断开观察器
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
      }
    },
    onImageLoad() {
      this.$emit('load');
    },
    onImageError() {
      this.$emit('error');
    }
  }
};
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;
}

.lazy-image {
  display: block;
  animation: fadeIn 0.3s ease;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.skeleton-loader {
  width: 60%;
  height: 60%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8rpx;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
