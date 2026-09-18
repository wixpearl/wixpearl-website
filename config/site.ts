import { footer } from './footer'
import { navigation } from './navigation'

export const siteConfig = {
  name: 'WixPearl',
  shortName: 'WixPearl',
  description:
    'Secure custom software, AI and automation solutions engineered around your business.',
  tagline: 'Software engineered around your business.',

  url: 'https://wixpearl.com',
  locale: 'en_US',
  location: 'Sri Lanka',
  email: 'hello@wixpearl.com',

  navigation,

  footer,
} as const
