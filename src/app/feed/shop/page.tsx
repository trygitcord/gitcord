import React from 'react'
import Image from 'next/image'

const shopItems = [
  {
    key: 'banner',
    title: 'Banner',
    description: 'Show off your profile with a custom banner.',
    image: '/banner.png',
    credits: 1200,
    gradient: 'from-[#4CFFAF] to-[#3ABA81]',
  },
  {
    key: 'frame',
    title: 'Profile Frame',
    description: 'Add a stylish frame to your profile picture.',
    image: '/member-card.png',
    credits: 1500,
    gradient: 'from-[#dd7bbb] to-[#d79f1e]',
  },
  {
    key: 'badge',
    title: 'Badge',
    description: 'Earn a unique badge for your achievements.',
    image: '/badge-1.png',
    credits: 800,
    gradient: 'from-[#5a922c] to-[#4c7894]',
  },
  {
    key: 'premium',
    title: 'Premium',
    description: 'Unlock all premium features and perks.',
    image: '/premium.png',
    credits: 3000,
    gradient: 'from-[#FF6B6B] to-[#4ECDC4]',
  },
  {
    key: 'background',
    title: 'Background',
    description: 'Customize your profile background.',
    image: '/light-preview-1.png',
    credits: 1000,
    gradient: 'from-[#5BC898] to-[#3A8D6D]',
  },
]

function ShopPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-neutral-100/80 via-[#e6f9f3]/60 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-12 px-2">
      <div className="max-w-2xl w-full text-center mb-10">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-[#5BC898] to-[#3A8D6D] bg-clip-text text-transparent drop-shadow-lg">Shop</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Get awesome items to customize your profile and stand out in the community!</p>
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {shopItems.map((item) => (
          <div
            key={item.key}
            className={
              `relative rounded-3xl p-8 border border-transparent bg-white/70 dark:bg-neutral-900/70 shadow-xl group overflow-hidden backdrop-blur-md transition-all duration-300 flex flex-col items-center
              before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none before:transition-all before:duration-300
              before:bg-gradient-to-br before:from-transparent before:via-[${item.gradient.split(' ')[0]}]/30 before:to-[${item.gradient.split(' ')[1]}]/40
              hover:before:opacity-100 before:opacity-60
              hover:shadow-[0_8px_32px_0_rgba(91,200,152,0.25)] hover:border-[#5BC898] dark:hover:border-[#5BC898]`
            }
            style={{ boxShadow: '0 4px 32px 0 rgba(91,200,152,0.10), 0 1.5px 8px 0 rgba(0,0,0,0.08)' }}
          >
            {/* Görsel ve ışık efekti */}
            <div className="relative mb-5 flex items-center justify-center w-28 h-28">
              <div className={`absolute inset-0 rounded-2xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-300 bg-gradient-to-br ${item.gradient}`} />
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white/60 dark:ring-neutral-800 group-hover:ring-[#5BC898] transition-all duration-300 shadow-lg">
                <Image src={item.image} alt={item.title} width={96} height={96} className="object-contain" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight drop-shadow-sm">{item.title}</h2>
            <p className="text-neutral-500 dark:text-neutral-300 text-base mb-6 text-center min-h-[40px] font-medium">{item.description}</p>
            {/* Kredi ve buton */}
            <div className="flex items-center justify-between w-full mt-auto pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-lg font-bold bg-gradient-to-r from-[#5BC898] to-[#3A8D6D] bg-clip-text text-transparent flex items-center drop-shadow-sm">
                {item.credits} <span className="ml-1 text-xs font-normal text-neutral-400 dark:text-neutral-500">Credits</span>
              </span>
              <button className="ml-auto px-7 py-2.5 rounded-xl bg-[#5BC898] text-white font-extrabold text-base shadow-lg hover:bg-[#47a87a] transition-colors hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5BC898]/40">Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShopPage