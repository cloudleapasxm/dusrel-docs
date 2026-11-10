<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { lang } = useData()
const isHi = computed(() => lang.value.startsWith('hi'))
const prefix = computed(() => (isHi.value ? '/hi/' : '/'))

// Link labels are the docs' own frontmatter titles (EN + HI), not invented.
const guideLinks = computed(() => [
  {
    text: isHi.value ? 'Dusrel से शुरुआत करें' : 'Getting started with Dusrel',
    link: `${prefix.value}getting-started-with-dusrel`
  },
  {
    text: isHi.value ? 'मज़बूत पासवर्ड कैसे बनाएँ' : 'How to generate a strong password',
    link: `${prefix.value}how-to-generate-a-strong-password`
  },
  {
    text: isHi.value ? 'QR कोड कैसे बनाएँ' : 'How to create a QR code',
    link: `${prefix.value}how-to-create-a-qr-code`
  },
  {
    text: isHi.value ? 'अपनी सटीक उम्र कैसे निकालें' : 'How to calculate your exact age',
    link: `${prefix.value}how-to-calculate-your-exact-age`
  },
  {
    text: isHi.value ? 'शब्द और अक्षर कैसे गिनें' : 'How to count words and characters',
    link: `${prefix.value}how-to-count-words-and-characters`
  }
])

const appLinks = [
  { text: 'ShrinkIt', link: 'how-to-resize-and-compress-images-with-shrinkit' },
  { text: 'Ricsline', link: 'how-to-create-synced-lyrics-lrc-with-ricsline' },
  { text: 'ResumeForge', link: 'how-to-build-a-resume-with-resumeforge' },
  { text: 'PDF Tools', link: 'how-to-work-with-pdfs-using-pdf-tools' },
  { text: 'Dusrel Mail', link: 'dusrel-mail-preview' }
]
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="footer-logo" :href="prefix">
            <img :src="withBase('/logo.svg')" alt="Dusrel logo" width="34" height="34" />
            <span>Dusrel Docs</span>
          </a>
          <p>
            Documentation for every Dusrel app and service. Guides, tools and
            concepts — in English and Hindi.
          </p>
          <p class="footer-brand-links">
            <a href="https://github.com/dusmamud/dusrel-docs" target="_blank" rel="noreferrer">GitHub</a>
            ·
            <a href="https://dusrel.com" target="_blank" rel="noreferrer">dusrel.com</a>
          </p>
        </div>

        <nav class="footer-col" :aria-label="isHi ? 'गाइड' : 'Guides'">
          <h3>{{ isHi ? 'गाइड' : 'Guides' }}</h3>
          <a v-for="item in guideLinks" :key="item.link" :href="item.link">{{ item.text }}</a>
        </nav>

        <nav class="footer-col" :aria-label="isHi ? 'ऐप्स' : 'Apps'">
          <h3>{{ isHi ? 'ऐप्स' : 'Apps' }}</h3>
          <a v-for="item in appLinks" :key="item.link" :href="prefix + item.link">{{ item.text }}</a>
        </nav>

        <nav class="footer-col" aria-label="Dusrel">
          <h3>Dusrel</h3>
          <a href="https://dusrel.com" target="_blank" rel="noreferrer">dusrel.com</a>
          <a href="https://github.com/dusmamud/dusrel-docs" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://github.com/dusmamud/dusrel-docs/issues" target="_blank" rel="noreferrer">Issues</a>
          <a href="mailto:hello@dusrel.com">hello@dusrel.com</a>
        </nav>
      </div>

      <div class="footer-bottom">
        <span>© 2026 Dus Mamud · A Dusrel project</span>
        <span class="footer-note">Docs are free to read — no account needed.</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  padding: 48px 24px 32px;
  margin-top: 64px;
}

.footer-inner {
  max-width: 1152px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px 32px;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: "Sora", "Inter", ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: var(--vp-c-text-1);
}

.footer-logo img {
  border-radius: 8px;
}

.footer-brand p {
  margin: 14px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  max-width: 36ch;
}

.footer-brand-links {
  font-size: 14px;
}

.footer-brand-links a,
.footer-bottom a {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col h3 {
  font-family: "Sora", "Inter", ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 4px 0 6px;
}

.footer-col a {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.footer-col a:hover,
.footer-brand-links a:hover,
.footer-bottom a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  justify-content: space-between;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 40px;
  padding-top: 20px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

@media (max-width: 860px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .site-footer {
    padding: 36px 20px 28px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer-bottom {
    flex-direction: column;
  }
}
</style>
