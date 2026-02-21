export const catImages = Array.from({ length: 48 }, (_, i) => {
  const num = String(i + 1).padStart(3, '0')
  return {
    src: `/katter/cat-${num}.webp`,
    alt: `Katt ${num} hos Mathopen Kattepensjonat`,
  }
})
