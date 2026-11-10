import DefaultTheme from 'vitepress/theme'
import { h, nextTick, watch } from 'vue'
import { inBrowser, useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import SiteFooter from './SiteFooter.vue'
import '@fontsource/sora/600.css'
import '@fontsource/sora/700.css'
import '@fontsource/sora/800.css'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(SiteFooter)
    }),
  setup() {
    const route = useRoute()
    let zoom: ReturnType<typeof mediumZoom> | null = null
    const initZoom = () => {
      if (!inBrowser) return
      zoom?.detach()
      zoom = mediumZoom('.VPDoc img', { background: 'var(--vp-c-bg)' })
    }
    watch(
      () => route.path,
      () => nextTick(initZoom),
      { immediate: true }
    )
  }
}
