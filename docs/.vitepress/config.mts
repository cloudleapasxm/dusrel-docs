import { defineConfig, type DefaultTheme } from 'vitepress'

// Sidebar titles come from each doc's frontmatter in the stable source
// (dusrel-site/src/content/docs/{en,hi}/). Links are clean URLs:
// EN '/<slug>', HI '/hi/<slug>'.
const sidebarEn: DefaultTheme.SidebarItem[] = [
  {
    text: 'Guides',
    collapsed: false,
    items: [
      { text: 'Getting started with Dusrel', link: '/getting-started-with-dusrel' },
    ],
  },
  {
    text: 'Tools',
    collapsed: false,
    items: [
      { text: 'How to generate a strong password', link: '/how-to-generate-a-strong-password' },
      { text: 'How to generate a username', link: '/how-to-generate-a-username' },
      { text: 'How to count words and characters', link: '/how-to-count-words-and-characters' },
      { text: 'How to create a QR code', link: '/how-to-create-a-qr-code' },
      { text: 'How to calculate your exact age', link: '/how-to-calculate-your-exact-age' },
      { text: 'How to check password strength', link: '/how-to-check-password-strength' },
    ],
  },
  {
    text: 'Apps',
    collapsed: false,
    items: [
      { text: 'How to resize and compress images with ShrinkIt', link: '/how-to-resize-and-compress-images-with-shrinkit' },
      { text: 'How to create synced lyrics (.lrc) with Ricsline', link: '/how-to-create-synced-lyrics-lrc-with-ricsline' },
      { text: 'How to build a resume with ResumeForge', link: '/how-to-build-a-resume-with-resumeforge' },
      { text: 'How to work with PDFs using PDF Tools', link: '/how-to-work-with-pdfs-using-pdf-tools' },
      { text: 'Dusrel Mail preview', link: '/dusrel-mail-preview' },
    ],
  },
  {
    text: 'Concepts',
    collapsed: false,
    items: [
      { text: 'Dusrel apps overview', link: '/dusrel-apps-overview' },
      { text: 'Privacy on your device', link: '/privacy-on-device' },
      { text: 'About Dusrel', link: '/about-dusrel' },
    ],
  },
]

const sidebarHi: DefaultTheme.SidebarItem[] = [
  {
    text: 'गाइड',
    collapsed: false,
    items: [
      { text: 'Dusrel से शुरुआत करें', link: '/hi/getting-started-with-dusrel' },
    ],
  },
  {
    text: 'टूल्स',
    collapsed: false,
    items: [
      { text: 'मज़बूत पासवर्ड कैसे बनाएँ', link: '/hi/how-to-generate-a-strong-password' },
      { text: 'यूज़रनेम कैसे बनाएँ', link: '/hi/how-to-generate-a-username' },
      { text: 'शब्द और अक्षर कैसे गिनें', link: '/hi/how-to-count-words-and-characters' },
      { text: 'QR कोड कैसे बनाएँ', link: '/hi/how-to-create-a-qr-code' },
      { text: 'अपनी सटीक उम्र कैसे निकालें', link: '/hi/how-to-calculate-your-exact-age' },
      { text: 'पासवर्ड की मज़बूती कैसे जांचें', link: '/hi/how-to-check-password-strength' },
    ],
  },
  {
    text: 'ऐप्स',
    collapsed: false,
    items: [
      { text: 'ShrinkIt से इमेज रीसाइज़ और कंप्रेस कैसे करें', link: '/hi/how-to-resize-and-compress-images-with-shrinkit' },
      { text: 'Ricsline से सिंक्ड लिरिक्स (.lrc) कैसे बनाएं', link: '/hi/how-to-create-synced-lyrics-lrc-with-ricsline' },
      { text: 'ResumeForge के साथ रिज़्यूमे कैसे बनाएँ', link: '/hi/how-to-build-a-resume-with-resumeforge' },
      { text: 'PDF Tools के साथ PDF पर कैसे काम करें', link: '/hi/how-to-work-with-pdfs-using-pdf-tools' },
      { text: 'Dusrel Mail प्रीव्यू', link: '/hi/dusrel-mail-preview' },
    ],
  },
  {
    text: 'अवधारणाएँ',
    collapsed: false,
    items: [
      { text: 'Dusrel ऐप्स का अवलोकन', link: '/hi/dusrel-apps-overview' },
      { text: 'आपके डिवाइस पर प्राइवेसी', link: '/hi/privacy-on-device' },
      { text: 'Dusrel के बारे में', link: '/hi/about-dusrel' },
    ],
  },
]

export default defineConfig({
  title: 'Dusrel Docs',
  description: 'Documentation for every Dusrel app and service.',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#4d90fe' }],
    ['meta', { property: 'og:site_name', content: 'Dusrel Docs' }],
  ],

  // Built-in sitemap: VitePress writes sitemap.xml from all pages.
  // lastmod comes from lastUpdated (git commit dates), so CI must check out
  // with fetch-depth: 0 — otherwise dates fall back to the build time.
  sitemap: {
    hostname: 'https://docs.dusrel.com',
    lastmodDateOnly: false,
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/getting-started-with-dusrel/' },
          { text: 'dusrel.com', link: 'https://dusrel.com' },
        ],
        sidebar: sidebarEn,
        outline: { level: 'deep', label: 'On this page' },
        editLink: {
          pattern: 'https://github.com/dusmamud/dusrel-docs/edit/main/docs/:path',
          text: 'Edit this page',
        },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        lastUpdated: { text: 'Updated' },
      },
    },
    hi: {
      label: 'हिन्दी',
      lang: 'hi',
      link: '/hi/',
      themeConfig: {
        nav: [
          { text: 'गाइड', link: '/hi/getting-started-with-dusrel/' },
          { text: 'dusrel.com', link: 'https://dusrel.com' },
        ],
        sidebar: sidebarHi,
        outline: { level: 'deep', label: 'इस पेज पर' },
        editLink: {
          pattern: 'https://github.com/dusmamud/dusrel-docs/edit/main/docs/:path',
          text: 'इस पेज को संपादित करें',
        },
        docFooter: { prev: 'पिछला पेज', next: 'अगला पेज' },
        lastUpdated: { text: 'अपडेट' },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Dusrel Docs',
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dusmamud/dusrel-docs' },
    ],
    langMenuLabel: 'Languages',
    returnToTopLabel: 'Return to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Appearance',
    lightModeSwitchTitle: 'Switch to light theme',
    darkModeSwitchTitle: 'Switch to dark theme',
  },
})
